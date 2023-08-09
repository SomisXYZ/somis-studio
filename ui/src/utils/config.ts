import { QueryClient } from '@tanstack/react-query'
import { getCookie } from 'cookies-next'
import { GetServerSidePropsContext } from 'next'
import { useGetAppConfigQuery } from '~/gql/generated/graphql'

export const PLATFORM_FEE = 0.02 // 2%

export interface IAppConfig {
    rpc: string
    permissionPackage: string
    allowlistPackage: string
    authlistPackage: string
    requestPackage: string
    koiskPackage: string
    liquidityLayerPackage: string
    launchpadPackage: string
    nftProtocolPackage: string
    launchpadV2Package: string
    dappPackage: string
    allowlist: string
    network: string
    commissionBps: string
    commissionAddress: string
    liquidityLayerV1Package: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isIAppConfig = (config: any): config is IAppConfig => {
    return config && config.nftProtocolPackage && config.dappPackage && config.allowlist && config.network && config.rpc
}

export const getServerSideConfig = async (context?: GetServerSidePropsContext): Promise<IAppConfig> => {
    const cookiesConfig = JSON.parse((getCookie('config', context) as string) || '{}')
    if (isIAppConfig(cookiesConfig)) {
        return cookiesConfig
    }

    const queryClient = new QueryClient()
    const config = (await queryClient.fetchQuery(useGetAppConfigQuery.getKey(), useGetAppConfigQuery.fetcher()))
        .getAppConfig

    if (!isIAppConfig(config)) {
        throw new Error('Invalid config')
    }

    return config
}
