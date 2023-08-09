import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AppConfigResolvers, MutationResolvers, MutationUpdateAppConfigArgs, QueryResolvers } from '~/gql/generated'
import { SuiService } from '~/sui/sui.service'
import { IContext, Union3 } from '~/types'

import { AppConfigService } from './appconfig.service'

@Resolver('AppConfig')
export class AppConfigResolver
    implements Union3<Partial<QueryResolvers>, Partial<MutationResolvers>, Partial<AppConfigResolvers>>
{
    constructor(private readonly appConfigSerivce: AppConfigService, private readonly suiService: SuiService) {}
    @Query()
    async getAppConfig(@Context() _ctx: IContext) {
        return await this.appConfigSerivce.getAppConfig()
    }

    @Mutation()
    async updateAppConfig(@Context() _ctx: IContext, @Args() args: MutationUpdateAppConfigArgs) {
        const { input } = args
        const result = await this.appConfigSerivce.updateAppConfig({
            rpc: input.rpc ?? undefined,
            privateRpc: input.privateRpc ?? undefined,
            wsRpc: input.wsRpc ?? undefined,
            explorerRpc: input.explorerRpc ?? undefined,

            permissionPackage: input.permissionPackage ?? undefined,
            allowlistPackage: input.allowlistPackage ?? undefined,
            authlistPackage: input.authlistPackage ?? undefined,
            requestPackage: input.requestPackage ?? undefined,
            koiskPackage: input.koiskPackage ?? undefined,
            liquidityLayerPackage: input.liquidityLayerPackage ?? undefined,
            liquidityLayerV1Package: input.liquidityLayerV1Package ?? undefined,
            launchpadPackage: input.launchpadPackage ?? undefined,
            nftProtocolPackage: input.nftProtocolPackage ?? undefined,
            launchpadV2Package: input.launchpadV2Package ?? undefined,

            dappPackage: input.dappPackage ?? undefined,
            dappPackages: input.dappPackages ?? undefined,
            allowlist: input.allowlist ?? undefined,
            network: input.network ?? undefined,

            commissionAddress: input.commissionAddress ?? undefined,
            commissionBps: input.commissionBps ?? undefined,
            updatedAt: Date.now(),
        })

        return result
    }
}
