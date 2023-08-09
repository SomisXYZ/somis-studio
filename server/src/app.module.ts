import { buildSchema, GraphQLSchema } from 'graphql'
import { constraintDirectiveTypeDefs, createApolloQueryValidationPlugin } from 'graphql-constraint-directive'

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ScheduleModule } from '@nestjs/schedule'

import { AppController } from '~/app.controller'
import { AuthModule } from '~/auth/auth.module'
import { AwsModule } from '~/aws/aws.module'
import { CollectionModule } from '~/collection/collection.module'
import { CommonModule } from '~/common.module'
import { LaunchpadModule } from '~/launchpad/launchpad.module'
import { MarketplaceModule } from '~/marketplace/marketplace.module'
import { NftModule } from '~/nft/nft.module'
import { SuiModule } from '~/sui/sui.module'
import { IContext } from '~/types'
import { UserModule } from '~/user/user.module'
import { notImplementDirective } from '~/utils/graphql/notImplemented.directive'
import { roleDirective } from '~/utils/graphql/roles.directive'
import { decodeJWT } from '~/utils/jwt'
import { LoggerModule, LoggerService, getErrorFormatter } from '~/utils/logger'

import { AppConfigModule } from './appconfig/appconfig.module'
import { CacheModule } from './cache/cache.module'
import { OAuthModule } from './oauth/oauth.module'
import { CustomError } from './utils/error'
import { getTypeDefs } from './utils/graphql/getTypeDefs'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
        }),
        ScheduleModule.forRoot(),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            imports: [LoggerModule],
            inject: [LoggerService],
            useFactory: async (loggerService: LoggerService) => {
                const schemaPath = `${__dirname}/**/*.server.graphql`
                const schema = buildSchema([constraintDirectiveTypeDefs, await getTypeDefs(schemaPath)].join('\n'))
                return {
                    schema,
                    transformSchema: (schema: GraphQLSchema) => {
                        let transformedSchema = roleDirective(schema, 'role')
                        transformedSchema = notImplementDirective(transformedSchema, 'not_implemented')
                        return transformedSchema
                    },
                    plugins: [createApolloQueryValidationPlugin({ schema })],
                    typeDefs: [constraintDirectiveTypeDefs],
                    typePaths: [schemaPath],
                    context: (args: {
                        req?: { headers: Record<string, string> }
                        connectionParams?: { authorization?: string }
                    }) => {
                        const { req, connectionParams } = args
                        const token = req?.headers['authorization'] ?? connectionParams?.authorization
                        if (token == null) {
                            return {}
                        }
                        try {
                            const decodedToken = decodeJWT(token)
                            return {
                                userPublicKey: decodedToken?.publicKey,
                                role: decodedToken?.role,
                            } as IContext
                        } catch (err) {
                            if (err instanceof CustomError) {
                                return {}
                            } else {
                                throw err
                            }
                        }
                    },
                    formatError: getErrorFormatter(loggerService),
                    subscriptions: {
                        'graphql-ws': true,
                    },
                }
            },
        }),
        CommonModule,
        AuthModule,
        UserModule,
        MarketplaceModule,
        NftModule,
        CollectionModule,
        LaunchpadModule,
        SuiModule,
        AwsModule,
        CacheModule,
        AppConfigModule,
        OAuthModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
