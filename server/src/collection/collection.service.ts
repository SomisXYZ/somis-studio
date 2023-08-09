import DataLoader from 'dataloader'
import _ from 'lodash'
import { Expression, Model, PipelineStage } from 'mongoose'

import { Inject, Injectable } from '@nestjs/common'

import { CacheService } from '~/cache/cache.service'
import {
    COLLECTION_BID_MODEL,
    COLLECTION_MODEL,
    COLLECTION_STATS_MODEL,
    MIST_PER_SUI,
    NFT_EVENT_MODEL,
    NFT_MODEL,
} from '~/const'
import { CollectionAttribute } from '~/gql/generated'
import { ICollectionBid, IOrder } from '~/marketplace/marketplace.schema'
import { INft, INftEvent } from '~/nft/nft.schema'
import { IContext, Paging, Sorting } from '~/types'
import { AuthError, CustomError, GenericError } from '~/utils/error'
import { sleep } from '~/utils/func'

import { ICollection, ICollectionStats } from './collection.schema'

export type CollectionSorting =
    | 'name'
    | 'stats.totalItems'
    | 'stats.floor'
    | 'stats.vol24'
    | 'stats.vol24Delta'
    | 'stats.totalVol'
    | 'stats.owner'
    | 'stats.listedItem'

type EventMongoReducerState = { last: number; price: string | null }
type EventState = { createdAt: number; price: string }

type Tick = {
    o: number
    c: number
    h: number
    l: number
    v: number
    ts: number
}

const lastSaleAccumulator: Expression.Accumulator = {
    $accumulator: {
        accumulateArgs: ['$event'],
        init: function () {
            return { last: 0, price: null }
        },
        accumulate: function (state: EventMongoReducerState, item: EventState) {
            return item.createdAt > state.last
                ? {
                      last: item.createdAt,
                      price: item.price,
                  }
                : state
        },
        merge: function (s1: EventState, s2: EventState) {
            return s1.createdAt > s2.createdAt ? s1 : s2
        },
        finalize: function (state: EventState) {
            return state.price
        },
        lang: 'js',
    },
}

@Injectable()
export class CollectionService {
    collectionDataLoader: DataLoader<string, ICollection>
    collectionBySlugDataLoader: DataLoader<string, ICollection>
    collectionStatsDataLoader: DataLoader<string, ICollectionStats>
    collectionsAttributesDataLoader: DataLoader<string, CollectionAttribute[]>
    collectionItemCountDataLoader: DataLoader<string, number>
    collectionOwnerCountDataLoader: DataLoader<string, number>
    collectionListedCountDataLoader: DataLoader<string, number>

