import { forwardRef, Module } from '@nestjs/common'

import { AwsModule } from '~/aws/aws.module'
import { NftModule } from '~/nft/nft.module'
import { UserModule } from '~/user/user.module'

import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'

@Module({
    imports: [forwardRef(() => UserModule), NftModule, AwsModule],
    providers: [AuthResolver, AuthService],
})
export class AuthModule {}
