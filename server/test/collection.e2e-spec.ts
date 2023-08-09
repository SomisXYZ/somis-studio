import { gql } from 'apollo-server-express'
import { randomBytes } from 'crypto'
import { Model, Mongoose } from 'mongoose'

import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { S3Service } from '~/aws/s3.service'
import { SqsService } from '~/aws/sqs.service'
import { CollectionCronJobService } from '~/collection/collection.cronjob'
import { ICollection, ICollectionStats } from '~/collection/collection.schema'
import {
    COLLECTION_MODEL,
    COLLECTION_STATS_MODEL,
    DATABASE_CONNECTION,
    NFT_EVENT_MODEL,
    NFT_MODEL,
    S3_PROVIDER,
    SQS_PROVIDER,
    USER_MODEL,
} from '~/const'
import { Collection } from '~/gql/generated'
import { INft, INftEvent } from '~/nft/nft.schema'
import { IUser } from '~/user/user.schema'

import { AppModule } from '../src/app.module'
import { GqlClient } from './utils/gql'

describe('Collection (e2e)', () => {
    let app: INestApplication
    let gqlClient: GqlClient

    let collectionModel: Model<ICollection>
    let nftModel: Model<INft>
    let userModel: Model<IUser>
    let nftEventModel: Model<INftEvent>
    let collectionStatsModel: Model<ICollectionStats>

    let collectionCronJobService: CollectionCronJobService
    let connection: Mongoose

    const initDB = async () => {
        await collectionModel.deleteMany({})
        await userModel.deleteMany({})
        await nftModel.deleteMany({})
        await nftEventModel.deleteMany({})
        await collectionStatsModel.deleteMany({})
    }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(S3_PROVIDER)
            .useValue(null)
            .overrideProvider(SQS_PROVIDER)
            .useValue(null)
            .overrideProvider(S3Service)
            .useValue(null)
            .overrideProvider(SqsService)
            .useValue(null)
            .compile()

        app = moduleFixture.createNestApplication()
        collectionModel = moduleFixture.get(COLLECTION_MODEL)
        nftModel = moduleFixture.get(NFT_MODEL)
        userModel = moduleFixture.get(USER_MODEL)
        nftEventModel = moduleFixture.get(NFT_EVENT_MODEL)
        collectionStatsModel = moduleFixture.get(COLLECTION_STATS_MODEL)
        collectionCronJobService = moduleFixture.get(CollectionCronJobService)
        connection = moduleFixture.get(DATABASE_CONNECTION)
        app.enableShutdownHooks()
        await app.init()

        gqlClient = new GqlClient(app.getHttpServer())
    })

    beforeEach(async () => {
        await initDB()
    })

    afterAll(async () => {
        await app.close()
        await connection.disconnect()
    })

    it('collections.stats', async () => {
        await collectionModel.insertMany([
            { name: 'test collection 1', address: 'collection-1', slug: 'collection-1' },
            { name: 'test collection 2', address: 'collection-2', slug: 'collection-2' },
        ])

        await nftModel.insertMany([
            {
                name: 'test nft 1',
                address: 'nft-1',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '1', nftAddress: 'nft-1', price: '2' },
            },
            {
                name: 'test nft 2',
                address: 'nft-2',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '2', nftAddress: 'nft-2', price: '0.5' },
            },
            {
                name: 'test nft 3',
                address: 'nft-3',
                collectionAddress: 'collection-2',
                imageUrl: '-',
                order: { id: '3', nftAddress: 'nft-3', price: '5' },
            },
        ])

        await nftEventModel.insertMany([
            {
                id: '1',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.4',
                createdAt: Date.now(),
            },
            {
                id: '2',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '3',
                createdAt: Date.now(),
            },
            {
                id: '3',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-3',
                collectionAddress: 'collection-2',
                type: 'BUY',
                price: '5',
                createdAt: Date.now(),
            },
            {
                id: '4',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '5',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '6',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '3',
                createdAt: Date.now() - 49 * 60 * 60 * 1000,
            },
        ])

        await collectionCronJobService.updateCollectionStats24H()
        await collectionCronJobService.updateCollectionStats30D()
        const { data, errors } = await gqlClient.send<{ collections: Collection[] }>(
            gql`
                query {
                    collections {
                        items {
                            name
                            address
                            stats {
                                totalItems
                                floor
                                vol24
                                vol24Delta
                                totalVol
                            }
                        }
                        totalItems
                    }
                }
            `,
            {},
        )

        expect(errors).toBeUndefined()

        expect(data.collections).toMatchObject({
            items: [
                {
                    name: 'test collection 1',
                    address: 'collection-1',
                    stats: {
                        totalItems: 2,
                        floor: '0.5',
                        vol24: '4.4',
                        vol24Delta: '109.52380952380953',
                        totalVol: '9.5',
                    },
                },
                {
                    name: 'test collection 2',
                    address: 'collection-2',
                    stats: {
                        totalItems: 1,
                        floor: '5',
                        vol24: '5',
                        vol24Delta: null,
                        totalVol: '5',
                    },
                },
            ],
            totalItems: 2,
        })
    })

    it('get collections sorting VOL24', async () => {
        await collectionModel.insertMany([
            { name: 'test collection 1', address: 'collection-1', slug: 'collection-1' },
            { name: 'test collection 2', address: 'collection-2', slug: 'collection-2' },
        ])

        await nftModel.insertMany([
            {
                name: 'test nft 1',
                address: 'nft-1',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '1', nftAddress: 'nft-1', price: '2' },
            },
            {
                name: 'test nft 2',
                address: 'nft-2',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '2', nftAddress: 'nft-2', price: '0.5' },
            },
            {
                name: 'test nft 3',
                address: 'nft-3',
                collectionAddress: 'collection-2',
                imageUrl: '-',
                order: { id: '3', nftAddress: 'nft-3', price: '5' },
            },
        ])

        await nftEventModel.insertMany([
            {
                id: '1',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.4',
                createdAt: Date.now(),
            },
            {
                id: '2',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '3',
                createdAt: Date.now(),
            },
            {
                id: '3',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-3',
                collectionAddress: 'collection-2',
                type: 'BUY',
                price: '5',
                createdAt: Date.now(),
            },
            {
                id: '4',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '5',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '6',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '3',
                createdAt: Date.now() - 49 * 60 * 60 * 1000,
            },
        ])

        await collectionCronJobService.updateCollectionStats24H()
        await collectionCronJobService.updateCollectionStats30D()
        const result = await gqlClient.send<{ collections: Collection[] }>(
            gql`
                query {
                    collections(sorting: { field: VOL24 }) {
                        items {
                            name
                        }
                    }
                }
            `,
            {},
        )

        expect(result.errors).toBeUndefined()
        expect(result.data.collections).toMatchObject({
            items: [{ name: 'test collection 1' }, { name: 'test collection 2' }],
        })
    })

    it('get collections sorting VOL24_DELTA', async () => {
        await collectionModel.insertMany([
            { name: 'test collection 1', address: 'collection-1', slug: 'collection-1' },
            { name: 'test collection 2', address: 'collection-2', slug: 'collection-2' },
        ])
        await nftModel.insertMany([
            {
                name: 'test nft 1',
                address: 'nft-1',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '1', nftAddress: 'nft-1', price: '2' },
            },
            {
                name: 'test nft 2',
                address: 'nft-2',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '2', nftAddress: 'nft-2', price: '0.5' },
            },
            {
                name: 'test nft 3',
                address: 'nft-3',
                collectionAddress: 'collection-2',
                imageUrl: '-',
                order: { id: '3', nftAddress: 'nft-3', price: '5' },
            },
        ])

        await nftEventModel.insertMany([
            {
                id: '1',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.4',
                createdAt: Date.now(),
            },
            {
                id: '2',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '3',
                createdAt: Date.now(),
            },
            {
                id: '3',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-3',
                collectionAddress: 'collection-2',
                type: 'BUY',
                price: '5',
                createdAt: Date.now(),
            },
            {
                id: '4',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '5',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '6',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '3',
                createdAt: Date.now() - 49 * 60 * 60 * 1000,
            },
        ])

        await collectionCronJobService.updateCollectionStats24H()
        await collectionCronJobService.updateCollectionStats30D()
        const result = await gqlClient.send<{ collections: Collection[] }>(
            gql`
                query {
                    collections(sorting: { field: VOL24_DELTA }) {
                        items {
                            name
                        }
                    }
                }
            `,
            {},
        )

        expect(result.errors).toBeUndefined()
        expect(result.data.collections).toMatchObject({
            items: [{ name: 'test collection 2' }, { name: 'test collection 1' }],
        })
    })

    it('get collections sorting VOL24_DELTA, DES', async () => {
        await collectionModel.insertMany([
            { name: 'test collection 1', address: 'collection-1', slug: 'collection-1' },
            { name: 'test collection 2', address: 'collection-2', slug: 'collection-2' },
        ])

        await nftModel.insertMany([
            {
                name: 'test nft 1',
                address: 'nft-1',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '1', nftAddress: 'nft-1', price: '2' },
            },
            {
                name: 'test nft 2',
                address: 'nft-2',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '2', nftAddress: 'nft-2', price: '0.5' },
            },
            {
                name: 'test nft 3',
                address: 'nft-3',
                collectionAddress: 'collection-2',
                imageUrl: '-',
                order: { id: '3', nftAddress: 'nft-3', price: '5' },
            },
        ])

        await nftEventModel.insertMany([
            {
                id: '1',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.4',
                createdAt: Date.now(),
            },
            {
                id: '2',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '3',
                createdAt: Date.now(),
            },
            {
                id: '3',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-3',
                collectionAddress: 'collection-2',
                type: 'BUY',
                price: '5',
                createdAt: Date.now(),
            },
            {
                id: '4',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '5',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '6',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '3',
                createdAt: Date.now() - 49 * 60 * 60 * 1000,
            },
        ])

        await collectionCronJobService.updateCollectionStats24H()
        await collectionCronJobService.updateCollectionStats30D()
        const result = await gqlClient.send<{ collections: Collection[] }>(
            gql`
                query {
                    collections(sorting: { field: VOL24_DELTA, order: DES }) {
                        items {
                            name
                        }
                    }
                }
            `,
            {},
        )

        expect(result.errors).toBeUndefined()
        expect(result.data.collections).toMatchObject({
            items: [{ name: 'test collection 1' }, { name: 'test collection 2' }],
        })
    })

    it('get collections sorting FLOOR, DES', async () => {
        await collectionModel.insertMany([
            { name: 'test collection 1', address: 'collection-1', slug: 'collection-1' },
            { name: 'test collection 2', address: 'collection-2', slug: 'collection-2' },
        ])

        await nftModel.insertMany([
            {
                name: 'test nft 1',
                address: 'nft-1',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '1', nftAddress: 'nft-1', price: '2' },
            },
            {
                name: 'test nft 2',
                address: 'nft-2',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '2', nftAddress: 'nft-2', price: '0.5' },
            },
            {
                name: 'test nft 3',
                address: 'nft-3',
                collectionAddress: 'collection-2',
                imageUrl: '-',
                order: { id: '3', nftAddress: 'nft-3', price: '5' },
            },
        ])

        await nftEventModel.insertMany([
            {
                id: '1',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.4',
                createdAt: Date.now(),
            },
            {
                id: '2',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '3',
                createdAt: Date.now(),
            },
            {
                id: '3',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-3',
                collectionAddress: 'collection-2',
                type: 'BUY',
                price: '5',
                createdAt: Date.now(),
            },
            {
                id: '4',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '5',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '6',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '3',
                createdAt: Date.now() - 49 * 60 * 60 * 1000,
            },
        ])

        await collectionCronJobService.updateCollectionStats24H()
        await collectionCronJobService.updateCollectionStats30D()
        const result = await gqlClient.send<{ collections: Collection[] }>(
            gql`
                query {
                    collections(sorting: { field: FLOOR, order: DES }) {
                        items {
                            name
                        }
                    }
                }
            `,
            {},
        )

        expect(result.errors).toBeUndefined()
        expect(result.data.collections).toMatchObject({
            items: [{ name: 'test collection 2' }, { name: 'test collection 1' }],
        })
    })

    it('get collections filter by keyword (collection name)', async () => {
        await collectionModel.insertMany([
            { name: 'test keyword-a', address: 'collection-1', slug: 'collection-1' },
            { name: 'test keyword-b', address: 'collection-2', slug: 'collection-2' },
        ])

        await nftModel.insertMany([
            { name: 'test nft 1', address: 'nft-1', collectionAddress: 'collection-1', imageUrl: '-' },
            { name: 'test nft 2', address: 'nft-2', collectionAddress: 'collection-2', imageUrl: '-' },
        ])

        await collectionCronJobService.updateCollectionStats24H()
        await collectionCronJobService.updateCollectionStats30D()
        const result = await gqlClient.send<{ collections: Collection[] }>(
            gql`
                query {
                    collections(filter: { keyword: "keyword-a" }) {
                        items {
                            address
                        }
                    }
                }
            `,
            {},
        )

        expect(result.errors).toBeUndefined()
        expect(result.data.collections).toMatchObject({
            items: [{ address: 'collection-1' }],
        })
    })

    it('get collections filter by keyword (collection description)', async () => {
        await collectionModel.insertMany([
            { name: 'test', address: 'collection-1', description: 'keyword-a', slug: 'collection-1' },
            { name: 'test keyword-b', address: 'collection-2', slug: 'collection-2' },
        ])

        await nftModel.insertMany([
            { name: 'test nft 1', address: 'nft-1', collectionAddress: 'collection-1', imageUrl: '-' },
            { name: 'test nft 2', address: 'nft-2', collectionAddress: 'collection-2', imageUrl: '-' },
        ])

        await collectionCronJobService.updateCollectionStats24H()
        await collectionCronJobService.updateCollectionStats30D()
        const result = await gqlClient.send<{ collections: Collection[] }>(
            gql`
                query {
                    collections(filter: { keyword: "keyword-a" }) {
                        items {
                            address
                        }
                    }
                }
            `,
            {},
        )

        expect(result.errors).toBeUndefined()
        expect(result.data.collections).toMatchObject({
            items: [{ address: 'collection-1' }],
        })
    })

    it('get collections filter by keyword (creator name)', async () => {
        await userModel.insertMany([
            { name: 'user a', username: 'user.a', address: 'user-a' },
            { name: 'user b', username: 'user.b', address: 'user-b' },
        ])
        await collectionModel.insertMany([
            {
                name: 'test a',
                address: 'collection-1',
                creators: [{ address: 'user-a', share: 10000 }],
                slug: 'collection-1',
            },
            {
                name: 'test b',
                address: 'collection-2',
                creators: [{ address: 'user-b', share: 10000 }],
                slug: 'collection-2',
            },
            {
                name: 'test c',
                address: 'collection-3',
                creators: [{ address: 'user-a', share: 10000 }],
                slug: 'collection-3',
            },
        ])

        await nftModel.insertMany([
            { name: 'test nft 1', address: 'nft-1', collectionAddress: 'collection-1', imageUrl: '-' },
            { name: 'test nft 2', address: 'nft-2', collectionAddress: 'collection-2', imageUrl: '-' },
        ])

        await collectionCronJobService.updateCollectionStats24H()
        const result = await gqlClient.send<{ collections: Collection[] }>(
            gql`
                query {
                    collections(filter: { keyword: "user a" }) {
                        items {
                            address
                        }
                    }
                }
            `,
            {},
        )

        expect(result.errors).toBeUndefined()
        expect(result.data.collections).toMatchObject({
            items: [{ address: 'collection-1' }, { address: 'collection-3' }],
        })
    })

    it('get one collection and stats', async () => {
        await collectionModel.insertMany([
            { name: 'test collection 1', address: 'collection-1', slug: 'collection-1' },
            { name: 'test collection 2', address: 'collection-2', slug: 'collection-2' },
        ])

        await nftModel.insertMany([
            {
                name: 'test nft 1',
                address: 'nft-1',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '1', nftAddress: 'nft-1', price: '2' },
            },
            {
                name: 'test nft 2',
                address: 'nft-2',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '2', nftAddress: 'nft-2', price: '0.5' },
            },
            {
                name: 'test nft 3',
                address: 'nft-3',
                collectionAddress: 'collection-2',
                imageUrl: '-',
                order: { id: '3', nftAddress: 'nft-3', price: '5' },
            },
        ])

        await nftEventModel.insertMany([
            {
                id: '1',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.4',
                createdAt: Date.now(),
            },
            {
                id: '2',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '3',
                createdAt: Date.now(),
            },
            {
                id: '3',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-3',
                collectionAddress: 'collection-2',
                type: 'BUY',
                price: '5',
                createdAt: Date.now(),
            },
            {
                id: '4',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '5',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '6',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '3',
                createdAt: Date.now() - 49 * 60 * 60 * 1000,
            },
        ])

        await collectionCronJobService.updateCollectionStats24H()
        await collectionCronJobService.updateCollectionStats30D()
        const result = await gqlClient.send<{ collection: Collection }>(
            gql`
                query {
                    collection(address: "collection-1") {
                        name
                        address
                        stats {
                            totalItems
                            floor
                            vol24
                            vol24Delta
                            totalVol
                        }
                    }
                }
            `,
            {},
        )

        expect(result.errors).toBeUndefined()
        expect(result.data.collection).toMatchObject({
            name: 'test collection 1',
            address: 'collection-1',
            stats: {
                totalItems: 2,
                floor: '0.5',
                vol24: '4.4',
                vol24Delta: '109.52380952380953',
                totalVol: '9.5',
            },
        })
    })

    it('should return the nft trait lastSale', async () => {
        await collectionModel.insertMany([{ name: 'test collection 1', address: 'collection-1', slug: 'collection-1' }])

        await nftModel.insertMany([
            {
                name: 'test nft 1',
                address: 'nft-1',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                attributes: [{ name: 'background', value: 'red' }],
                order: { id: '1', nftAddress: 'nft-1', price: '2' },
            },
            {
                name: 'test nft 2',
                address: 'nft-2',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                attributes: [{ name: 'background', value: 'green' }],
                order: { id: '2', nftAddress: 'nft-2', price: '0.5' },
            },
            {
                name: 'test nft 3',
                address: 'nft-3',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                attributes: [{ name: 'background', value: 'red' }],
                order: { id: '3', nftAddress: 'nft-3', price: '5' },
            },
            {
                name: 'test nft 4',
                address: 'nft-4',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                attributes: [{ name: 'background', value: 'blue' }],
                order: { id: '4', nftAddress: 'nft-4', price: '8' },
            },
        ])

        await nftEventModel.insertMany([
            {
                id: '1',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.4',
                createdAt: Date.now(),
            },
            {
                id: '2',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '5',
                createdAt: Date.now(),
            },
            {
                id: '4',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '5',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-2',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '1.1',
                createdAt: Date.now() - 25 * 60 * 60 * 1000,
            },
            {
                id: '6',
                txId: randomBytes(16).toString('base64'),
                nftAddress: 'nft-1',
                collectionAddress: 'collection-1',
                type: 'BUY',
                price: '3',
                createdAt: Date.now() - 49 * 60 * 60 * 1000,
            },
        ])

        const result = await gqlClient.send<{ collection: Collection }>(
            gql`
                query {
                    collection(address: "collection-1") {
                        name
                        address
                        attributes {
                            name
                            values {
                                value
                                lastSale
                                floor
                            }
                        }
                    }
                }
            `,
            {},
        )

        expect(result.errors).toBeUndefined()
        expect(result.data.collection).toMatchObject({
            name: 'test collection 1',
            address: 'collection-1',
            attributes: [
                {
                    name: 'background',
                    values: new Set([
                        { value: 'green', lastSale: '1.1', floor: '0.5' },
                        { value: 'red', lastSale: '1.4', floor: '2' },
                        { value: 'blue', lastSale: null, floor: '8' },
                    ]),
                },
            ],
        })
    })
})