    constructor(
        @Inject(COLLECTION_MODEL) private readonly collectionModel: Model<ICollection>,
        @Inject(NFT_MODEL) private readonly nftModel: Model<INft>,
        @Inject(NFT_EVENT_MODEL) private readonly nftEventModel: Model<INftEvent>,
        @Inject(COLLECTION_STATS_MODEL) private readonly collectionStatsModel: Model<ICollectionStats>,
        @Inject(COLLECTION_BID_MODEL) private readonly collectionBidModel: Model<ICollectionBid>,
        private readonly cacheService: CacheService,
    ) {
        this.collectionDataLoader = cacheService.createCachedDataloader(
            async (collectionAddresses: readonly string[]) => {
                const stats = await this.collectionModel
                    .find({ address: { $in: collectionAddresses } })
                    .lean()
                    .exec()

                const map = stats.reduce<Record<string, ICollection>>((acc, curr) => {
                    acc[curr.address] = curr
                    return acc
                }, {})

                return collectionAddresses.map((collectionAddress) => map[collectionAddress])
            },
            'collection-dataloader',
        )

        this.collectionBySlugDataLoader = cacheService.createCachedDataloader(async (slugs) => {
            const stats = await this.collectionModel
                .find({ slug: { $in: slugs } })
                .lean()
                .exec()

            const map = stats.reduce<Record<string, ICollection>>((acc, curr) => {
                acc[curr.slug] = curr
                return acc
            }, {})

            return slugs.map((slug) => map[slug])
        }, 'collection-dataloader-slug')

        this.collectionStatsDataLoader = cacheService.createCachedDataloader(async (collectionAddresses) => {
            const stats = await this.collectionStatsModel
                .find({ collectionAddress: { $in: collectionAddresses } })
                .lean()
                .exec()

            const map = stats.reduce<Record<string, ICollectionStats>>((acc, curr) => {
                acc[curr.collectionAddress] = curr
                return acc
            }, {})

            return collectionAddresses.map((collectionAddress) => map[collectionAddress])
        }, 'collection-stats-dataloader')

        this.collectionsAttributesDataLoader = cacheService.createCachedDataloader(async (collectionAddresses) => {
            const result: {
                collectionAddress: string
                name: string
                value: string
                items: number
                floor: string
            }[] = (
                await this.nftModel.aggregate([
                    {
                        $match: {
                            collectionAddress: { $in: collectionAddresses },
                        },
                    },
                    {
                        $lookup: {
                            from: 'nft_events',
                            localField: 'address',
                            foreignField: 'nftAddress',
                            as: 'event',
                            // TODO: may need to update the filer when we support auction
                            pipeline: [{ $match: { type: 'BUY' } }, { $sort: { createAt: -1 } }, { $limit: 1 }],
                        },
                    },
                    {
                        $addFields: {
                            event: {
                                $arrayElemAt: ['$event', 0],
                            },
                        },
                    },
                    {
                        $addFields: {
                            'event.price': {
                                // Convert the price for finding the lastSale
                                $toDouble: '$event.price',
                            },
                        },
                    },
                    {
                        $unwind: '$attributes',
                    },
                    {
                        $group: {
                            _id: {
                                collectionAddress: '$collectionAddress',
                                name: '$attributes.name',
                                value: '$attributes.value',
                            },
                            items: { $count: {} },
                            floor: {
                                $min: '$order.priceMist',
                            },
                            lastSale: lastSaleAccumulator,
                        },
                    },
                ])
            ).map((it: any) => ({
                name: it._id.name,
                collectionAddress: it._id.collectionAddress,
                value: it._id.value,
                items: it.items,
                floor: ((it.floor ?? 0) / Number(MIST_PER_SUI)).toString(),
                lastSale: it.lastSale?.toString(),
            }))

            const collectionStats = await this.collectionStatsDataLoader.loadMany(collectionAddresses)

            const collectionAttributes = _.groupBy(result, 'collectionAddress')
            const totalItems = await this.collectionItemCountDataLoader.loadMany(collectionAddresses)

            return collectionAddresses.map((collectionAddress, idx) => {
                const map = _.groupBy(collectionAttributes[collectionAddress], 'name')
                const stats = collectionStats.find((it) =>
                    it == null || it instanceof Error ? false : it.collectionAddress === collectionAddress,
                ) as ICollectionStats | undefined
                const totalItem = totalItems[idx]

                return Object.entries(map).map(([name, values]) => ({
                    name,
                    values: values.map((value) => ({
                        ...value,
                        percentage:
                            stats != null && typeof totalItem === 'number' && totalItem > 0
                                ? value.items / totalItem
                                : 0,
                    })),
                }))
            })
        }, 'nft-attr-stats-dataloader')

        this.collectionItemCountDataLoader = cacheService.createCachedDataloader(
            async (collectionAddresses: readonly string[]) => {
                const result = await this.nftModel.aggregate([
                    { $match: { collectionAddress: { $in: collectionAddresses } } },
                    { $group: { _id: '$collectionAddress', items: { $count: {} } } },
                ])

                const map = result.reduce((acc, curr) => {
                    acc[curr._id] = curr.items
                    return acc
                }, {})

                return collectionAddresses.map((address) => map[address] ?? 0)
            },
            'collection-item-count-dataloader',
        )

        this.collectionOwnerCountDataLoader = cacheService.createCachedDataloader(
            async (collectionAddresses: readonly string[]) => {
                const result = await this.nftModel.aggregate([
                    { $match: { collectionAddress: { $in: collectionAddresses } } },
                    { $group: { _id: '$collectionAddress', owners: { $addToSet: '$owner' } } },
                    { $project: { _id: 1, owners: { $size: '$owners' } } },
                ])

                const map = result.reduce((acc, curr) => {
                    acc[curr._id] = curr.owners
                    return acc
                }, {})

                return collectionAddresses.map((address) => map[address] ?? 0)
            },
            'collection-owner-count-dataloader',
        )

        // fixme
        this.collectionListedCountDataLoader = cacheService.createCachedDataloader(
            async (collectionAddresses: readonly string[]) => {
                const result = await this.nftModel.aggregate([
                    { $match: { collectionAddress: { $in: collectionAddresses }, order: { $exists: true } } },
                    { $group: { _id: '$collectionAddress', orders: { $addToSet: '$order.id' } } },
                    { $project: { _id: 1, count: { $size: '$orders' } } },
                ])

                const map = result.reduce((acc, curr) => {
                    acc[curr._id] = curr.count
                    return acc
                }, {})

                return collectionAddresses.map((address) => map[address] ?? 0)
            },
            'collection-listed-count-dataloader',
        )
    }

