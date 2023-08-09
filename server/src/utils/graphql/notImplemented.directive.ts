import { GraphQLFieldConfig, GraphQLSchema } from 'graphql'

import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'

import { IContext } from '~/types'
import { CustomError, SystemError } from '~/utils/error'

export function notImplementDirective<Ctx extends IContext>(
    schema: GraphQLSchema,
    directiveName: string,
): GraphQLSchema {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig: GraphQLFieldConfig<unknown, Ctx, unknown>) => {
            const directive = getDirective(schema, fieldConfig, directiveName)?.[0]
            if (directive != null) {
                return {
                    ...fieldConfig,
                    resolve: async function (_source, _args, _context: Ctx, _info) {
                        throw new CustomError(SystemError.NotImplementedError)
                    },
                }
            }
        },
    })
}
