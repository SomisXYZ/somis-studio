import { StringValueNode, ValueNode } from 'graphql'

import { CustomScalar, Scalar } from '@nestjs/graphql'

import { CustomError, InputError } from '~/utils/error'

@Scalar('DateTime')
export class DateTimeScalar implements CustomScalar<string, number> {
    description = 'DateTime in ISO format'

    parseValue(value: unknown): number {
        try {
            const result = Date.parse(value as string)
            if (isNaN(result)) {
                throw new Error('Invalid format')
            }
            return result
        } catch (_) {
            throw new CustomError(InputError.InputInvalid).addDetails({
                message: 'DateTime need to be a string in ISO 8601 format',
            })
        }
    }

    parseLiteral(value: ValueNode) {
        try {
            const result = Date.parse((value as StringValueNode).value)
            if (isNaN(result)) {
                throw new Error('Invalid format')
            }
            return result
        } catch (_) {
            throw new CustomError(InputError.InputInvalid).addDetails({
                message: 'DateTime need to be a string in ISO 8601 format',
            })
        }
    }

    serialize(value: unknown) {
        return new Date(value as number).toISOString()
    }
}
