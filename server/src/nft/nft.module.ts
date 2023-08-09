import { Connection } from 'mongoose'

import { forwardRef, Module } from '@nestjs/common'

import { AwsModule } from '~/aws/aws.module'
import { CacheModule } from '~/cache/cache.module'
import { CollectionModule } from '~/collection/collection.module'
import { DATABASE_CONNECTION, NFT_EVENT_MODEL, NFT_MODEL } from '~/const'
import { DatabaseModule } from '~/database/database.module'
import { MarketplaceModule } from '~/marketplace/marketplace.module'
import { SuiModule } from '~/sui/sui.module'
import { UserModule } from '~/user/user.module'

import { AdminNftEventResolver, NftEventResolver } from './nft-event.resolver'
import { NftResolver } from './nft.resolver'
import { NftEventSchema, NftSchema } from './nft.schema'
import { NftService } from './nft.service'

@Module({
    imports: [
        DatabaseModule,
        forwardRef(() => UserModule),
        AwsModule,
        CacheModule,
        forwardRef(() => MarketplaceModule),
        forwardRef(() => SuiModule),
        forwardRef(() => CollectionModule),
    ],
    providers: [
        {
            provide: NFT_MODEL,
            useFactory: (connection: Connection) => connection.model('nfts', NftSchema),
            inject: [DATABASE_CONNECTION],
        },
        {
            provide: NFT_EVENT_MODEL,
            useFactory: (connection: Connection) => connection.model('nft_events', NftEventSchema),
            inject: [DATABASE_CONNECTION],
        },
        NftService,
        NftResolver,
        NftEventResolver,
        AdminNftEventResolver,
    ],
    exports: [NftService, NFT_MODEL, NFT_EVENT_MODEL],
})
export class NftModule {}
