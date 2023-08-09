import { defaultFieldResolver, GraphQLFieldConfig, GraphQLSchema } from 'graphql'

import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'

import { Role } from '~/gql/generated'
import { IContext } from '~/types'
import { AuthError, CustomError } from '~/utils/error'

interface RoleDirectiveArgs {
    roles: [Role]
}

export function roleDirective<Ctx extends IContext>(schema: GraphQLSchema, directiveName: string): GraphQLSchema {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig: GraphQLFieldConfig<unknown, Ctx, unknown>) => {
            const roleDirective: RoleDirectiveArgs | undefined = getDirective(
                schema,
                fieldConfig,
                directiveName,
            )?.[0] as RoleDirectiveArgs
            if (roleDirective != null) {
                const { resolve = defaultFieldResolver } = fieldConfig
                return {
                    ...fieldConfig,
                    resolve: async function (source, args, context: Ctx, info) {
                        if (roleDirective.roles.includes('USER')) {
                            if (context.tokenError != null) {
                                throw context.tokenError
                            } else if (context.userPublicKey == null) {
                                throw new CustomError(AuthError.Unauthorized)
                            }
                        } else if (roleDirective.roles.includes('ADMIN') && context.role !== 'ADMIN') {
                            throw new CustomError(AuthError.Unauthorized).addDetails({ message: `You are not ADMIN` })
                        }
                        return await resolve(source, args, context, info)
                    },
                }
            }
        },
    })
}
