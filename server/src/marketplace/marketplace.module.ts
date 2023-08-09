import { Connection } from 'mongoose'

import { forwardRef, Module } from '@nestjs/common'

import { AwsModule } from '~/aws/aws.module'
import { CacheModule } from '~/cache/cache.module'
import { CollectionModule } from '~/collection/collection.module'
import { COLLECTION_BID_MODEL, DATABASE_CONNECTION, TRADE_INTERMEDIATE_MODEL } from '~/const'
import { DatabaseModule } from '~/database/database.module'
import { NftModule } from '~/nft/nft.module'
import { SuiModule } from '~/sui/sui.module'
import { UserModule } from '~/user/user.module'

import { MarketplaceResolver, CollectionBidResolver } from './marketplace.resolver'
import { CollectionBidSchema, TradeIntermediateSchema } from './marketplace.schema'
import { MarketplaceService } from './marketplace.service'

@Module({
    imports: [
        DatabaseModule,
        forwardRef(() => UserModule),
        AwsModule,
        CacheModule,
        forwardRef(() => NftModule),
        forwardRef(() => CollectionModule),
        forwardRef(() => SuiModule),
    ],
    providers: [
        MarketplaceResolver,
        CollectionBidResolver,
        MarketplaceService,
        {
            provide: COLLECTION_BID_MODEL,
            useFactory: (connection: Connection) => connection.model('collection_bids', CollectionBidSchema),
            inject: [DATABASE_CONNECTION],
        },
        {
            provide: TRADE_INTERMEDIATE_MODEL,
            useFactory: (connection: Connection) => connection.model('trade_intermediates', TradeIntermediateSchema),
            inject: [DATABASE_CONNECTION],
        },
    ],
    exports: [MarketplaceService, COLLECTION_BID_MODEL],
})
export class MarketplaceModule {}
