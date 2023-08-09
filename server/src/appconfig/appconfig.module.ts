import { Connection } from 'mongoose'

import { forwardRef, Module } from '@nestjs/common'

import { AwsModule } from '~/aws/aws.module'
import { CacheModule } from '~/cache/cache.module'
import { APP_CONFIG_MODEL, DATABASE_CONNECTION } from '~/const'
import { DatabaseModule } from '~/database/database.module'
import { SuiModule } from '~/sui/sui.module'

import { AppConfigResolver } from './appconfig.resolver'
import { AppConfigSchema } from './appconfig.schema'
import { AppConfigService } from './appconfig.service'

@Module({
    imports: [DatabaseModule, CacheModule, forwardRef(() => SuiModule), AwsModule],
    providers: [
        {
            provide: APP_CONFIG_MODEL,
            useFactory: (connection: Connection) => connection.model('app_config', AppConfigSchema),
            inject: [DATABASE_CONNECTION],
        },
        AppConfigResolver,
        AppConfigService,
    ],
    exports: [AppConfigService],
})
export class AppConfigModule {}
