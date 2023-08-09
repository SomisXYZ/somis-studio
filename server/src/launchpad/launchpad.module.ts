import { Connection } from 'mongoose'

import { Module } from '@nestjs/common'

import { AwsModule } from '~/aws/aws.module'
import { CollectionModule } from '~/collection/collection.module'
import { DATABASE_CONNECTION, LAUNCHPAD_MODEL } from '~/const'
import { DatabaseModule } from '~/database/database.module'
import { NftModule } from '~/nft/nft.module'

import { LaunchpadResolver } from './launchpad.resolver'
import { LaunchpadSchema } from './launchpad.schema'
import { LaunchpadService } from './launchpad.service'

@Module({
    imports: [DatabaseModule, AwsModule, NftModule, CollectionModule],
    providers: [
        LaunchpadResolver,
        LaunchpadService,
        {
            provide: LAUNCHPAD_MODEL,
            useFactory: (connection: Connection) => connection.model('launchpads', LaunchpadSchema),
            inject: [DATABASE_CONNECTION],
        },
    ],
    exports: [LAUNCHPAD_MODEL],
})
export class LaunchpadModule {}
