import { gql } from 'apollo-server-express'
import { Model, Mongoose } from 'mongoose'

import { Ed25519Keypair } from '@mysten/sui.js'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { S3Service } from '~/aws/s3.service'
import { SqsService } from '~/aws/sqs.service'
import { ICollection } from '~/collection/collection.schema'
import {
    COLLECTION_MODEL,
    DATABASE_CONNECTION,
    LAUNCHPAD_MODEL,
    NFT_MODEL,
    S3_PROVIDER,
    SQS_PROVIDER,
    USER_MODEL,
} from '~/const'
import { CreateLaunchpadInput, Launchpad, UpdateLaunchpadInput } from '~/gql/generated'
import { ILaunchpad } from '~/launchpad/launchpad.schema'
import { INft } from '~/nft/nft.schema'
import { IUser } from '~/user/user.schema'
import { AuthError } from '~/utils/error'

import { AppModule } from '../src/app.module'
import { expectGqlError, GqlClient, login, setRole } from './utils/gql'
import { MockSqsService } from './utils/mock'

describe('Launchpad Admin (e2e)', () => {
    let app: INestApplication
    let gqlClient: GqlClient

    let collectionModel: Model<ICollection>
    let nftModel: Model<INft>
    let userModel: Model<IUser>
    let launchpadModel: Model<ILaunchpad>

    let connection: Mongoose

    const userKeypair = Ed25519Keypair.generate()
    const user2Keypair = Ed25519Keypair.generate()

    const initDB = async () => {
        await collectionModel.deleteMany({})
        await userModel.deleteMany({})
        await nftModel.deleteMany({})
        await launchpadModel.deleteMany({})
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
        launchpadModel = moduleFixture.get(LAUNCHPAD_MODEL)
        connection = moduleFixture.get(DATABASE_CONNECTION)
        app.enableShutdownHooks()
        app.useLogger(false)
        await app.init()

        gqlClient = new GqlClient(app.getHttpServer())
    })

    beforeEach(async () => {
        await initDB()
    })

    describe('createLaunchpad', () => {
        it('should create a launchpad by admin', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'ADMIN')
            const { jwt } = await login(gqlClient, userKeypair)

            const input: CreateLaunchpadInput = {
                name: 'test',
                category: 'other',
            }
            const { data, errors } = await gqlClient.send<{ createLaunchpad: Launchpad }>(
                gql`
                    mutation ($input: CreateLaunchpadInput!) {
                        createLaunchpad(input: $input) {
                            id
                        }
                    }
                `,
                { input },
                { authorization: `Bearer ${jwt}` },
            )
            expect(errors).toBeUndefined()
            expect(await launchpadModel.count()).toBe(1)
            expect(await launchpadModel.findOne({ id: data.createLaunchpad.id }).lean().exec()).toMatchObject({
                id: data.createLaunchpad.id,
                ...input,
            })
        })

        it('should create a launchpad by user', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'USER')
            const { jwt } = await login(gqlClient, userKeypair)

            const input: CreateLaunchpadInput = {
                name: 'test',
                category: 'other',
            }
            const { data, errors } = await gqlClient.send<{ createLaunchpad: Launchpad }>(
                gql`
                    mutation ($input: CreateLaunchpadInput!) {
                        createLaunchpad(input: $input) {
                            id
                        }
                    }
                `,
                { input },
                { authorization: `Bearer ${jwt}` },
            )
            expect(errors).toBeUndefined()
            expect(await launchpadModel.count()).toBe(1)
            expect(await launchpadModel.findOne({ id: data.createLaunchpad.id }).lean().exec()).toMatchObject({
                id: data.createLaunchpad.id,
                ...input,
            })
        })
    })

    describe('updateLaunchpad', () => {
        it('should update a launchpad by admin', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'ADMIN')
            const { jwt } = await login(gqlClient, userKeypair)

            const { data: createResult } = await gqlClient.send<{ createLaunchpad: Launchpad }>(
                gql`
                    mutation {
                        createLaunchpad(input: { name: "test", category: "other" }) {
                            id
                        }
                    }
                `,
                {},
                { authorization: `Bearer ${jwt}` },
            )

            const input: UpdateLaunchpadInput = {
                name: 'test',
                category: 'other',
                sections: [{ title: 'section 1', content: 'This is section 1' }],
                mintPrice: '1.23',
                twitter: 'test-twitter',
                discord: 'test-discord',
                website: 'test-website',
                supply: 1000,
                royalty: 1234,
                flags: [
                    { name: 'flag-1', included: true },
                    { name: 'flag-2', included: false },
                ],
                collectionAddress: 'test-collection-address',
                listing: 'test-listing-address',
                venue: 'test-venue-address',
                warehouse: 'test-warehouse-address',
                market: 'test-market-address',
            }
            const { data, errors } = await gqlClient.send<{ updateLaunchpad: Launchpad }>(
                gql`
                    mutation ($id: String!, $input: UpdateLaunchpadInput!) {
                        updateLaunchpad(id: $id, input: $input) {
                            id
                        }
                    }
                `,
                { id: createResult.createLaunchpad.id, input },
                { authorization: `Bearer ${jwt}` },
            )
            expect(errors).toBeUndefined()
            expect(await launchpadModel.count()).toBe(1)
            expect(await launchpadModel.findOne({ id: data.updateLaunchpad.id }).lean().exec()).toMatchObject({
                id: data.updateLaunchpad.id,
                ...input,
            })
        })

        it('should update a launchpad by owner', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'USER')
            const { jwt } = await login(gqlClient, userKeypair)

            const { data: createResult } = await gqlClient.send<{ createLaunchpad: Launchpad }>(
                gql`
                    mutation {
                        createLaunchpad(input: { name: "test", category: "other" }) {
                            id
                        }
                    }
                `,
                {},
                { authorization: `Bearer ${jwt}` },
            )

            const input: UpdateLaunchpadInput = {
                name: 'test',
                category: 'other',
                sections: [{ title: 'section 1', content: 'This is section 1' }],
                mintPrice: '1.23',
                twitter: 'test-twitter',
                discord: 'test-discord',
                website: 'test-website',
                supply: 1000,
                royalty: 1234,
                flags: [
                    { name: 'flag-1', included: true },
                    { name: 'flag-2', included: false },
                ],
                //collectionAddress: 'test-collection-address',
                listing: 'test-listing-address',
                venue: 'test-venue-address',
                warehouse: 'test-warehouse-address',
                market: 'test-market-address',
            }
            const { data, errors } = await gqlClient.send<{ updateLaunchpad: Launchpad }>(
                gql`
                    mutation ($id: String!, $input: UpdateLaunchpadInput!) {
                        updateLaunchpad(id: $id, input: $input) {
                            id
                        }
                    }
                `,
                { id: createResult.createLaunchpad.id, input },
                { authorization: `Bearer ${jwt}` },
            )
            expect(errors).toBeUndefined()
            expect(await launchpadModel.count()).toBe(1)
            expect(await launchpadModel.findOne({ id: data.updateLaunchpad.id }).lean().exec()).toMatchObject({
                id: data.updateLaunchpad.id,
                ...input,
            })
        })

        it('should reject the request if the user is not the owner', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'USER')
            await setRole(userModel, `0x${user2Keypair.getPublicKey().toSuiAddress()}`, 'USER')
            const { jwt } = await login(gqlClient, userKeypair)

            const { data: createResult } = await gqlClient.send<{ createLaunchpad: Launchpad }>(
                gql`
                    mutation {
                        createLaunchpad(input: { name: "test", category: "other" }) {
                            id
                        }
                    }
                `,
                {},
                { authorization: `Bearer ${jwt}` },
            )
            expect(await launchpadModel.count()).toBe(1)
            const { jwt: jwt2 } = await login(gqlClient, user2Keypair)
            const input: UpdateLaunchpadInput = {
                name: 'test',
                category: 'other',
                sections: [{ title: 'section 1', content: 'This is section 1' }],
                mintPrice: '1.23',
                twitter: 'test-twitter',
                discord: 'test-discord',
                website: 'test-website',
                supply: 1000,
                royalty: 1234,
                flags: [
                    { name: 'flag-1', included: true },
                    { name: 'flag-2', included: false },
                ],
                //collectionAddress: 'test-collection-address',
                listing: 'test-listing-address',
                venue: 'test-venue-address',
                warehouse: 'test-warehouse-address',
                market: 'test-market-address',
            }
            const { response } = await gqlClient.send<{ updateLaunchpad: Launchpad }>(
                gql`
                    mutation ($id: String!, $input: UpdateLaunchpadInput!) {
                        updateLaunchpad(id: $id, input: $input) {
                            id
                        }
                    }
                `,
                { id: createResult.createLaunchpad.id, input },
                { authorization: `Bearer ${jwt2}` },
            )
            expectGqlError(response, AuthError.Unauthorized)
        })
    })

    describe('deleteLaunchpad', () => {
        it('should remove the launchpad by admin', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'ADMIN')
            const { jwt } = await login(gqlClient, userKeypair)

            const { data: createResult } = await gqlClient.send<{ createLaunchpad: Launchpad }>(
                gql`
                    mutation {
                        createLaunchpad(input: { name: "test", category: "other" }) {
                            id
                        }
                    }
                `,
                {},
                { authorization: `Bearer ${jwt}` },
            )
            expect(await launchpadModel.count()).toBe(1)

            const { errors } = await gqlClient.send(
                gql`
                    mutation ($id: String!) {
                        deleteLaunchpad(id: $id) {
                            id
                        }
                    }
                `,
                { id: createResult.createLaunchpad.id },
                { authorization: `Bearer ${jwt}` },
            )
            expect(errors).toBeUndefined()
            expect(await launchpadModel.count()).toBe(0)
        })
        it('should remove the launchpad by owner', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'USER')
            const { jwt } = await login(gqlClient, userKeypair)

            const { data: createResult } = await gqlClient.send<{ createLaunchpad: Launchpad }>(
                gql`
                    mutation {
                        createLaunchpad(input: { name: "test", category: "other" }) {
                            id
                        }
                    }
                `,
                {},
                { authorization: `Bearer ${jwt}` },
            )
            expect(await launchpadModel.count()).toBe(1)

            const { errors } = await gqlClient.send(
                gql`
                    mutation ($id: String!) {
                        deleteLaunchpad(id: $id) {
                            id
                        }
                    }
                `,
                { id: createResult.createLaunchpad.id },
                { authorization: `Bearer ${jwt}` },
            )
            expect(errors).toBeUndefined()
            expect(await launchpadModel.count()).toBe(0)
        })

        it('should reject the request if the user is not the owner', async () => {
            await setRole(userModel, `0x${userKeypair.getPublicKey().toSuiAddress()}`, 'USER')
            await setRole(userModel, `0x${user2Keypair.getPublicKey().toSuiAddress()}`, 'USER')
            const { jwt } = await login(gqlClient, userKeypair)

            await gqlClient.send<{ createLaunchpad: Launchpad }>(
                gql`
                    mutation {
                        createLaunchpad(input: { name: "test", category: "other" }) {
                            id
                        }
                    }
                `,
                {},
                { authorization: `Bearer ${jwt}` },
            )
            expect(await launchpadModel.count()).toBe(1)
            const { jwt: jwt2 } = await login(gqlClient, user2Keypair)
            const { response } = await gqlClient.send(
                gql`
                    mutation {
                        deleteLaunchpad(id: "dummy-id") {
                            id
                        }
                    }
                `,
                {},
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
