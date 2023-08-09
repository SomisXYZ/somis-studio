import { gql } from 'apollo-server-core'
import { Express } from 'express'
import { DocumentNode } from 'graphql'
import { Model } from 'mongoose'
import supertest from 'supertest'

import { Ed25519Keypair } from '@mysten/sui.js'

import { LoginChallenge } from '~/gql/generated'
import { IUser, IUserRole } from '~/user/user.schema'
import { AppError } from '~/utils/error'

function getGqlResponse<T = unknown, E = undefined>(
    response: supertest.Response,
): { data: T; errors: E; response: supertest.Response } {
    const { data, errors } = response.body
    return { data: data as T, errors: errors as E, response }
}

export function expectGqlError(response: supertest.Response, error: AppError) {
    const { errors } = getGqlResponse<unknown, { extensions: { code: string } }[]>(response)
    expect(errors.map((err) => err.extensions.code)).toContain(error.code)
}

export class GqlClient {
    request: supertest.SuperTest<supertest.Test>

    constructor(app: Express) {
        this.request = supertest(app)
    }

    async send<T = unknown, E = undefined>(query: DocumentNode, variables: Record<string, any>, headers: object = {}) {
        const res = await this.request.post('/graphql').set(headers).send({
            query: query.loc?.source?.body,
            variables,
        })
        return getGqlResponse<T, E>(res)
    }
}

export async function login(gqlClient: GqlClient, keypair = Ed25519Keypair.generate()) {
    const publicKey = `0x${keypair.getPublicKey().toSuiAddress()}`
    const { data: challenge } = await gqlClient.send<{ requestLoginChallenge: LoginChallenge }>(
        gql`
            mutation ($publicKey: String!) {
                requestLoginChallenge(publicKey: $publicKey) {
                    jwt
                    signData
                }
            }
        `,
        { publicKey: publicKey },
    )

    const { data: result } = await gqlClient.send<{ submitLoginChallenge: string }>(
        gql`
            mutation ($jwt: String!) {
                submitLoginChallenge(jwt: $jwt, signature: "not-implemented")
            }
        `,
        { jwt: challenge.requestLoginChallenge.jwt },
    )

    return { jwt: result.submitLoginChallenge, publicKey }
}

export async function setRole(userModel: Model<IUser>, address: string, role: IUserRole) {
    await userModel.findOneAndUpdate({ address }, { $set: { role, username: address } }, { upsert: true })
}