    async getCollection(options: { address: string }): Promise<ICollection | null> {
        return await this.collectionModel.findOne({ address: options.address }).lean().exec()
    }

    async findCollections(
        options: {
            keyword?: string | null
            verified?: boolean | null
            whitelisted?: boolean
        } & Sorting<CollectionSorting> &
            Paging,
    ): Promise<{ items: ICollection[]; totalItems: number }> {
        const { keyword, skip, limit, sortBy, order, verified, whitelisted } = options
        const filters: PipelineStage.FacetPipelineStage[] = []

        if (whitelisted) {
            filters.push({ $match: { whitelisted: true } })
        }

        filters.push({
            $lookup: {
                from: 'users',
                localField: 'creators.address',
                foreignField: 'address',
                as: 'creators_list',
            },
        })

        if (keyword != null) {
            const expandedKeyword = keyword.replace(' ', '.*')
            filters.push({
                $match: {
                    $or: [
                        {
                            name: {
                                $regex: expandedKeyword,
                                $options: 'i',
                            },
                        },
                        {
                            description: {
                                $regex: expandedKeyword,
                                $options: 'i',
                            },
                        },
                        {
                            'creators_list.name': {
                                $regex: expandedKeyword,
                                $options: 'i',
                            },
                        },
                        {
                            'creators_list.username': {
                                $regex: expandedKeyword,
                                $options: 'i',
                            },
                        },
                    ],
                },
            })
        }

        if (verified != null) {
            filters.push({
                $match: {
                    verified: verified,
                },
            })
        }

        const result = (await this.collectionModel.aggregate([
            {
                $facet: {
                    totalItems: [...filters, { $count: 'count' }],
                    items: [
                        ...filters,
                        {
                            $lookup: {
                                from: 'collections_stats',
                                localField: 'address',
                                foreignField: 'collectionAddress',
                                as: 'stats',
                            },
                        },
                        { $addFields: { stats: { $arrayElemAt: ['$stats', 0] } } },
                        {
                            // Convert for sorting
                            $addFields: {
                                'stats.vol24': {
                                    $convert: {
                                        input: '$stats.vol24',
                                        to: 'double',
                                        onError: 0,
                                        onNull: 0,
                                    },
                                },
                                'stats.vol24Delta': {
                                    $convert: {
                                        input: '$stats.vol24Delta',
                                        to: 'double',
                                        onError: 0,
                                        onNull: 0,
                                    },
                                },
                                'stats.totalVol': {
                                    $convert: {
                                        input: '$stats.totalVol',
                                        to: 'double',
                                        onError: 0,
                                        onNull: 0,
                                    },
                                },
                                'stats.floor': {
                                    $convert: {
                                        input: '$stats.floor',
                                        to: 'double',
                                        onError: 0,
                                        onNull: 0,
                                    },
                                },
                            },
                        },
                        { $sort: { [sortBy]: order === 'ASC' ? 1 : -1, _id: 1 } } as PipelineStage.Sort,
                        { $skip: skip },
                        { $limit: limit },
                    ],
                },
            },
            {
                $addFields: {
                    totalItems: {
                        $arrayElemAt: ['$totalItems', 0],
                    },
                },
            },
            {
                $addFields: {
                    totalItems: {
                        $ifNull: ['$totalItems.count', 0],
                    },
                },
            },
            {
                $project: {
                    stats: false,
                    creators_list: false,
                },
            },
        ])) as { items: ICollection[]; totalItems: number }[]

        return result[0]
    }

