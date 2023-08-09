import * as jsonwebtoken from 'jsonwebtoken'

import { DecodedToken } from '~/types'

import { AuthError, CustomError } from './error'

export function decodeJWT(header: string | null): DecodedToken | null {
    if (header == null || header.length == 0) return null

    const token = header.substring(7, header.length)
    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET as string, {
            ignoreExpiration: false,
        }) as DecodedToken

        return decoded
    } catch (err) {
        if (err instanceof jsonwebtoken.TokenExpiredError) {
            throw new CustomError(AuthError.TokenExpired)
        } else if (err instanceof jsonwebtoken.JsonWebTokenError) {
            throw new CustomError(AuthError.TokenInvalid)
        } else {
            throw err
        }
    }
}
