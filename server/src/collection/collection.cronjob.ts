import _ from 'lodash'
import { Model, Cursor } from 'mongoose'

import { Inject } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { CacheService, LockFail } from '~/cache/cache.service'
import { COLLECTION_MODEL, COLLECTION_STATS_MODEL, MIST_PER_SUI } from '~/const'

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

type CollectionEventsQueryRes = {
    address: string
    events: {
        createdAt: number
        price: string
    }[]
    floor: number
}

type CollectionStatsQueryRes = {
    address: string
    vol7D: number
    vol30D: number
    totalVol: number
}

export class CollectionCronJobService {
    constructor(
        @Inject(COLLECTION_MODEL) private readonly collectionModel: Model<ICollection>,
        @Inject(COLLECTION_STATS_MODEL) private readonly collectionStatsModel: Model<ICollectionStats>,
        private readonly cacheService: CacheService,
    ) {}

    // every min
    @Cron('0 * * * * *')
    async updateCollectionStats24H() {
        if (process.env.NODE_ENV === 'develop') {
            return
        }
        const jobKey = 'execute_update_collection_stats_24H'
        try {
            await this.cacheService.lock(jobKey, 60)

            const now = Date.now()
            const msInDay = 24 * 60 * 60 * 1000
            const yesterday = now - msInDay
            const ereyesterday = yesterday - msInDay
            const cursor: Cursor<CollectionEventsQueryRes> = this.collectionModel
                .aggregate([
                    {
                        $lookup: {
                            from: 'nft_events',
                            localField: 'address',
                            foreignField: 'collectionAddress',
                            as: 'events',
                            pipeline: [{ $match: { type: 'BUY', createdAt: { $gte: ereyesterday } } }],
                        },
                    },
                    {
                        $lookup: {
                            from: 'nfts',
                            localField: 'address',
                            foreignField: 'collectionAddress',
                            as: 'nfts',
                            pipeline: [{ $match: { order: { $exists: true } } }],
                        },
                    },
                    { $project: { address: 1, floor: { $min: '$nfts.order.priceMist' }, events: 1 } },
                ])
                .cursor()

            const statsArray: Partial<ICollectionStats>[] = []
            for await (const collection of cursor) {
                const events = collection.events
                const vol24 = events
                    .filter((event) => event.createdAt >= yesterday)
                    .reduce((acc, event) => acc + parseFloat(event.price), 0)

                const oldVol24 = events
                    .filter((event) => event.createdAt >= ereyesterday && event.createdAt < yesterday)
                    .reduce((acc, event) => acc + parseFloat(event.price), 0)

                const stats: Partial<ICollectionStats> = {
                    collectionAddress: collection.address,
                    vol24: vol24.toString(),
                    vol24Delta: oldVol24 > 0 ? (((vol24 - oldVol24) / oldVol24) * 100).toString() : null,
                    floor: (collection.floor / Number(MIST_PER_SUI)).toString(),
                    updatedAt: now,
                }

                statsArray.push(stats)
            }

            await this.collectionStatsModel.bulkWrite(
                statsArray.map((it) => ({
                    updateOne: {
                        filter: { collectionAddress: it.collectionAddress },
                        update: { $set: it },
                        upsert: true,
                    },
                })),
            )
        } catch (err: any) {
            if (err instanceof LockFail) {
                // the job is running
            } else {
                throw err
            }
        } finally {
            await this.cacheService.unlock(jobKey)
        }
    }

    // every 15 mins
    @Cron('0 */15 * * * *')
    async updateCollectionStats30D() {
        if (process.env.NODE_ENV === 'develop') {
            return
        }
        const jobKey = 'execute_update_collection_stats_7D_30D'
        try {
            await this.cacheService.lock(jobKey, 60)

            const now = Date.now()
            const msInDay = 24 * 60 * 60 * 1000
            const sevenDaysAgo = now - msInDay * 7
            const thirthyDaysAgo = now - msInDay * 30
            const cursor: Cursor<CollectionStatsQueryRes> = this.collectionModel
                .aggregate([
                    {
                        $lookup: {
                            from: 'nft_events',
                            localField: 'address',
                            foreignField: 'collectionAddress',
                            as: 'events',
                            pipeline: [
                                { $match: { type: 'BUY' } },
                                {
                                    $project: {
                                        _id: 0,
                                        createdAt: 1,
                                        price: { $toDouble: '$price' },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            event7D: {
                                $filter: {
                                    input: '$events',
                                    as: 'event',
                                    cond: {
                                        $gte: ['$$event.createdAt', sevenDaysAgo],
                                    },
                                },
                            },
                            event30D: {
                                $filter: {
                                    input: '$events',
                                    as: 'event',
                                    cond: {
                                        $gte: ['$$event.createdAt', thirthyDaysAgo],
                                    },
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            address: 1,
                            vol7D: { $sum: '$event7D.price' },
                            vol30D: { $sum: '$event30D.price' },
                            totalVol: { $sum: '$events.price' },
                        },
                    },
                ])
                .cursor()

            const statsArray: Partial<ICollectionStats>[] = []

            for await (const collection of cursor) {
                const { address, vol7D, vol30D, totalVol } = collection
                const stats: Partial<ICollectionStats> = {
                    collectionAddress: address,
                    totalVol: totalVol.toString(),
                    vol7D: vol7D.toString(),
                    vol30D: vol30D.toString(),
                }
                statsArray.push(stats)
            }

            await this.collectionStatsModel.bulkWrite(
                statsArray.map((it) => ({
                    updateOne: {
                        filter: { collectionAddress: it.collectionAddress },
                        update: { $set: it },
                        upsert: true,
                    },
                })),
            )
        } catch (err: any) {
            if (err instanceof LockFail) {
                // the job is running
            } else {
                throw err
            }
        } finally {
            await this.cacheService.unlock(jobKey)
        }
    }
}
