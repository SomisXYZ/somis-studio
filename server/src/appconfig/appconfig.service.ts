import { Model } from 'mongoose'

import { Inject, Injectable } from '@nestjs/common'

import { SqsService } from '~/aws/sqs.service'
import { CacheService } from '~/cache/cache.service'
import { APP_CONFIG_MODEL } from '~/const'
import { CustomError, SystemError } from '~/utils/error'

import { IAppConfig } from './appconfig.schema'

const CACHE_KEY = 'app_config'

@Injectable()
export class AppConfigService {
    constructor(
        @Inject(APP_CONFIG_MODEL) private readonly appConfigModel: Model<IAppConfig>,
        private readonly cacheService: CacheService,
        private readonly sqsService: SqsService,
    ) {}

    async getAppConfig(): Promise<IAppConfig> {
        const cached = await this.cacheService.get(CACHE_KEY)
        if (cached != null) {
            const result = JSON.parse(cached) as IAppConfig
            if (result.updatedAt == null) {
                result.updatedAt = Date.now()
            }
            return result
        } else {
            const result = await this.appConfigModel.findOne()
            if (result == null) {
                throw new CustomError(SystemError.NotImplementedError).addDetails({ message: 'AppConfig not inited' })
            }
            await this.cacheService.set(CACHE_KEY, JSON.stringify(result), 7200)
            return result
        }
    }

    async updateAppConfig(appConfig: Partial<IAppConfig>): Promise<IAppConfig> {
        const result = (await this.appConfigModel.findOneAndUpdate(
            {},
            { $set: appConfig },
            { upsert: true, new: true },
        )) as IAppConfig
        await this.cacheService.del(CACHE_KEY)
        await this.sqsService.restart()
        return result
    }
}
