import { Module } from '@nestjs/common'

import { UserModule } from '~/user/user.module'
import { LoggerModule } from '~/utils/logger'

import { OAuthResolver } from './oauth.resolver'
import { OAuthService } from './oauth.service'

export interface DiscordConfig {
    clientId: string
    clientSecret: string
}

@Module({
    imports: [UserModule, LoggerModule],
    providers: [OAuthResolver, OAuthService],
})
export class OAuthModule {}
