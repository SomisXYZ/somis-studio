import { Connection } from 'mongoose'

import { forwardRef, Module } from '@nestjs/common'

import { AwsModule } from '~/aws/aws.module'
import { CacheModule } from '~/cache/cache.module'
import { CollectionModule } from '~/collection/collection.module'
import { DATABASE_CONNECTION, USER_MODEL } from '~/const'
import { DatabaseModule } from '~/database/database.module'
import { MarketplaceModule } from '~/marketplace/marketplace.module'
import { NftModule } from '~/nft/nft.module'

import { AdminUserResolver } from './admin-user.resolver'
import { UserResolver } from './user.resolver'
import { UserSchema } from './user.schema'
import { UserService } from './user.service'

@Module({
    imports: [
        DatabaseModule,
        AwsModule,
        CacheModule,
        forwardRef(() => MarketplaceModule),
        forwardRef(() => NftModule),
        forwardRef(() => CollectionModule),
    ],
    providers: [
        UserService,
        UserResolver,
        AdminUserResolver,
        {
            provide: USER_MODEL,
            useFactory: (connection: Connection) => connection.model('users', UserSchema),
            inject: [DATABASE_CONNECTION],
        },
    ],
    exports: [UserService],
})
export class UserModule {}