    async findNftEvents(
        options: {
            address: string
        } & Paging,
    ): Promise<{ items: INftEvent[]; totalItems: number }> {
        const { address, limit, skip } = options
        const filters: PipelineStage.FacetPipelineStage[] = [
            {
                $match: {
                    collectionAddress: address,
                },
            },
        ]
        const result = (await this.nftEventModel.aggregate([
            {
                $facet: {
                    totalItems: [...filters, { $count: 'count' }],
                    items: [...filters, { $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit }],
                },
            },
            {
                $addFields: {
                    totalItems: {
                        $arrayElemAt: ['$totalItems', 0],
                    },
                },
            },
            {
                $addFields: {
                    totalItems: {
                        $ifNull: ['$totalItems.count', 0],
                    },
                },
            },
        ])) as { items: INftEvent[]; totalItems: number }[]

        return result[0]
    }

    async createCollection(fields: Partial<ICollection> & { address: string }): Promise<ICollection> {
        return await this.collectionModel.create(fields)
    }

    async updateCollection(address: string, fields: Partial<Omit<ICollection, 'address'>>) {
        const result = await this.collectionModel.findOneAndUpdate({ address }, { $set: fields }).lean().exec()
        if (result != null) {
            this.purgeDataLoader(result)
        }
        return result
    }

    async deleteCollection(address: string) {
        const result = await this.collectionModel.findOneAndDelete({ address }).lean().exec()
        if (result != null) {
            this.purgeDataLoader(result)
        }
        return result
    }

    purgeDataLoader(collection: ICollection) {
        this.collectionDataLoader.clear(collection.address)
        this.collectionBySlugDataLoader.clear(collection.slug)
        this.collectionStatsDataLoader.clear(collection.address)
        this.collectionItemCountDataLoader.clear(collection.address)
        this.collectionOwnerCountDataLoader.clear(collection.address)
        this.collectionListedCountDataLoader.clear(collection.address)
    }

    async getCollectionScatterChartData(options: { address: string; from: number; to: number }) {
        const { address, from, to } = options

        const key = ['chartScatterData', address, from, to].join('-')

        const cached = await this.cacheService.get(key)
        if (cached) {
            return JSON.parse(cached) as { p: number; ts: number }[]
        }

        const result = (
            await this.nftEventModel
                .find({
                    $and: [
                        { collectionAddress: address },
                        { createdAt: { $gte: from } },
                        { createdAt: { $lte: to } },
                        { $or: [{ type: 'BUY' }] },
                    ],
                })
                .sort({ createdAt: 1 })
        ).map((event: INftEvent) => ({ p: parseFloat(event.price ?? '0'), ts: event.createdAt }))

        await this.cacheService.set(key, JSON.stringify(result), 3600)

        return result
    }

    async calculateCollectionChartData(options: {
        address: string
        interval: number
        intervalUnit: 'MIN' | 'HOUR' | 'DAY'
        from: number
        to: number
    }): Promise<Tick[]> {
        const { address, interval, intervalUnit, from, to } = options

        const key = ['chartData', address, interval, intervalUnit, from, to].join('-')

        const cached = await this.cacheService.get(key)
        if (cached) {
            return JSON.parse(cached) as Tick[]
        }
        let tickDuration = 60 * 1000 * interval
        switch (intervalUnit) {
            case 'MIN':
                // noop
                break
            case 'HOUR':
                tickDuration = tickDuration * 60
                break
            case 'DAY':
                tickDuration = tickDuration * 60 * 24
                break
        }

        const events = await this.nftEventModel
            .find({
                $and: [
                    { collectionAddress: address },
                    { createdAt: { $gte: from } },
                    { createdAt: { $lte: to } },
                    { $or: [{ type: 'BUY' }, { type: 'FULFILL_COLLECTION_BID' }] },
                ],
            })
            .sort({ createdAt: 1 })

        if (events.length === 0) {
            return []
        }
        const first = events[0]
        let lastPrice = parseFloat(first.price ?? '0')

        const results: Tick[] = []

        let time = from

        while (time <= to) {
            const eventsInTick = []
            while (true) {
                const event = events.shift()
                if (event != null && event.createdAt < time) {
                    eventsInTick.push(event)
                } else {
                    if (event != null) {
                        events.unshift(event)
                    }
                    break
                }
            }

            if (eventsInTick.length === 0 && results.length === 0) {
                time += tickDuration
                continue
            }

            const price = eventsInTick.length === 0 ? lastPrice : parseFloat(eventsInTick[0].price ?? '0')

            const last = eventsInTick.reduce<Tick>(
                (acc, curr) => {
                    const currPrice = parseFloat(curr.price ?? '0')
                    if (currPrice > acc.h) {
                        acc.h = currPrice
                    }
                    if (currPrice < acc.l) {
                        acc.l = currPrice
                    }
                    acc.c = price
                    acc.v = acc.v + currPrice
                    return acc
                },
                {
                    o: lastPrice,
                    c: price,
                    h: price,
                    l: price,
                    v: 0,
                    ts: time,
                },
            )

            lastPrice = last.c

            results.push(last)

            time += tickDuration
        }

        await this.cacheService.set(key, JSON.stringify(results), 3600)

        return results
    }

