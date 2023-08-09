import { gql } from 'apollo-server-express'
import { Mongoose, Model } from 'mongoose'

import { MIST_PER_SUI } from '@mysten/sui.js'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { S3Service } from '~/aws/s3.service'
import { SqsService } from '~/aws/sqs.service'
import { CacheService } from '~/cache/cache.service'
import { ICollection } from '~/collection/collection.schema'
import { COLLECTION_MODEL, DATABASE_CONNECTION, NFT_EVENT_MODEL, NFT_MODEL, S3_PROVIDER, SQS_PROVIDER } from '~/const'
import { Nft, Order } from '~/gql/generated'
import { IOrder } from '~/marketplace/marketplace.schema'
import { MarketplaceService } from '~/marketplace/marketplace.service'
import { INft, INftEvent } from '~/nft/nft.schema'
import { SuiService } from '~/sui/sui.service'

import { AppModule } from '../src/app.module'
import { GqlClient, login } from './utils/gql'

describe('Marketplace (e2e)', () => {
    let app: INestApplication
    let gqlClient: GqlClient

    let nftEventModel: Model<INftEvent>
    let connection: Mongoose

    let collectionModel: Model<ICollection>
    let nftModel: Model<INft>
    let suiService: SuiService
    let cacheService: CacheService
    let marketplaceService: MarketplaceService

    const initDB = async () => {
        await nftEventModel.deleteMany({})
        await nftEventModel.deleteMany({})
        await nftModel.deleteMany({})
        await collectionModel.deleteMany({})
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
            .useValue({ indexWallet: () => null, indexNft: () => null })
            .compile()

        app = moduleFixture.createNestApplication()
        collectionModel = moduleFixture.get(COLLECTION_MODEL)
        nftModel = moduleFixture.get(NFT_MODEL)
        nftEventModel = moduleFixture.get(NFT_EVENT_MODEL)
        connection = moduleFixture.get(DATABASE_CONNECTION)
        suiService = moduleFixture.get(SuiService)
        cacheService = moduleFixture.get(CacheService)
        marketplaceService = moduleFixture.get(MarketplaceService)
        app.enableShutdownHooks()
        app.useLogger(false)
        await app.init()

        gqlClient = new GqlClient(app.getHttpServer())
    })

    beforeEach(async () => {
        await initDB()
        await collectionModel.insertMany([{ name: 'test collection 1', address: 'collection-1', slug: 'collection-1' }])
        await nftModel.insertMany([
            { name: 'test nft 1', address: 'nft-1', collectionAddress: 'collection-1', imageUrl: '-' },
        ])
    })

    afterAll(async () => {
        await app.close()
        await connection.disconnect()
    })
    /*

    it('should create an Order and a `LIST` NftEvnet, when the user list the Nft', async () => {
        const { publicKey } = await login(gqlClient)
        await cacheService.unlockAll()
        suiService.getTradeEvent = jest.fn().mockResolvedValueOnce([
            {
                id: { txDigest: 'test-tx-id-1', eventSeq: 0 },
                timestampMs: Date.now(),
                type: `${ORDERBOOK_PACKAGE}::AskCreatedEvent`,
                sender: publicKey,
                parsedJson: {
                    nft: 'nft-1',
                    owner: publicKey,
                    price: (1.2 * Number(MIST_PER_SUI)).toString(),
                    safe: '0x123',
                    orderbook: 'test-orderbook',
                },
            },
        ] as TradeEvent[])

        await marketplaceService.executeSyncNftJobs()

        expect(await orderModel.count()).toBe(1)
        expect(await nftEventModel.count()).toBe(1)

        const order = await orderModel.findOne({ nftAddress: 'nft-1' }).lean().exec()
        const event = await nftEventModel.findOne({ txId: 'test-tx-id-1' }).lean().exec()

        expect(order?.seller).toBe(publicKey)
        expect(order?.price).toBe('1.2')
        expect(order?.sellerSafe).toBe('0x123')
        expect(order?.nftAddress).toBe('nft-1')

        expect(event?.txId).toBe('test-tx-id-1')
        expect(event?.type).toBe('LIST')
        expect(event?.user).toBe(publicKey)
        expect(event?.price).toBe('1.2')
        expect(event?.nftAddress).toBe('nft-1')
    })

    it('should able to see the order in Nft after the Nft is listed', async () => {
        const seller = await login(gqlClient)
        await cacheService.unlockAll()
        suiService.getTradeEvent = jest.fn().mockResolvedValueOnce([
            {
                id: { txDigest: 'test-tx-id-1', eventSeq: 0 },
                timestampMs: Date.now(),
                type: `${ORDERBOOK_PACKAGE}::AskCreatedEvent`,
                sender: seller.publicKey,
                parsedJson: {
                    nft: 'nft-1',
                    owner: seller.publicKey,
                    price: (1.2 * Number(MIST_PER_SUI)).toString(),
                    safe: '0x123',
                    orderbook: 'test-orderbook',
                },
            },
        ] as TradeEvent[])

        await marketplaceService.executeSyncNftJobs()

        const { data, errors } = await gqlClient.send<{ nft: Nft }>(
            gql`
                query {
                    nft(address: "nft-1") {
                        address
                        order {
                            price
                            seller {
                                address
                            }
                            sellerSafe
                        }
                    }
                }
            `,
            {},
        )

        expect(errors).toBeUndefined()
        expect(data.nft.address).toBe('nft-1')
        expect(data.nft.order?.price).toBe('1.2')
        expect(data.nft.order?.seller.address).toBe(seller.publicKey)
        expect(data.nft.order?.sellerSafe).toBe('0x123')
    })

    it('should remove the Order and create a `CANCEL_ORDER` NftEvent, when the seller cancel the order', async () => {
        const { jwt, publicKey } = await login(gqlClient)
        await cacheService.unlockAll()
        suiService.getTradeEvent = jest.fn().mockResolvedValueOnce([
            {
                id: { txDigest: 'test-tx-id-1', eventSeq: 0 },
                timestampMs: Date.now(),
                type: `${ORDERBOOK_PACKAGE}::AskCreatedEvent`,
                sender: publicKey,
                parsedJson: {
                    nft: 'nft-1',
                    owner: publicKey,
                    price: (1.2 * Number(MIST_PER_SUI)).toString(),
                    safe: '0x123',
                    orderbook: 'test-orderbook',
                },
            },
        ] as TradeEvent[])

        await marketplaceService.executeSyncNftJobs()

        await cacheService.unlockAll()
        suiService.getTradeEvent = jest.fn().mockResolvedValueOnce([
            {
                id: { txDigest: 'test-tx-id-2', eventSeq: 0 },
                timestampMs: Date.now(),
                type: `${ORDERBOOK_PACKAGE}::AskClosedEvent`,
                sender: publicKey,
                parsedJson: {
                    nft: 'nft-1',
                    owner: publicKey,
                    price: (1.2 * Number(MIST_PER_SUI)).toString(),
                    safe: '0x123',
                    orderbook: 'test-orderbook',
                },
            },
        ] as TradeEvent[])

        await marketplaceService.executeSyncNftJobs()

        expect(await orderModel.count()).toBe(1)
        expect(await orderModel.findOne().lean().exec()).toMatchObject({ deleted: true })
        expect(await nftEventModel.count()).toBe(2)

        const event = await nftEventModel.findOne({ txId: 'test-tx-id-2' }).lean().exec()

        expect(event?.txId).toBe('test-tx-id-2')
        expect(event?.type).toBe('CANCEL_ORDER')
        expect(event?.user).toBe(publicKey)
        expect(event?.nftAddress).toBe('nft-1')
    })

    it('should remove the Order and create a `BUY` NftEvent, when another user buy the nft', async () => {
        const seller = await login(gqlClient)
        await cacheService.unlockAll()
        suiService.getTradeEvent = jest.fn().mockResolvedValueOnce([
            {
                id: { txDigest: 'test-tx-id-1', eventSeq: 0 },
                timestampMs: Date.now(),
                type: `${ORDERBOOK_PACKAGE}::AskCreatedEvent`,
                sender: seller.publicKey,
                parsedJson: {
                    nft: 'nft-1',
                    owner: seller.publicKey,
                    price: (1.2 * Number(MIST_PER_SUI)).toString(),
                    safe: '0x123',
                    orderbook: 'test-orderbook',
                },
            },
        ] as TradeEvent[])

        await marketplaceService.executeSyncNftJobs()

        const buyer = await login(gqlClient)

        await cacheService.unlockAll()
        suiService.getTradeEvent = jest.fn().mockResolvedValueOnce([
            {
                id: { txDigest: 'test-tx-id-2', eventSeq: 0 },
                timestampMs: Date.now(),
                type: `${ORDERBOOK_PACKAGE}::TradeFilledEvent`,
                sender: buyer.publicKey,
                parsedJson: {
                    nft: 'nft-1',
                    buyer: buyer.publicKey,
                    seller: seller.publicKey,
                    price: (1.2 * Number(MIST_PER_SUI)).toString(),
                    safe: '0x123',
                    orderbook: 'test-orderbook',
                },
            },
        ] as TradeEvent[])

        await marketplaceService.executeSyncNftJobs()

        expect(await orderModel.count()).toBe(1)
        expect(await orderModel.findOne().lean().exec()).toMatchObject({ deleted: true })
        expect(await nftEventModel.count()).toBe(2)

        const event = await nftEventModel.findOne({ txId: 'test-tx-id-2' }).lean().exec()

        expect(event?.txId).toBe('test-tx-id-2')
        expect(event?.type).toBe('BUY')
        expect(event?.user).toBe(buyer.publicKey)
        expect(event?.originOwner).toBe(seller.publicKey)
        expect(event?.newOwner).toBe(buyer.publicKey)
        expect(event?.price).toBe('1.2')
        expect(event?.nftAddress).toBe('nft-1')
    })
    */
})
