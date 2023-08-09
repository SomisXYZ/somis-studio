import DataLoader from 'dataloader'
import { PubSub } from 'graphql-subscriptions'
import _ from 'lodash'
import { Model, PipelineStage } from 'mongoose'

import { Inject, Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { CacheService, LockFail } from '~/cache/cache.service'
import { CollectionService } from '~/collection/collection.service'
import { COLLECTION_BID_MODEL, NFT_MODEL, TRADE_INTERMEDIATE_MODEL } from '~/const'
import { OrderEvent, Order } from '~/gql/generated'
import { INft } from '~/nft/nft.schema'
import { NftService } from '~/nft/nft.service'
import { SuiService } from '~/sui/sui.service'
import { Paging, Sorting } from '~/types'

import { ICollectionBid, IOrder, ITradeIntermediate } from './marketplace.schema'

const PUB_SUB_KEY = 'orderEvent'

export type NftOrderSorting = 'order.priceMist' | 'order.createdAt'

@Injectable()
export class MarketplaceService {
    listedNftCountByOwnerDataLoader: DataLoader<string, number>
    orderPubSub: PubSub
    constructor(
        @Inject(COLLECTION_BID_MODEL) private readonly collectionBidModel: Model<ICollectionBid>,
        @Inject(NFT_MODEL) private readonly nftModel: Model<INft>,
        @Inject(TRADE_INTERMEDIATE_MODEL) private readonly tradeIntermediateModel: Model<ITradeIntermediate>,
        private readonly nftService: NftService,
        private readonly collectionService: CollectionService,
        private readonly cacheService: CacheService,
        private readonly suiServcie: SuiService,
    ) {
        this.orderPubSub = new PubSub()

        this.listedNftCountByOwnerDataLoader = cacheService.createCachedDataloader(
            async (addresses: readonly string[]) => {
                const nfts: INft[] = await this.nftModel
                    .find({
                        order: { $exists: true },
                        'order.seller': { $in: addresses },
                    })
                    .lean()
                    .exec()

                const map = nfts.reduce<Record<string, number>>((acc, curr) => {
                    if (curr.order != null) {
                        acc[curr.order.seller] = acc[curr.order.seller] ?? 0
                        acc[curr.order.seller]++
                    }
                    return acc
                }, {})

                return addresses.map((address) => map[address] ?? 0)
            },
            'listed-nft-count-by-owner-dataloader',
        )

        if (process.env.NODE_ENV != null && process.env.NODE_ENV != 'test') {
            this.nftModel
                .watch([], { fullDocument: 'updateLookup', fullDocumentBeforeChange: 'whenAvailable' })
                .on('change', async (data: any) => {
                    const nft = data.fullDocument as INft
                    if (nft.collectionAddress == null) {
                        return
                    }
                    if (data.operationType === 'update') {
                        this.orderPubSub.publish(nft.collectionAddress, {
                            subscribeCollectionOrders: {
                                order: nft.order as unknown as Order | null,
                                type: nft.order == null ? 'REMOVED' : 'NEW',
                                nft: nft,
                            } as OrderEvent,
                        })
                    }
                })
        }
    }

    async getOrderByNft(address: string): Promise<IOrder | null> {
        return (await this.nftModel.findOne({ address: address }).lean().exec())?.order ?? null
    }

    async getOrdersByCollection(options: { collectionAddress: string } & Sorting<NftOrderSorting> & Paging) {
        const { collectionAddress, skip, limit, sortBy, order } = options
        const filters: PipelineStage.FacetPipelineStage[] = []

        filters.push({ $match: { collectionAddress, order: { $exists: true } } })

        const result = (await this.nftModel.aggregate([
            {
                $facet: {
                    totalItems: [...filters, { $count: 'count' }],
                    items: [
                        ...filters,
                        { $sort: { [sortBy]: order === 'ASC' ? 1 : -1 } } as PipelineStage.Sort,
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
        ])) as { items: INft[]; totalItems: number }[]

        return { items: result[0].items.map((it) => it.order), totalItems: result[0].totalItems }
    }

    private async publishOrderEvent(order: IOrder, type: 'NEW' | 'REMOVED') {
        await this.cacheService.publish(PUB_SUB_KEY, JSON.stringify({ type, order }))
    }

    getOrderEventSubscription(collectionAddress: string) {
        return this.orderPubSub.asyncIterator(collectionAddress)
    }
}
