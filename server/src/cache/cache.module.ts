import { Inject, Module, OnApplicationShutdown } from '@nestjs/common'
import { createClient } from '@redis/client'

import { REDIS_CLIENT, REDIS_SUB_CLIENT } from '~/const'
import { CustomError, SystemError } from '~/utils/error'

import { CacheService } from './cache.service'

@Module({
    imports: [],
    providers: [
        {
            provide: REDIS_CLIENT,
            useFactory: async () => {
                if (process.env.REDIS_ENDPOINT == null) {
                    throw new CustomError(SystemError.EnvMissing).addDetails({
                        message: 'REDIS_ENDPOINT is missing in env',
                    })
                }
                const client = createClient({ url: process.env.REDIS_ENDPOINT })
                return new Promise((resolve) => {
                    client.connect()
                    client.on('ready', () => {
                        resolve(client)
                    })
                })
            },
        },
        {
            provide: REDIS_SUB_CLIENT,
            useFactory: async () => {
                if (process.env.REDIS_ENDPOINT == null) {
                    throw new CustomError(SystemError.EnvMissing).addDetails({
                        message: 'REDIS_ENDPOINT is missing in env',
                    })
                }
                const client = createClient({ url: process.env.REDIS_ENDPOINT })
                return new Promise((resolve) => {
                    client.connect()
                    client.on('ready', () => {
                        resolve(client)
                    })
                })
            },
        },
        CacheService,
    ],
    exports: [CacheService],
})
export class CacheModule implements OnApplicationShutdown {
    constructor(
        @Inject(REDIS_CLIENT) private readonly redisClient: ReturnType<typeof createClient>,
        @Inject(REDIS_SUB_CLIENT) private readonly redisSubClient: ReturnType<typeof createClient>,
    ) {}
    onApplicationShutdown(_signal?: string | undefined) {
        this.redisClient.disconnect()
        this.redisSubClient.disconnect()
    }
}
