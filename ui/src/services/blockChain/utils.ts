import {
    CoinStruct,
    getMoveObjectType,
    SuiObjectChangeCreated,
    SuiObjectData,
    SuiObjectResponse,
    SuiTransactionBlockResponse,
    TransactionBlock,
} from '@mysten/sui.js'

export const SUI_TYPE = '0x2::sui::SUI'
export /**
 * Get error message by error code
 * Reference: https://github.com/Origin-Byte/nft-protocol/blob/main/sources/utils/err.move
 * @param code
 * @returns
 */
const getErrorByCode = (code: string): string => {
    console.log(`error code: ${code}`)
    switch (code) {
        case '13370209':
            return 'No Nft left'
        case '13370500':
            return 'Authority not allowed list'
        case '13370701':
            return 'Commission too high'
        case '13370301':
            return 'Invalid Nft'
        default:
            return `Network error (${code})`
    }
}

export const getCollectionType = (collection: SuiObjectResponse): string | undefined => {
    return getMoveObjectType(collection)?.match(/.*<(.*)>/)?.[1]
}

export function getCreatedObjectByType(result: SuiTransactionBlockResponse, objectType: RegExp): string | undefined {
    const object = result.objectChanges?.find((it) => it.type === 'created' && it.objectType.match(objectType))
    // stupid typescript !
    if (object?.type === 'created') {
        return object.objectId
    } else {
        return undefined
    }
}

export const getCreatedObjectsByType = (result: SuiTransactionBlockResponse, objectType: RegExp): string[] => {
    const events = result.objectChanges?.filter((it) => it.type === 'created' && it.objectType.match(objectType))

    return (
        (events?.map((event) => (event as SuiObjectChangeCreated).objectId)?.filter((event) => event) as string[]) ?? []
    )
}

export const isNft = (object: SuiObjectData): boolean => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = object.display?.data as any
    return data != null && 'name' in data && 'image_url' in data
}

export const selectCoinsWithBalanceGreaterThanOrEqual = (coins: CoinStruct[], minPrice: bigint): CoinStruct[] => {
    return coins.filter((coin) => {
        return BigInt(coin.balance) >= BigInt(minPrice)
    })
}

export const selectCoinWithBalanceGreaterThan = (coins: CoinStruct[], minPrice: bigint): CoinStruct | null => {
    const coin = coins
        .sort((a, b) => {
            return Number(b.balance) - Number(a.balance)
        })
        .find((coin) => {
            return BigInt(coin.balance) >= BigInt(minPrice)
        })

    if (coin != null) {
        return coin as CoinStruct
    }
    return null
}
