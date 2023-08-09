import { Resolver } from '@nestjs/graphql'

import {
    MutationConnectDiscordArgs,
    MutationConnectTwitterArgs,
    MutationResolvers,
    QueryRequestTwitterOAuthCodeArgs,
    QueryResolvers,
} from '~/gql/generated'
import { IContext, MergeN } from '~/types'

@Resolver()
export class OAuthResolver implements MergeN<[MutationResolvers, QueryResolvers]> {}