    async ownedCollectionAddresses(options: { owner: string }): Promise<Map<string, number>> {
        return (await this.nftModel.find({ owner: options.owner }).lean().exec()).reduce<Map<string, number>>(
            (acc, curr) => {
                if (curr.collectionAddress != null) {
                    const old = acc.get(curr.collectionAddress) ?? 0
                    acc.set(curr.collectionAddress, old + 1)
                }
                return acc
            },
            new Map(),
        )
    }

    async getCollectionBidByUser({ collectionAddress, user }: { collectionAddress: string; user: string }) {
        return await this.collectionBidModel.find({ bidder: user, collectionAddress }).lean().exec()
    }

    async getCollectionBidStats({ collectionAddress }: { collectionAddress: string }) {
        const bids = await this.collectionBidModel
            .find({ collectionAddress }, null, { collation: { numericOrdering: true, locale: 'en_US' } })
            .sort({ price: -1 })
            .lean()
            .exec()

        type Bucket = { price: string; priceNum: number; numberOfBid: number; owner: Set<string> }
        const buckets: Map<string, Bucket> = new Map()

        bids.forEach((bid) => {
            let bucket = buckets.get(bid.price)
            if (bucket == null) {
                bucket = {
                    price: bid.price,
                    priceNum: parseFloat(bid.price),
                    numberOfBid: 1,
                    owner: new Set(bid.bidder),
                }
            } else {
                bucket.numberOfBid += 1
                bucket.owner.add(bid.bidder)
            }
            buckets.set(bid.price, bucket)
        })

        return [...buckets.values()]
            .sort((a, b) => b.priceNum - a.priceNum)
            .map((it) => ({
                ...it,
                owner: it.owner.size,
            }))
    }

    async findCollection({ orderbook }: { orderbook: string }) {
        return await this.collectionModel.findOne({ orderbook }).lean().exec()
    }

    async verifyCollectionOwner(ctx: IContext, collectionAddress: string) {
        // The GraphQL directive should already make sure user need to login
        if (ctx.userPublicKey == null) {
            throw new CustomError(AuthError.Unauthorized)
        }
        if (ctx.role !== 'ADMIN') {
            const collection = await this.getCollection({ address: collectionAddress })
            if (collection?.owner !== ctx.userPublicKey) {
                throw new CustomError(AuthError.Unauthorized).addDetails({
                    message: 'You are not admin or the owner of the collection',
                })
            }
        }
    }

    async groupCollectionByType({ collectionAddress }: { collectionAddress: string }) {
        const collection = await this.collectionModel.findOne({ address: collectionAddress })
        if (collection?.type == null) {
            throw new Error('Cannot group collection with type=null')
        }

        await this.nftModel.updateMany({ type: collection.type }, { $set: { collectionAddress } })
        // some without 0x prefix
        await this.nftModel.updateMany({ type: collection.type.replace(/0x/g, '') }, { $set: { collectionAddress } })
    }

    async indexCollectionByContract({ collectionAddress }: { collectionAddress: string }) {
        const collection = await this.collectionModel.findOne({ address: collectionAddress }).lean().exec()
        if (collection == null) {
            throw new CustomError(GenericError.NotFound)
        }
        if (collection?.type == null) {
            throw new Error('Cannot index collection with type=null')
        }
    }
}
