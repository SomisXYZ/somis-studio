import { forwardRef, Module } from '@nestjs/common'

import { AppConfigModule } from '~/appconfig/appconfig.module'
import { CollectionModule } from '~/collection/collection.module'
import { NftModule } from '~/nft/nft.module'
import { LoggerModule } from '~/utils/logger'

import { SuiService } from './sui.service'

@Module({
    imports: [
        LoggerModule,
        forwardRef(() => AppConfigModule),
        forwardRef(() => NftModule),
        forwardRef(() => CollectionModule),
    ],
    providers: [SuiService],
    exports: [SuiService],
})
export class SuiModule {}
