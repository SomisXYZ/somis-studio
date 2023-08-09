import { gql } from 'apollo-server-express'
import { Mongoose, Model } from 'mongoose'

import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { S3Service } from '~/aws/s3.service'
import { SqsService } from '~/aws/sqs.service'
import { ICollection, ICollectionStats } from '~/collection/collection.schema'
import {
    COLLECTION_MODEL,
    COLLECTION_STATS_MODEL,
    DATABASE_CONNECTION,
    NFT_EVENT_MODEL,
    NFT_MODEL,
    S3_PROVIDER,
    SQS_PROVIDER,
} from '~/const'
import { Nft } from '~/gql/generated'
import { IOrder } from '~/marketplace/marketplace.schema'
import { INft, INftEvent } from '~/nft/nft.schema'

import { AppModule } from '../src/app.module'
import { GqlClient } from './utils/gql'

describe('NFT (e2e)', () => {
    let app: INestApplication
    let gqlClient: GqlClient

    let collectionModel: Model<ICollection>
    let nftModel: Model<INft>
    let nftEventModel: Model<INftEvent>
    let collectionStatsModel: Model<ICollectionStats>
    let connection: Mongoose

    const initDB = async () => {
        await collectionModel.deleteMany({})
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
        nftEventModel = moduleFixture.get(NFT_EVENT_MODEL)
        collectionStatsModel = moduleFixture.get(COLLECTION_STATS_MODEL)
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

    it('nfts', async () => {
        await collectionModel.insertMany([{ name: 'test collection 1', address: 'collection-1' }])

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
            { name: 'test nft 3', address: 'nft-3', collectionAddress: 'collection-1', imageUrl: '-' },
        ])

        const { data, errors } = await gqlClient.send<{ nfts: Nft[] }>(
            gql`
                query {
                    nfts(collectionAddress: "collection-1") {
                        items {
                            name
                            address
                        }
                        totalItems
                    }
                }
            `,
            {},
        )

        expect(errors).toBeUndefined()
        expect(data.nfts).toMatchObject({
            items: [
                {
                    name: 'test nft 1',
                    address: 'nft-1',
                },
                {
                    name: 'test nft 2',
                    address: 'nft-2',
                },
                {
                    name: 'test nft 3',
                    address: 'nft-3',
                },
            ],
            totalItems: 3,
        })
    })

    it('nfts with maxPrice', async () => {
        await collectionModel.insertMany([{ name: 'test collection 1', address: 'collection-1' }])

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
            { name: 'test nft 3', address: 'nft-3', collectionAddress: 'collection-1', imageUrl: '-' },
        ])

        const { data, errors } = await gqlClient.send<{ nfts: Nft[] }>(
            gql`
                query {
                    nfts(collectionAddress: "collection-1", filter: { maxPrice: "1" }) {
                        items {
                            name
                            address
                        }
                        totalItems
                    }
                }
            `,
            {},
        )

        expect(errors).toBeUndefined()
        expect(data.nfts).toMatchObject({
            items: [
                {
                    name: 'test nft 2',
                    address: 'nft-2',
                },
            ],
            totalItems: 1,
        })
    })

    it('nfts with minPrice', async () => {
        await collectionModel.insertMany([{ name: 'test collection 1', address: 'collection-1' }])

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
            { name: 'test nft 3', address: 'nft-3', collectionAddress: 'collection-1', imageUrl: '-' },
        ])

        const { data, errors } = await gqlClient.send<{ nfts: Nft[] }>(
            gql`
                query {
                    nfts(collectionAddress: "collection-1", filter: { minPrice: "1" }) {
                        items {
                            name
                            address
                        }
                        totalItems
                    }
                }
            `,
            {},
        )

        expect(errors).toBeUndefined()
        expect(data.nfts).toMatchObject({
            items: [
                {
                    name: 'test nft 1',
                    address: 'nft-1',
                },
            ],
            totalItems: 1,
        })
    })

    it('nfts with minPrice and maxPrice', async () => {
        await collectionModel.insertMany([{ name: 'test collection 1', address: 'collection-1' }])

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
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '3', nftAddress: 'nft-3', price: '3' },
            },
        ])

        const { data, errors } = await gqlClient.send<{ nfts: Nft[] }>(
            gql`
                query {
                    nfts(collectionAddress: "collection-1", filter: { minPrice: "1", maxPrice: "2.9" }) {
                        items {
                            name
                            address
                        }
                        totalItems
                    }
                }
            `,
            {},
        )

        expect(errors).toBeUndefined()
        expect(data.nfts).toMatchObject({
            items: [
                {
                    name: 'test nft 1',
                    address: 'nft-1',
                },
            ],
            totalItems: 1,
        })
    })

    it('nfts with listedOnly', async () => {
        await collectionModel.insertMany([{ name: 'test collection 1', address: 'collection-1' }])

        await nftModel.insertMany([
            {
                name: 'test nft 1',
                address: 'nft-1',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '1', nftAddress: 'nft-1', price: '2' },
            },
            { name: 'test nft 2', address: 'nft-2', collectionAddress: 'collection-1', imageUrl: '-' },
            { name: 'test nft 3', address: 'nft-3', collectionAddress: 'collection-1', imageUrl: '-' },
        ])

        const { data, errors } = await gqlClient.send<{ nfts: Nft[] }>(
            gql`
                query {
                    nfts(collectionAddress: "collection-1", filter: { listedOnly: true }) {
                        items {
                            name
                            address
                        }
                        totalItems
                    }
                }
            `,
            {},
        )

        expect(errors).toBeUndefined()
        expect(data.nfts).toMatchObject({
            items: [
                {
                    name: 'test nft 1',
                    address: 'nft-1',
                },
            ],
            totalItems: 1,
        })
    })

    it('nfts sortBy price ASC', async () => {
        await collectionModel.insertMany([{ name: 'test collection 1', address: 'collection-1' }])

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
                order: { id: '2', nftAddress: 'nft-2', price: '1' },
            },
            {
                name: 'test nft 3',
                address: 'nft-3',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                order: { id: '3', nftAddress: 'nft-3', price: '0.5' },
            },
        ])

        const { data, errors } = await gqlClient.send<{ nfts: Nft[] }>(
            gql`
                query {
                    nfts(collectionAddress: "collection-1", sorting: { field: PRICE, order: ASC }) {
                        items {
                            name
                            address
                        }
                        totalItems
                    }
                }
            `,
            {},
        )

        expect(errors).toBeUndefined()
        expect(data.nfts).toMatchObject({
            items: [
                {
                    name: 'test nft 3',
                    address: 'nft-3',
                },
                {
                    name: 'test nft 2',
                    address: 'nft-2',
                },
                {
                    name: 'test nft 1',
                    address: 'nft-1',
                },
            ],
            totalItems: 3,
        })
    })

    it('nfts sortBy name DES', async () => {
        await collectionModel.insertMany([{ name: 'test collection 1', address: 'collection-1' }])

        await nftModel.insertMany([
            { name: 'test nft 1', address: 'nft-1', collectionAddress: 'collection-1', imageUrl: '-' },
            { name: 'test nft 2', address: 'nft-2', collectionAddress: 'collection-1', imageUrl: '-' },
            { name: 'test nft 3', address: 'nft-3', collectionAddress: 'collection-1', imageUrl: '-' },
        ])

        const { data, errors } = await gqlClient.send<{ nfts: Nft[] }>(
            gql`
                query {
                    nfts(collectionAddress: "collection-1", sorting: { field: NAME, order: DES }) {
                        items {
                            name
                            address
                        }
                        totalItems
                    }
                }
            `,
            {},
        )

        expect(errors).toBeUndefined()
        expect(data.nfts).toMatchObject({
            items: [
                {
                    name: 'test nft 3',
                    address: 'nft-3',
                },
                {
                    name: 'test nft 2',
                    address: 'nft-2',
                },
                {
                    name: 'test nft 1',
                    address: 'nft-1',
                },
            ],
            totalItems: 3,
        })
    })

    it('nfts sortBy skip and limit', async () => {
        await collectionModel.insertMany([{ name: 'test collection 1', address: 'collection-1' }])

        await nftModel.insertMany([
            { name: 'test nft 1', address: 'nft-1', collectionAddress: 'collection-1', imageUrl: '-' },
            { name: 'test nft 2', address: 'nft-2', collectionAddress: 'collection-1', imageUrl: '-' },
            { name: 'test nft 3', address: 'nft-3', collectionAddress: 'collection-1', imageUrl: '-' },
        ])

        const { data, errors } = await gqlClient.send<{ nfts: Nft[] }>(
            gql`
                query {
                    nfts(collectionAddress: "collection-1", paging: { skip: 1, limit: 1 }) {
                        items {
                            name
                            address
                        }
                        totalItems
                    }
                }
            `,
            {},
        )

        expect(errors).toBeUndefined()
        expect(data.nfts).toMatchObject({
            items: [
                {
                    name: 'test nft 2',
                    address: 'nft-2',
                },
            ],
            totalItems: 3,
        })
    })

    it('nfts filter by attribute 1', async () => {
        await collectionModel.insertMany([{ name: 'test collection 1', address: 'collection-1' }])

        await nftModel.insertMany([
            {
                name: 'test nft 1',
                address: 'nft-1',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                attributes: [
                    { name: 'background', value: 'black' },
                    { name: 'hair', value: 'none' },
                ],
            },
            {
                name: 'test nft 2',
                address: 'nft-2',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                attributes: [
                    { name: 'background', value: 'red' },
                    { name: 'hair', value: 'short' },
                ],
            },
            {
                name: 'test nft 3',
                address: 'nft-3',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                attributes: [
                    { name: 'background', value: 'blue' },
                    { name: 'hair', value: 'long' },
                ],
            },
        ])

        const { data, errors } = await gqlClient.send<{ nfts: Nft[] }>(
            gql`
                query {
                    nfts(
                        collectionAddress: "collection-1"
                        filter: { attributes: [{ name: "background", values: ["black", "red"] }] }
                    ) {
                        items {
                            name
                            address
                        }
                        totalItems
                    }
                }
            `,
            {},
        )

        expect(errors).toBeUndefined()
        expect(data.nfts).toMatchObject({
            items: [
                {
                    name: 'test nft 1',
                    address: 'nft-1',
                },
                {
                    name: 'test nft 2',
                    address: 'nft-2',
                },
            ],
            totalItems: 2,
        })
    })

    it('nfts filter by attributes 2', async () => {
        await collectionModel.insertMany([{ name: 'test collection 1', address: 'collection-1' }])

        await nftModel.insertMany([
            {
                name: 'test nft 1',
                address: 'nft-1',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                attributes: [
                    { name: 'background', value: 'black' },
                    { name: 'hair', value: 'none' },
                ],
            },
            {
                name: 'test nft 2',
                address: 'nft-2',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                attributes: [
                    { name: 'background', value: 'red' },
                    { name: 'hair', value: 'short' },
                ],
            },
            {
                name: 'test nft 3',
                address: 'nft-3',
                collectionAddress: 'collection-1',
                imageUrl: '-',
                attributes: [
                    { name: 'background', value: 'blue' },
                    { name: 'hair', value: 'long' },
                ],
            },
        ])

        const { data, errors } = await gqlClient.send<{ nfts: Nft[] }>(
            gql`
                query {
                    nfts(
                        collectionAddress: "collection-1"
                        filter: {
                            attributes: [
                                { name: "background", values: ["black", "red"] }
                                { name: "hair", values: ["short"] }
                            ]
                        }
                    ) {
                        items {
                            name
                            address
                        }
                        totalItems
                    }
                }
            `,
            {},
        )

        expect(errors).toBeUndefined()
        expect(data.nfts).toMatchObject({
            items: [
                {
                    name: 'test nft 2',
                    address: 'nft-2',
                },
            ],
            totalItems: 1,
        })
    })

    it('nfts filter by owner', async () => {
        await collectionModel.insertMany([{ name: 'test collection 1', address: 'collection-1' }])

        await nftModel.insertMany([
            {
                name: 'test nft 1',
                address: 'nft-1',
                collectionAddress: 'collection-1',
                owner: 'user-1',
                imageUrl: '-',
                attributes: [
                    { name: 'background', value: 'black' },
                    { name: 'hair', value: 'none' },
                ],
            },
            {
                name: 'test nft 2',
                address: 'nft-2',
                collectionAddress: 'collection-1',
                owner: 'user-1',
                imageUrl: '-',
                attributes: [
                    { name: 'background', value: 'red' },
                    { name: 'hair', value: 'short' },
                ],
            },
            {
                name: 'test nft 3',
                address: 'nft-3',
                collectionAddress: 'collection-1',
                owner: 'user-2',
                imageUrl: '-',
                attributes: [
                    { name: 'background', value: 'blue' },
                    { name: 'hair', value: 'long' },
                ],
            },
        ])

        const { data, errors } = await gqlClient.send<{ nftsByOwner: Nft[] }>(
            gql`
                query {
                    nftsByOwner(owner: "user-1") {
                        items {
                            name
                            address
                        }
                        totalItems
                    }
                }
            `,
            {},
        )

        expect(errors).toBeUndefined()
        expect(data.nftsByOwner).toMatchObject({
            items: [
                {
                    name: 'test nft 1',
                    address: 'nft-1',
                },
                {
                    name: 'test nft 2',
                    address: 'nft-2',
                },
            ],
            totalItems: 2,
        })

        const { data: dataUser2, errors: errorsUser2 } = await gqlClient.send<{ nftsByOwner: Nft[] }>(
            gql`
                query {
                    nftsByOwner(owner: "user-2") {
                        items {
                            name
                            address
                        }
                        totalItems
                    }
                }
            `,
            {},
        )

        expect(errorsUser2).toBeUndefined()
        expect(dataUser2.nftsByOwner).toMatchObject({
            items: [
                {
                    name: 'test nft 3',
                    address: 'nft-3',
                },
            ],
            totalItems: 1,
        })
    })
})
