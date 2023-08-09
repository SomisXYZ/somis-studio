import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { SqsService } from '~/aws/sqs.service'
import {
    LoginChallenge,
    MutationRequestLoginChallengeArgs,
    MutationResolvers,
    MutationSubmitLoginChallengeArgs,
} from '~/gql/generated'
import { NftService } from '~/nft/nft.service'
import { IContext } from '~/types'

import { AuthService } from './auth.service'

@Resolver()
export class AuthResolver implements Partial<MutationResolvers<IContext>> {
    constructor(
        private readonly authService: AuthService,
        private readonly nftService: NftService,
        private readonly sqsService: SqsService,
    ) {}

    @Mutation('requestLoginChallenge')
    async requestLoginChallenge(
        @Context() _ctx: IContext,
        @Args() args: MutationRequestLoginChallengeArgs,
    ): Promise<LoginChallenge> {
        return this.authService.requestLoginChallenge(args.publicKey)
    }

    @Mutation('submitLoginChallenge')
    async submitLoginChallenge(
        @Context() _ctx: IContext,
        @Args() args: MutationSubmitLoginChallengeArgs,
    ): Promise<string> {
        const { jwt, publicKey } = await this.authService.submitLoginChallenge(args.jwt, args.signature)
        await this.sqsService.indexWallet(publicKey)
        return jwt
    }
}
