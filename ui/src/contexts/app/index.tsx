import { QueryClient } from '@tanstack/react-query'
import create from 'zustand'
import { persist } from 'zustand/middleware'

import { AppConfig, useGetAppConfigQuery } from '~/gql/generated/graphql'
import { IAppConfig } from '~/utils/config'

export interface AppState {
    config: Partial<AppConfig> | null
    fetchConfig: () => Promise<void>
}

export const useAppState = create(
    persist<AppState>(
        (set, get) => {
            return {
                config: get()?.config ?? null,
                fetchConfig: async () => {
                    console.log('fetching config...')
                    const queryClient = new QueryClient()
                    const config = (
                        await queryClient.fetchQuery(useGetAppConfigQuery.getKey(), useGetAppConfigQuery.fetcher())
                    ).getAppConfig
                    console.log('config fetched', JSON.stringify(config, null, 2))
                    set(() => ({
                        config,
                    }))
                },
            }
        },
        {
            name: 'somis-config-storage', // name of item in the storage (must be unique)
            getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
        },
    ),
)

export function getConfig(): IAppConfig {
    const config = useAppState.getState().config
    if (
        !config ||
        !config.launchpadPackage ||
        !config.liquidityLayerPackage ||
        !config.launchpadV2Package ||
        !config.authlistPackage ||
        !config.allowlistPackage ||
        !config.requestPackage ||
        !config.permissionPackage ||
        !config.koiskPackage ||
        !config.nftProtocolPackage ||
        !config.dappPackage ||
        !config.allowlist ||
        !config.network ||
        !config.rpc ||
        !config.commissionBps ||
        !config.liquidityLayerV1Package ||
        !config.commissionAddress
    ) {
        throw new Error('Config not loaded')
    } else {
        return {
            rpc: config.rpc,
            allowlistPackage: config.allowlistPackage,
            authlistPackage: config.authlistPackage,
            requestPackage: config.requestPackage,
            launchpadPackage: config.launchpadPackage,
            launchpadV2Package: config.launchpadV2Package,
            liquidityLayerPackage: config.liquidityLayerPackage,
            permissionPackage: config.permissionPackage,
            koiskPackage: config.koiskPackage,
            nftProtocolPackage: config.nftProtocolPackage,
            dappPackage: config.dappPackage,
            allowlist: config.allowlist,
            network: config.network,
            commissionBps: config.commissionBps,
            commissionAddress: config.commissionAddress,
            liquidityLayerV1Package: config.liquidityLayerV1Package,
        }
    }
}

export default {
    useAppState,
    getConfig,
}
