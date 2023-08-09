import { gql } from 'apollo-server-express'
import { create } from 'domain'
import { Model, Mongoose } from 'mongoose'

import { Ed25519Keypair } from '@mysten/sui.js'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { S3Service } from '~/aws/s3.service'
import { SqsService } from '~/aws/sqs.service'
import { ICollection } from '~/collection/collection.schema'
import { COLLECTION_MODEL, DATABASE_CONNECTION, NFT_MODEL, S3_PROVIDER, SQS_PROVIDER, USER_MODEL } from '~/const'
import { Collection, CreateCollectionInput, UpdateCollectionInput } from '~/gql/generated'
import { INft } from '~/nft/nft.schema'
import { IUser } from '~/user/user.schema'
import { AuthError } from '~/utils/error'

import { AppModule } from '../src/app.module'
import { expectGqlError, GqlClient, login, setRole } from './utils/gql'
import { MockSqsService } from './utils/mock'

describe('Collection Admin (e2e)', () => {
    let app: INestApplication
    let gqlClient: GqlClient

    let collectionModel: Model<ICollection>
    let nftModel: Model<INft>
    let userModel: Model<IUser>

    let connection: Mongoose

    const userKeypair = Ed25519Keypair.generate()
    const user2Keypair = Ed25519Keypair.generate()

    const initDB = async () => {
        await collectionModel.deleteMany({})
        await userModel.deleteMany({})
        await nftModel.deleteMany({})
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
            .useValue(new MockSqsService())
            .compile()

        app = moduleFixture.createNestApplication()
        collectionModel = moduleFixture.get(COLLECTION_MODEL)
        collectionModel = moduleFixture.get(COLLECTION_MODEL)
        nftModel = moduleFixture.get(NFT_MODEL)
        userModel = moduleFixture.get(USER_MODEL)
        connection = moduleFixture.get(DATABASE_CONNECTION)
        app.enableShutdownHooks()
        app.useLogger(false)
        await app.init()

        gqlClient = new GqlClient(app.getHttpServer())
    })

    beforeEach(async () => {
        await initDB()
    })

    describe('createCollection', () => {
        it('should create a collection by user', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'USER')
            const { jwt } = await login(gqlClient, userKeypair)
            const input: CreateCollectionInput = {
                name: 'Test Collection',
                slug: 'test-collection',
                address: 'test-collection-address',
                whitelisted: true,
            }
            const { data, errors } = await gqlClient.send<{ createCollection: Collection }>(
                gql`
                    mutation ($input: CreateCollectionInput!) {
                        createCollection(input: $input) {
                            address
                        }
                    }
                `,
                { input },
                { authorization: `Bearer ${jwt}` },
            )

            expect(errors).toBeUndefined()
            expect(await collectionModel.count()).toBe(1)
            const createdCollection = await collectionModel.findOne({ id: data.createCollection.address }).lean().exec()
            expect(createdCollection).toMatchObject({
                name: input.name,
                slug: input.slug,
                address: input.address,
                owner: `0x${userKeypair.getPublicKey().toSuiAddress()}`,
            })

            // only admin could set the whitelisted flag
            expect(createdCollection?.whitelisted).toBeFalsy()
        })

        it('should create a collection by admin', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'ADMIN')
            const { jwt } = await login(gqlClient, userKeypair)

            const input: CreateCollectionInput = {
                name: 'Test Collection',
                slug: 'test-collection',
                address: 'test-collection-address',
                whitelisted: true,
            }
            const { data, errors } = await gqlClient.send<{ createCollection: Collection }>(
                gql`
                    mutation ($input: CreateCollectionInput!) {
                        createCollection(input: $input) {
                            address
                        }
                    }
                `,
                { input },
                { authorization: `Bearer ${jwt}` },
            )
            expect(errors).toBeUndefined()
            expect(await collectionModel.count()).toBe(1)
            expect(await collectionModel.findOne({ id: data.createCollection.address }).lean().exec()).toMatchObject({
                ...input,
            })
        })
    })

    describe('updateCollection', () => {
        it('should reject the request if the user is not ADMIN', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'USER')
            const { jwt } = await login(gqlClient, userKeypair)
            const input: UpdateCollectionInput = {
                description: 'collection decription',
            }

            const { response } = await gqlClient.send(
                gql`
                    mutation ($input: UpdateCollectionInput!) {
                        updateCollection(address: "dummy-address", input: $input) {
                            address
                        }
                    }
                `,
                { input },
                { authorization: `Bearer ${jwt}` },
            )
            expectGqlError(response, AuthError.Unauthorized)
        })

        it('should update a collection by admin', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'ADMIN')
            const { jwt } = await login(gqlClient, userKeypair)

            const createInput: CreateCollectionInput = {
                name: 'Test Collection',
                slug: 'test-collection',
                address: 'test-collection-address',
            }
            await gqlClient.send<{ createCollection: Collection }>(
                gql`
                    mutation ($input: CreateCollectionInput!) {
                        createCollection(input: $input) {
                            address
                        }
                    }
                `,
                { input: createInput },
                { authorization: `Bearer ${jwt}` },
            )

            const input: UpdateCollectionInput = {
                name: 'new name',
                description: 'new description',
                orderbook: 'new orderbook',
                verified: true,
            }
            const { data, errors } = await gqlClient.send<{ updateCollection: Collection }>(
                gql`
                    mutation ($address: String!, $input: UpdateCollectionInput!) {
                        updateCollection(address: $address, input: $input) {
                            address
                        }
                    }
                `,
                { address: createInput.address, input },
                { authorization: `Bearer ${jwt}` },
            )
            expect(errors).toBeUndefined()
            expect(await collectionModel.count()).toBe(1)
            expect(
                await collectionModel.findOne({ address: data.updateCollection.address }).lean().exec(),
            ).toMatchObject({
                ...input,
            })
        })

        it('should update a collection by admin, even the collection is created by user', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'USER')
            await setRole(userModel, `0x${user2Keypair.getPublicKey().toSuiAddress()}`, 'ADMIN')
            const { jwt } = await login(gqlClient, userKeypair)
            const { jwt: jwt2 } = await login(gqlClient, user2Keypair)

            const createInput: CreateCollectionInput = {
                name: 'Test Collection',
                slug: 'test-collection',
                address: 'test-collection-address',
            }
            await gqlClient.send<{ createCollection: Collection }>(
                gql`
                    mutation ($input: CreateCollectionInput!) {
                        createCollection(input: $input) {
                            address
                        }
                    }
                `,
                { input: createInput },
                { authorization: `Bearer ${jwt}` },
            )

            const input: UpdateCollectionInput = {
                name: 'new name',
                description: 'new description',
                orderbook: 'new orderbook',
                verified: true,
            }
            const { data, errors } = await gqlClient.send<{ updateCollection: Collection }>(
                gql`
                    mutation ($address: String!, $input: UpdateCollectionInput!) {
                        updateCollection(address: $address, input: $input) {
                            address
                        }
                    }
                `,
                { address: createInput.address, input },
                { authorization: `Bearer ${jwt2}` },
            )
            expect(errors).toBeUndefined()
            expect(await collectionModel.count()).toBe(1)
            expect(
                await collectionModel.findOne({ address: data.updateCollection.address }).lean().exec(),
            ).toMatchObject({
                ...input,
            })
        })

        it('should update a collection by owner', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'USER')
            const { jwt } = await login(gqlClient, userKeypair)

            const createInput: CreateCollectionInput = {
                name: 'Test Collection',
                slug: 'test-collection',
                address: 'test-collection-address',
            }
            await gqlClient.send<{ createCollection: Collection }>(
                gql`
                    mutation ($input: CreateCollectionInput!) {
                        createCollection(input: $input) {
                            address
                        }
                    }
                `,
                { input: createInput },
                { authorization: `Bearer ${jwt}` },
            )

            const input: UpdateCollectionInput = {
                name: 'new name',
                description: 'new description',
                orderbook: 'new orderbook',
            }
            const { data, errors } = await gqlClient.send<{ updateCollection: Collection }>(
                gql`
                    mutation ($address: String!, $input: UpdateCollectionInput!) {
                        updateCollection(address: $address, input: $input) {
                            address
                        }
                    }
                `,
                { address: createInput.address, input },
                { authorization: `Bearer ${jwt}` },
            )
            expect(errors).toBeUndefined()
            expect(await collectionModel.count()).toBe(1)
            expect(
                await collectionModel.findOne({ address: data.updateCollection.address }).lean().exec(),
            ).toMatchObject({
                ...input,
            })
        })
    })

    describe('deleteCollection', () => {
        it('should remove the collection by admin', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'ADMIN')
            const { jwt } = await login(gqlClient, userKeypair)
            const createInput: CreateCollectionInput = {
                name: 'Test Collection',
                slug: 'test-collection',
                address: 'test-collection-address',
            }
            await gqlClient.send<{ createCollection: Collection }>(
                gql`
                    mutation ($input: CreateCollectionInput!) {
                        createCollection(input: $input) {
                            address
                        }
                    }
                `,
                { input: createInput },
                { authorization: `Bearer ${jwt}` },
            )
            expect(await collectionModel.count()).toBe(1)

            const { errors } = await gqlClient.send(
                gql`
                    mutation ($address: String!) {
                        deleteCollection(address: $address) {
                            address
                        }
                    }
                `,
                { address: createInput.address },
                { authorization: `Bearer ${jwt}` },
            )
            expect(errors).toBeUndefined()
            expect(await collectionModel.count()).toBe(0)
        })

        it('should remove the collection by admin, even collection is created by user', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'USER')
            await setRole(userModel, `0x${user2Keypair.getPublicKey().toSuiAddress()}`, 'ADMIN')
            const { jwt } = await login(gqlClient, userKeypair)
            const { jwt: jwt2 } = await login(gqlClient, user2Keypair)
            const createInput: CreateCollectionInput = {
                name: 'Test Collection',
                slug: 'test-collection',
                address: 'test-collection-address',
            }
            await gqlClient.send<{ createCollection: Collection }>(
                gql`
                    mutation ($input: CreateCollectionInput!) {
                        createCollection(input: $input) {
                            address
                        }
                    }
                `,
                { input: createInput },
                { authorization: `Bearer ${jwt}` },
            )
            expect(await collectionModel.count()).toBe(1)

            const { errors } = await gqlClient.send(
                gql`
                    mutation ($address: String!) {
                        deleteCollection(address: $address) {
                            address
                        }
                    }
                `,
                { address: createInput.address },
                { authorization: `Bearer ${jwt2}` },
            )
            expect(errors).toBeUndefined()
            expect(await collectionModel.count()).toBe(0)
        })

        it('should remove the collection by owner', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'USER')
            const { jwt } = await login(gqlClient, userKeypair)
            const createInput: CreateCollectionInput = {
                name: 'Test Collection',
                slug: 'test-collection',
                address: 'test-collection-address',
            }
            await gqlClient.send<{ createCollection: Collection }>(
                gql`
                    mutation ($input: CreateCollectionInput!) {
                        createCollection(input: $input) {
                            address
                        }
                    }
                `,
                { input: createInput },
                { authorization: `Bearer ${jwt}` },
            )
            expect(await collectionModel.count()).toBe(1)

            const { errors } = await gqlClient.send(
                gql`
                    mutation ($address: String!) {
                        deleteCollection(address: $address) {
                            address
                        }
                    }
                `,
                { address: createInput.address },
                { authorization: `Bearer ${jwt}` },
            )
            expect(errors).toBeUndefined()
            expect(await collectionModel.count()).toBe(0)
        })

        it('should reject the request if the user is not ADMIN', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'ADMIN')
            await setRole(userModel, `0x${user2Keypair.getPublicKey().toSuiAddress()}`, 'USER')
            const { jwt } = await login(gqlClient, userKeypair)
            const { jwt: jwt2 } = await login(gqlClient, user2Keypair)
            const createInput: CreateCollectionInput = {
                name: 'Test Collection',
                slug: 'test-collection',
                address: 'test-collection-address',
            }
            await gqlClient.send<{ createCollection: Collection }>(
                gql`
                    mutation ($input: CreateCollectionInput!) {
                        createCollection(input: $input) {
                            address
                        }
                    }
                `,
                { input: createInput },
                { authorization: `Bearer ${jwt}` },
            )
            expect(await collectionModel.count()).toBe(1)

            const { response } = await gqlClient.send(
                gql`
                    mutation ($address: String!) {
                        deleteCollection(address: $address) {
                            address
                        }
                    }
                `,
                { address: createInput.address },
                { authorization: `Bearer ${jwt2}` },
            )

            expectGqlError(response, AuthError.Unauthorized)
        })

        it('should reject the request if the user is not OWNER', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'USER')
            await setRole(userModel, `0x${user2Keypair.getPublicKey().toSuiAddress()}`, 'USER')
            const { jwt } = await login(gqlClient, userKeypair)
            const { jwt: jwt2 } = await login(gqlClient, user2Keypair)
            const createInput: CreateCollectionInput = {
                name: 'Test Collection',
                slug: 'test-collection',
                address: 'test-collection-address',
            }
            await gqlClient.send<{ createCollection: Collection }>(
                gql`
                    mutation ($input: CreateCollectionInput!) {
                        createCollection(input: $input) {
                            address
                        }
                    }
                `,
                { input: createInput },
                { authorization: `Bearer ${jwt}` },
            )
            expect(await collectionModel.count()).toBe(1)

            const { response } = await gqlClient.send(
                gql`
                    mutation ($address: String!) {
                        deleteCollection(address: $address) {
                            address
                        }
                    }
                `,
                { address: createInput.address },
                { authorization: `Bearer ${jwt2}` },
            )

            expectGqlError(response, AuthError.Unauthorized)
        })
    })

    afterAll(async () => {
        await app.close()
        await connection.disconnect()
    })
})
