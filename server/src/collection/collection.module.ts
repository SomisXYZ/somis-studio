import { Connection } from 'mongoose'

import { forwardRef, Module } from '@nestjs/common'

import { AwsModule } from '~/aws/aws.module'
import { CacheModule } from '~/cache/cache.module'
import { COLLECTION_MODEL, COLLECTION_STATS_MODEL, DATABASE_CONNECTION } from '~/const'
import { DatabaseModule } from '~/database/database.module'
import { MarketplaceModule } from '~/marketplace/marketplace.module'
import { NftModule } from '~/nft/nft.module'
import { UserModule } from '~/user/user.module'

import { CollectionStudioResolver } from './collection-studio.resolver'
import { CollectionCronJobService } from './collection.cronjob'
import { CollectionResolver, CollectionStatsResolver } from './collection.resolver'
import { CollectionSchema, CollectionStatsSchema } from './collection.schema'
import { CollectionService } from './collection.service'

@Module({
    imports: [
        DatabaseModule,
        AwsModule,
        forwardRef(() => UserModule),
        CacheModule,
        forwardRef(() => NftModule),
        forwardRef(() => MarketplaceModule),
    ],
    providers: [
        {
            provide: COLLECTION_MODEL,
            useFactory: (connection: Connection) => connection.model('collections', CollectionSchema),
            inject: [DATABASE_CONNECTION],
        },
        {
            provide: COLLECTION_STATS_MODEL,
            useFactory: (connection: Connection) => connection.model('collections_stats', CollectionStatsSchema),
            inject: [DATABASE_CONNECTION],
        },
        CollectionService,
        CollectionCronJobService,
        CollectionResolver,
        CollectionStatsResolver,
        CollectionStudioResolver,
    ],
    exports: [CollectionService, COLLECTION_MODEL],
})
export class CollectionModule {}
