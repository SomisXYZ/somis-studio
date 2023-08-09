import { Connection, JsonRpcProvider, SuiObjectResponse, getObjectId } from '@mysten/sui.js'

import DataLoader from 'dataloader'
// import LRUCache from 'lru-cache'
import appContext from '~/contexts/app'
import { IAppConfig } from '~/utils/config'

export function getProvider(config?: IAppConfig) {
    try {
        const { rpc } = config || appContext.getConfig()
        const connection = new Connection({
            fullnode: rpc,
        })
        //
        return new JsonRpcProvider(connection)
    } catch (error) {
        // fallback to default
        return new JsonRpcProvider()
    }
}

export class SuiObjectDataLoader {
    public loader: DataLoader<string, { address: string; res: SuiObjectResponse | undefined }>

    constructor(config?: IAppConfig) {
        this.loader = new DataLoader<string, { address: string; res: SuiObjectResponse | undefined }>(
            async (addresses: readonly string[]) => {
                const provider = getProvider(config)
                // split per 30
                const splitAddresses = addresses.reduce<string[][]>(
                    (acc, address) => {
                        const last = acc[acc.length - 1]
                        if (last.length < 30) {
                            last.push(address)
                        } else {
                            acc.push([address])
                        }
                        return acc
                    },
                    [[]],
                )

                const objects = (
                    await Promise.all(
                        splitAddresses.map((addresses) =>
                            provider.multiGetObjects({
                                ids: addresses as string[],
                                options: {
                                    showContent: true,
                                    showDisplay: true,
                                    showType: true,
                                    showOwner: true,
                                },
                            }),
                        ),
                    )
                ).flat()
                return addresses.map((address) => {
                    const res = objects.find((object) => {
                        const objectId = getObjectId(object)
                        return objectId === address
                    })
                    return { res, address }
                })
            },
            {
                cacheMap: null,
                // cacheMap: new LRUCache({ ttl: 1, ttlAutopurge: true }),
            },
        )
    }
}
