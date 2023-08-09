import { randomBytes } from 'crypto'
import * as jsonwebtoken from 'jsonwebtoken'

import { fromSerializedSignature, verifyMessage, IntentScope } from '@mysten/sui.js'
import { Injectable } from '@nestjs/common'

import { DecodedLoginToken, DecodedToken } from '~/types'
import { UserService } from '~/user/user.service'
import { AuthError, CustomError, SystemError } from '~/utils/error'

const signMessage = [
    `Sign in to Somis.`,
    `This action will authenticate your account and enable to access the Somis platform.`,
    `Your session will be active for 24 hours.`,
    `Nonce:`,
]

@Injectable()
export class AuthService {
    jwtSecret: string
    constructor(private readonly userService: UserService) {
        if (process.env.JWT_SECRET == null) {
            throw new CustomError(SystemError.EnvMissing).addDetails({ message: 'JWT_SECRET is missing in env' })
        }
        this.jwtSecret = process.env.JWT_SECRET
    }

    requestLoginChallenge(publicKey: string) {
        const nonce = randomBytes(8).toString('hex')
        const signData = `${signMessage.join('\r\n')} ${nonce}`

        const payload: DecodedLoginToken = {
            attemptPublicKey: publicKey,
            signData,
        }

        const jwt = jsonwebtoken.sign(payload, this.jwtSecret, {
            expiresIn: '120s',
        })

        return {
            jwt,
            signData,
        }
    }

    async submitLoginChallenge(requestJwt: string, rawSignature: string) {
        const decoded = jsonwebtoken.verify(requestJwt, process.env.JWT_SECRET as string, {
            ignoreExpiration: false,
        }) as DecodedLoginToken

        const { attemptPublicKey: publicKey, storeId, signData } = decoded

        const { pubKey } = fromSerializedSignature(rawSignature)

        if (pubKey.toSuiAddress() !== publicKey) {
            throw new CustomError(AuthError.VerificationFailed).addDetails({ message: 'publicKey address not match' })
        }

        const verifyResult = verifyMessage(signData, rawSignature, IntentScope.PersonalMessage)

        if (!verifyResult) {
            throw new CustomError(AuthError.VerificationFailed)
        }

        const user = await this.userService.getUser(publicKey)
        if (user == null || user.lastLogin == null) {
            await this.userService.initUser(publicKey)
        }
        await this.userService.updateUserLastLogin(publicKey)
        const payload: DecodedToken = {
            publicKey,
            storeId,
            role: user?.role,
        }

        const jwt = jsonwebtoken.sign(payload, this.jwtSecret, {
            expiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
        })
        return { jwt, publicKey }
    }
}
