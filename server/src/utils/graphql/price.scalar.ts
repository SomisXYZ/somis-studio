import { StringValueNode, ValueNode } from 'graphql'

import { CustomScalar, Scalar } from '@nestjs/graphql'

import { CustomError, InputError } from '~/utils/error'

@Scalar('Price')
export class PriceScalar implements CustomScalar<string, string> {
    description = 'Positive price in decimal string'

    parseValue(value: unknown): string {
        try {
            const result = Number.parseFloat(value as string)
            if (isNaN(result) || result < 0) {
                throw new Error('Invalid price')
            }
            return value as string
        } catch (_) {
            throw new CustomError(InputError.InputInvalid).addDetails({
                message: 'Price need to be a positive decimal string',
            })
        }
    }

    parseLiteral(value: ValueNode) {
        try {
            const result = Number.parseFloat((value as StringValueNode).value)
            if (isNaN(result) || result < 0) {
                throw new Error('Invalid price')
            }
            return (value as StringValueNode).value
        } catch (_) {
            throw new CustomError(InputError.InputInvalid).addDetails({
                message: 'Price need to be a positive decimal string',
            })
        }
    }

    serialize(value: unknown) {
        return value as string
    }
}
