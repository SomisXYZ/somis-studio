import DataLoader from 'dataloader'
import fetch from 'node-fetch'

import {
    JsonRpcProvider,
    RawSigner,
    Connection,
    SuiObjectResponse,
    Ed25519Keypair,
    TransactionBlock,
} from '@mysten/sui.js'
import { Injectable } from '@nestjs/common'

import { AppConfigService } from '~/appconfig/appconfig.service'
import { ICollection } from '~/collection/collection.schema'
import { CollectionService } from '~/collection/collection.service'
import { ITradeIntermediate } from '~/marketplace/marketplace.schema'
import { NftService } from '~/nft/nft.service'
import { CustomError, SystemError } from '~/utils/error'
import { LoggerService } from '~/utils/logger'

globalThis.fetch = fetch as any

@Injectable()
export class SuiService {
    objectsDataLoaders: DataLoader<string, SuiObjectResponse>
    nftCollectionMap = new Map<string, string>()
    orderbookCollectionMap = new Map<string, string>()
    keypair: Ed25519Keypair

    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly logger: LoggerService,
        private readonly nftService: NftService,
        private readonly collectionService: CollectionService,
    ) {
        if (process.env.WORKER_SEED_PHRASE == null) {
            throw new CustomError(SystemError.EnvMissing).addDetails({
                message: 'WORKER_SEED_PHRASE is missing',
            })
        }

        this.keypair = Ed25519Keypair.deriveKeypair(process.env.WORKER_SEED_PHRASE)

        this.objectsDataLoaders = new DataLoader(
            async (addresses: readonly string[]) => {
                const appConfig = await this.appConfigService.getAppConfig()
                const provider = new JsonRpcProvider(new Connection({ fullnode: appConfig.privateRpc }))
                const result = await provider.multiGetObjects({
                    ids: addresses as string[],
                    options: { showType: true, showOwner: true, showContent: true, showDisplay: true },
                })
                return result
            },
            { cache: false },
        )
    }
}
