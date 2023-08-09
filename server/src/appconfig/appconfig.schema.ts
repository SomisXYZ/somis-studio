import { Schema } from 'mongoose'

export interface IAppConfig {
    rpc: string
    privateRpc: string
    wsRpc: string
    explorerRpc: string

    permissionPackage: string
    allowlistPackage: string
    authlistPackage: string
    requestPackage: string
    koiskPackage: string
    liquidityLayerPackage: string
    liquidityLayerV1Package: string
    launchpadPackage: string
    nftProtocolPackage: string
    launchpadV2Package: string

    dappPackage: string
    dappPackages: string[]
    allowlist: string

    commissionBps: string
    commissionAddress: string

    network: string
    updatedAt: number
}

export const AppConfigSchema = new Schema<IAppConfig>({
    rpc: { type: String, required: true },
    privateRpc: { type: String, required: true },
    wsRpc: { type: String, required: true },
    explorerRpc: { type: String, required: false },

    permissionPackage: { type: String, required: true },
    allowlistPackage: { type: String, required: true },
    authlistPackage: { type: String, required: true },
    requestPackage: { type: String, required: true },
    koiskPackage: { type: String, required: true },
    liquidityLayerPackage: { type: String, required: true },
    liquidityLayerV1Package: { type: String, required: true },
    launchpadPackage: { type: String, required: true },
    nftProtocolPackage: { type: String, required: true },
    launchpadV2Package: { type: String, required: true },

    dappPackage: { type: String, required: true },
    dappPackages: { type: [String], required: true },

    allowlist: { type: String, required: true },
    network: { type: String, required: true },
    updatedAt: { type: Number, required: true },

    commissionBps: { type: String, required: true },
    commissionAddress: { type: String, required: true },
})
