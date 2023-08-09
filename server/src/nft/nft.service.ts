import { randomUUID, createHash } from 'crypto'
import DataLoader from 'dataloader'
import { PubSub } from 'graphql-subscriptions'
import { ClientSession, Model, PipelineStage } from 'mongoose'

import { Inject, Injectable } from '@nestjs/common'

import { CacheService } from '~/cache/cache.service'
import { CollectionService } from '~/collection/collection.service'
import { MIST_PER_SUI, NFT_EVENT_MODEL, NFT_MODEL } from '~/const'
import { Paging, Sorting } from '~/types'

import { INft, INftAttribute, INftEvent } from './nft.schema'

export type NftSorting = 'order.priceMist' | 'name'

@Injectable()
export class NftService {
    nftsDataLoaderByCollectionAddrsssDataLoader: DataLoader<string, INft[]>
    nftsDataLoaderByOwnerAddrsssDataLoader: DataLoader<string, INft[]>
    nftsDataLoaderByNftAddressDataLoader: DataLoader<string, INft>
    ownedNftCountByOwnerDataLoader: DataLoader<string, number>
    nftEventPubSub: PubSub

    constructor(
        @Inject(NFT_MODEL) private readonly nftModel: Model<INft>,
        @Inject(NFT_EVENT_MODEL) readonly nftEventModel: Model<INftEvent>,
        private readonly cacheService: CacheService,
        private readonly collectionService: CollectionService,
    ) {
        this.nftEventPubSub = new PubSub()
        this.nftsDataLoaderByNftAddressDataLoader = cacheService.createCachedDataloader(
            async (addresses: readonly string[]) => {
                const nfts: INft[] = await nftModel
                    .find({ address: { $in: addresses } })
                    .lean()
                    .exec()

                const map = nfts.reduce<Record<string, INft>>((acc, curr) => {
                    acc[curr.address] = curr
                    return acc
                }, {})

                return addresses.map((address) => map[address])
            },
            'nft-dataloader',
        )

        this.nftsDataLoaderByCollectionAddrsssDataLoader = cacheService.createCachedDataloader(
            async (collectionAddresses: readonly string[]) => {
                const nfts: INft[] = await nftModel
                    .find({ collectionAddress: { $in: collectionAddresses } })
                    .lean()
                    .exec()

                const map = nfts.reduce<Record<string, INft[]>>((acc, curr) => {
                    if (curr.collectionAddress == null) {
                        return acc
                    }
                    acc[curr.collectionAddress] = acc[curr.collectionAddress] ?? []
                    acc[curr.collectionAddress].push(curr)
                    return acc
                }, {})

                return collectionAddresses.map((address) => map[address] ?? [])
            },
            'nft-collection-address-dataloader',
        )

        this.nftsDataLoaderByOwnerAddrsssDataLoader = cacheService.createCachedDataloader(
            async (ownerAddresses: readonly string[]) => {
                const nfts: INft[] = await nftModel
                    .find({ owner: { $in: ownerAddresses } })
                    .lean()
                    .exec()

                const map = nfts.reduce<Record<string, INft[]>>((acc, curr) => {
                    if (curr.owner == null) {
                        return acc
                    }
                    acc[curr.owner] = acc[curr.owner] ?? []
                    acc[curr.owner].push(curr)
                    return acc
                }, {})

                return ownerAddresses.map((address) => map[address] ?? [])
            },
            'nft-owner-address-dataloader',
        )

        this.ownedNftCountByOwnerDataLoader = cacheService.createCachedDataloader(
            async (addresses: readonly string[]) => {
                const nfts: INft[] = await nftModel
                    .find({ owner: { $in: addresses } })
                    .lean()
                    .exec()

                const map = nfts.reduce<Record<string, number>>((acc, curr) => {
                    if (curr.owner != null) {
                        acc[curr.owner] = acc[curr.owner] ?? 0
                        acc[curr.owner]++
                    }
                    return acc
                }, {})

                return addresses.map((address) => map[address] ?? 0)
            },
            'owned-nft-count-by-owner-dataloader',
        )

        if (process.env.NODE_ENV != null && process.env.NODE_ENV != 'test') {
            this.nftModel.watch().on('change', async (data: any) => {
                const nft = await this.nftModel.findById(data.documentKey._id)
                nft && this.nftsDataLoaderByNftAddressDataLoader.clear(nft.address)
                nft?.collectionAddress && this.nftsDataLoaderByCollectionAddrsssDataLoader.clear(nft.collectionAddress)
            })
        }

        if (process.env.NODE_ENV != null && process.env.NODE_ENV != 'test') {
            this.nftEventModel
                .watch([], { fullDocument: 'updateLookup', fullDocumentBeforeChange: 'whenAvailable' })
                .on('change', async (data: any) => {
                    if (data.operationType === 'insert') {
                        const nftEvent = data.fullDocument as INftEvent
                        this.nftEventPubSub.publish(nftEvent.nftAddress, { subscribeNftEvent: nftEvent })
                    }
                })
        }
    }

    static mapNftAttributes(attr: Record<string, string>): INftAttribute[] {
        return Object.keys(attr).map((name) => ({
            name,
            value: attr[name],
        }))
    }

    async getNft(options: { address: string }): Promise<INft | null> {
        return await this.nftModel.findOne({ address: options.address }).lean().exec()
    }

    getNftEventSubscription(nftAddress: string) {
        return this.nftEventPubSub.asyncIterator(nftAddress)
    }

    async findNfts(
        options: {
            collectionAddress?: string
            owner?: string
            keyword?: string
            minPrice?: number
            maxPrice?: number
            listedOnly?: boolean
            unlistedOnly?: boolean
            excludeOwner?: string
            attributes?: Record<string, string[]>
        } & Sorting<NftSorting> &
            Paging,
    ): Promise<{ items: INft[]; totalItems: number }> {
        const {
            collectionAddress,
            owner,
            keyword,
            minPrice,
            maxPrice,
            listedOnly,
            unlistedOnly,
            attributes,
            limit,
            skip,
            sortBy,
            order,
            excludeOwner,
        } = options
        const filters: PipelineStage.FacetPipelineStage[] = []

        if (collectionAddress != null) {
            filters.push({
                $match: {
                    collectionAddress,
                },
            })
        }

        if (owner != null) {
            filters.push({
                $match: {
                    owner,
                },
            })
        }

        if (keyword != null) {
            filters.push({
                $match: {
                    $or: [
                        {
                            name: { $regex: keyword, $options: 'i' },
                        },
                    ],
                },
            })
        }

        if (excludeOwner != null) {
            filters.push({
                $match: {
                    owner: {
                        $ne: excludeOwner,
                    },
                },
            })
        }

        filters.push({
            $addFields: {
                hasOrder: {
                    $cond: {
                        if: { $not: ['$order'] },
                        then: 0,
                        else: 1,
                    },
                },
            },
        })

        if (minPrice != null) {
            filters.push({
                $match: {
                    'order.priceMist': {
                        $gte: minPrice * Number(MIST_PER_SUI),
                    },
                },
            })
        }

        if (maxPrice != null) {
            filters.push({
                $match: {
                    $and: [
                        { 'order.priceMist': { $lte: maxPrice * Number(MIST_PER_SUI) } },
                        { 'order.priceMist': { $gt: 0 } },
                    ],
                },
            })
        }

        if (listedOnly === true) {
            filters.push({
                $match: {
                    order: {
                        $ne: null,
                    },
                },
            })
        }

        if (unlistedOnly === true) {
            filters.push({
                $match: {
                    order: {
                        $eq: null,
                    },
                },
            })
        }

        if (attributes != null) {
            Object.entries(attributes).forEach(([name, values]) => {
                filters.push({
                    $match: {
                        'attributes.name': name,
                        'attributes.value': {
                            $in: values,
                        },
                    },
                })
            })
        }

        const filterBuffer = Buffer.from(JSON.stringify(filters))
        const filterHash = createHash('sha256').update(filterBuffer).digest('hex')
        const cacheKey = `nft_total_items_cache_${filterHash}`
        const cached = await this.cacheService.get(cacheKey)

        const [total, items] = await Promise.all([
            cached != null
                ? Promise.resolve([{ count: parseInt(cached) }])
                : this.nftModel.aggregate([...filters, { $count: 'count' }]),
            this.nftModel.aggregate([
                ...filters,
                { $sort: { hasOrder: -1, [sortBy ?? 'name']: order === 'ASC' ? 1 : -1, _id: 1 } },
                { $skip: skip },
                { $limit: limit },
            ]),
        ])

        await this.cacheService.set(cacheKey, total?.[0]?.count ?? 0, 60)

        return { items, totalItems: total?.[0]?.count ?? 0 }
    }

    async findNftEvents(
        options: {
            address?: string
            collectionAddress?: string
        } & Paging,
    ): Promise<{ items: INftEvent[]; totalItems: number }> {
        const { address, collectionAddress, limit, skip } = options
        const filters: PipelineStage.FacetPipelineStage[] = []
        if (address != null) {
            filters.push({
                $match: {
                    nftAddress: address,
                },
            })
        }

        if (collectionAddress != null) {
            filters.push({
                $match: {
                    collectionAddress: collectionAddress,
                },
            })
        }

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

    async createNftEvent(options: Omit<INftEvent, 'id'>): Promise<INftEvent> {
        return await this.nftEventModel.create({ id: randomUUID(), ...options })
    }

    async upsertNft(address: string, options: Omit<INft, 'address'>): Promise<INft | null> {
        const result = await this.nftModel
            .findOneAndUpdate({ address }, { $set: options }, { upsert: true })
            .lean()
            .exec()
        if (result != null) {
            if (result.collectionAddress != null) {
                await this.collectionService.collectionItemCountDataLoader.clear(result.collectionAddress)
                await this.collectionService.collectionOwnerCountDataLoader.clear(result.collectionAddress)
                await this.collectionService.collectionsAttributesDataLoader.clear(result.collectionAddress)
            }
        }
        return result
    }

    async upsertNfts(nfts: Partial<INft>[], session?: ClientSession) {
        await this.nftModel.bulkWrite(
            nfts
                .filter((nft) => nft.address != null)
                .map((nft) => ({
                    updateOne: {
                        filter: { address: nft.address },
                        update: { $set: nft },
                        upsert: true,
                    },
                })),
            { session },
        )

        for (const nft of nfts) {
            if (nft.address != null) {
                this.nftsDataLoaderByNftAddressDataLoader.clear(nft.address)
            }
        }
    }

    async updateNftEvent(
        id: string,
        options: Omit<INftEvent, 'id' | 'nftAddress' | 'collectionAddress'>,
    ): Promise<INftEvent | null> {
        return await this.nftEventModel.findOneAndUpdate({ id }, { $set: options }).lean().exec()
    }

    async deleteNftEvent(id: string): Promise<INftEvent | null> {
        return await this.nftEventModel.findOneAndDelete({ id }).lean().exec()
    }

    async upsertNftEvents(nftEvents: INftEvent[], session?: ClientSession) {
        await this.nftEventModel.bulkWrite(
            nftEvents.map((event) => ({
                updateOne: {
                    filter: { txId: event.txId },
                    update: { $set: event },
                    upsert: true,
                },
            })),
            { session },
        )
    }

    async getNftTradeEventAfter(timestamp: number): Promise<INftEvent[]> {
        return await this.nftEventModel
            .find({ createdAt: { $gte: timestamp }, txId: { $ne: 'STATDATA' }, type: 'BUY' })
            .lean()
            .exec()
    }

    async findNftEventByTxId(txId: string): Promise<INftEvent | null> {
        return await this.nftEventModel.findOne({ txId }).lean().exec()
    }
}
