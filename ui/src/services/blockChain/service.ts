import {
    CoinStruct,
    getMoveObjectType,
    PaginatedObjectsResponse,
    SuiObjectData,
    SuiObjectResponse,
    SUI_TYPE_ARG,
    getObjectFields,
    ObjectId,
} from '@mysten/sui.js'
import { Launchpad } from '~/gql/generated/graphql'
import { IAppConfig } from '~/utils/config'
import {
    parseListObject,
    parseNft,
    parseOrderBookBidsDetail,
    parseOrderBooksDetail,
    parseOriginbytesV1OrderBookBidsDetail,
    parseOriginbytesV1OrderBooksDetail,
    parseSomisOrderBookBidsDetail,
    parseSomisOrderBooksDetail,
} from './parseData'
import { getProvider, SuiObjectDataLoader } from './provider'
import {
    Certificate,
    OrderBookBidDetail,
    OrderBookDetail,
    OriginBytesAsksFields,
    OriginBytesBidsFields,
    OriginBytesNft,
    OriginBytesOrderBookFields,
    SomisOrderBookBidDetail,
    SomisOrderBookDetail,
    SomisOrderBookFields,
    SomisOrderbookConfig,
    SomisOrderbookConfigFields,
    SuiCoin,
} from './types'
import { isNft } from './utils'
import { DynamicFieldName, DynamicFieldPage } from '@mysten/sui.js/dist/types/dynamic_fields'
import exp from 'constants'

/**
 * Get nfts by nft address
 * @param addresses
 * @returns {Promise<OriginBytesNft[]>}
 * @example
 * const nfts = await getNftByNftAddresses(addresses)
 */
export const getNftByNftAddresses = async (
    addresses: string[],
    force = false,
    config?: IAppConfig,
): Promise<OriginBytesNft[]> => {
    const loader = new SuiObjectDataLoader(config)
    if (force) {
        addresses.forEach((address) => loader.loader.clear(address))
    }
    const data = (await loader.loader.loadMany(addresses))
        .map((data: any) => {
            if (data instanceof Error) {
                return null
            }
            const res = data?.res as unknown as SuiObjectResponse
            if (res?.error?.code === 'deleted') {
                return null
            }
            if (res?.error) {
                throw new Error(res.error.code)
            }
            return res ? parseNft(res) : null
        })
        .filter((it: any): it is OriginBytesNft => it != null)
    return data
}

/**
 * Get nft by nft address
 * @param address
 * @returns {Promise<OriginBytesNft>}
 * @example
 * const nft = await getNft(address)
 */
export const getNftByAddress = async (address: string, config?: IAppConfig): Promise<OriginBytesNft> => {
    const res = await getNftByNftAddresses([address], false, config).then((it) => it[0])
    return res
}

/**
 * Get collection by address
 * @param address
 * @returns {Promise<SuiObjectResponse>}
 */
export const getCollection = async (address: string): Promise<SuiObjectResponse> => {
    return await getProvider().getObject({
        id: address,
        options: {
            showContent: true,
            showDisplay: true,
            showOwner: true,
        },
    })
}

export const getObject = async (address: string): Promise<SuiObjectResponse> => {
    return await getProvider().getObject({
        id: address,
        options: {
            showContent: true,
            showDisplay: true,
            showOwner: true,
            showBcs: true,
            showStorageRebate: true,
        },
    })
}

/**
 * Get balance by wallet address
 * @param address
 * @returns {Promise<{balance: bigint, coins: CoinStruct[]}>}
 */
export const getBalanceByWalletAddress = async (
    address: string,
): Promise<{
    balance: bigint
    coins: CoinStruct[]
}> => {
    const coins = await getProvider().getCoins({
        owner: address,
        coinType: SUI_TYPE_ARG,
    })
    const balance = await getProvider().getBalance({
        owner: address,
        coinType: SUI_TYPE_ARG,
    })
    const totalBalance = balance.totalBalance
    return {
        balance: BigInt(totalBalance),
        coins: coins.data,
    }
}

export async function getAllOwnedObjects(address: string) {
    const data: PaginatedObjectsResponse['data'] = []
    let nextCursor = null
    let hasNextPage = true

    while (hasNextPage) {
        const ownedObjectsResponse: PaginatedObjectsResponse = await getProvider().getOwnedObjects({
            owner: address,
            options: { showType: true, showContent: true, showOwner: true, showDisplay: true },
            cursor: nextCursor,
        })

        hasNextPage = ownedObjectsResponse.hasNextPage
        nextCursor = ownedObjectsResponse.nextCursor
        data.push(...ownedObjectsResponse.data)
    }

    return data
}

export async function getAllDynamicFields(address: string) {
    const data: DynamicFieldPage['data'] = []
    let nextCursor = null
    let hasNextPage = true

    while (hasNextPage) {
        const ownedObjectsResponse: DynamicFieldPage = await getProvider().getDynamicFields({
            parentId: address,
            cursor: nextCursor,
        })

        hasNextPage = ownedObjectsResponse.hasNextPage
        nextCursor = ownedObjectsResponse.nextCursor

        data.push(...ownedObjectsResponse.data)
    }

    return data
}

/**
 * Get coin metadata
 * @param coinType
 * @returns
 */
export const getCoinMetadata = async (coinType: string = SUI_TYPE_ARG): Promise<SuiCoin | null> => {
    return await getProvider().getCoinMetadata({ coinType })
}

/**
 * Get launchpad information from blockchain
 * @param launchpad
 * @returns {Promise<{remain: number, sold: number, total: number, launchpad: Launchpad}>}
 */
export const getLaunchpadInfo = async (
    launchpad: Launchpad,
    existLoader?: SuiObjectDataLoader,
): Promise<{
    remain: number
    sold: number
    total: number
    launchpad: Launchpad
    nftType: string
    unMintNftAddresses: string[]
}> => {
    if (!launchpad || !launchpad.listing || !launchpad.warehouse) {
        throw new Error('Launchpad not found or missing listing or inventory')
    }
    const loader = existLoader ?? new SuiObjectDataLoader()
    const [listingBagFields, warehouseBagFields] = await Promise.all([
        loader.loader.load(launchpad.listing),
        loader.loader.load(launchpad.warehouse),
    ])
    const listObj = parseListObject(listingBagFields.res as unknown as SuiObjectData)
    const provider = getProvider()
    const dynamicFieldsInInventory = await provider.getDynamicFields({ parentId: warehouseBagFields.address })
    if (dynamicFieldsInInventory.data?.length === 0 || !dynamicFieldsInInventory.data?.[0]?.objectId) {
        return {
            remain: 0,
            sold: 0,
            total: 0,
            launchpad,
            nftType: '',
            unMintNftAddresses: [],
        }
    }

    const warehouseAddressInInventory = dynamicFieldsInInventory.data?.[0]?.objectId
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const warehouse: any = await loader.loader.load(warehouseAddressInInventory)
    const tmpnftType = (warehouse.res?.data?.content?.type as string)?.match(/.*<(.*)>/)?.[1] ?? ''
    const nftType = tmpnftType.endsWith('>') ? tmpnftType.slice(0, -1) : tmpnftType

    const unMintNftAddresses =
        warehouse.res?.data?.content?.fields?.nfts?.fields?.vec_0 ??
        warehouse.res?.data?.content?.fields?.value?.fields?.nfts?.fields?.vec_0 ??
        []
    const sold = parseInt(listObj?.proceeds?.fields?.qt_sold?.fields?.total ?? '0')
    const remain =
        parseInt(
            warehouse.res?.data?.content?.fields?.total_deposited ??
                warehouse.res?.data?.content?.fields?.value?.fields?.total_deposited,
        ) ?? 0
    const total = remain + sold
    return {
        remain,
        sold,
        total,
        launchpad,
        nftType: nftType ?? '',
        unMintNftAddresses,
    }
}

/**
 * Get launchpads information from blockchain
 * @param launchpad
 * @returns {Promise<{remain: number, sold: number, total: number, launchpad: Launchpad}>}
 */
export const getLaunchpadsInfo = async (
    launchpads: Launchpad[],
): Promise<{ remain: number; sold: number; total: number; launchpad: Launchpad }[]> => {
    const loader = new SuiObjectDataLoader()
    const promise = launchpads.map(async (launchpad) => {
        return getLaunchpadInfo(launchpad, loader)
    })
    return await Promise.all(promise)
}

/**
 * Get Nfts by owner address
 * @param address
 * @returns {Promise<OriginBytesNft[]>}
 */
export const getNftsByOwnerAddress = async (address: string): Promise<OriginBytesNft[]> => {
    const ownerObjects = await getProvider().getOwnedObjects({
        owner: address,
        options: {
            showType: true,
            showContent: true,
            showDisplay: true,
            showOwner: true,
        },
    })
    const ownerNfts = ownerObjects.data.filter((it) => isNft(it.data as SuiObjectData))
    return await getNftByNftAddresses(ownerNfts.map((it) => it.data?.objectId ?? ''))
}

export const getOrderbookPackage = async (address: string): Promise<string> => {
    const loader = new SuiObjectDataLoader()
    const data = (await loader.loader.load(address)) as unknown as {
        res: SuiObjectResponse
    }
    const orderBookType = getMoveObjectType(data.res)
    const [package_] = orderBookType?.split('::') ?? []
    return package_
}

/**
 * Get OrderBooks by address
 * @param address
 */
export const getOrderBooksByAddress = async (
    address: string,
    config?: IAppConfig,
): Promise<OrderBookDetail[] | undefined> => {
    const loader = new SuiObjectDataLoader(config)
    loader.loader.clear(address)
    try {
        const data = (await loader.loader.load(address)) as unknown as {
            res: SuiObjectResponse
        }
        const orderBookFields = getObjectFields(data.res) as OriginBytesOrderBookFields
        const id = (getObjectFields(orderBookFields.asks) as OriginBytesAsksFields).leaves.fields.id.id
        const allFields = await getAllDynamicFields(id)

        const ids = allFields.map((it) => it.objectId)

        const allObjects = (
            (await loader.loader.loadMany(ids)) as {
                res: SuiObjectResponse
            }[]
        ).map((it) => it.res)

        return parseOrderBooksDetail(allObjects, id)
    } catch (error) {
        console.log('get order book error', error)
        return undefined
    }
}

/**
 * Get OrderBooks by address
 * @param address
 */
export const getOriginbyteV1OrderBooksByAddress = async (
    address: string,
    config?: IAppConfig,
): Promise<OrderBookDetail[] | undefined> => {
    const loader = new SuiObjectDataLoader(config)
    loader.loader.clear(address)
    try {
        const data = (await loader.loader.load(address)) as unknown as {
            res: SuiObjectResponse
        }
        // const orderBookFields = getObjectFields(data.res) as OriginBytesOrderBookFields

        // console.log({ orderbookdata: getObjectFields(orderBookFields.asks) })
        // const fields = (getObjectFields(orderBookFields.asks) as OriginBytesV1AsksFields).o

        return parseOriginbytesV1OrderBooksDetail(data.res)
    } catch (error) {
        console.log('get order book error', error)
        return undefined
    }
}

/**
 * Get OrderBooks by address (v2)
 * @param address
 */
export const getSomisOrderBooksByAddress = async (
    address: string,
    config?: IAppConfig,
): Promise<SomisOrderBookDetail[] | undefined> => {
    const loader = new SuiObjectDataLoader(config)
    loader.loader.clear(address)
    try {
        const data = (await loader.loader.load(address)) as unknown as {
            res: SuiObjectResponse
        }

        const orderBookFields = getObjectFields(data.res) as SomisOrderBookFields
        const id = (getObjectFields(orderBookFields.asks) as OriginBytesAsksFields).leaves.fields.id.id
        const allFields = await getAllDynamicFields(id)
        const ids = allFields.map((it) => it.objectId)

        const allObjects = (
            (await loader.loader.loadMany(ids)) as {
                res: SuiObjectResponse
            }[]
        ).map((it) => it.res)
        return parseSomisOrderBooksDetail(
            allObjects,
            id,
            getObjectFields(orderBookFields.config) as SomisOrderbookConfigFields,
        )
    } catch (error) {
        console.log('get order book error', error)
        return undefined
    }
}

/**
 * Get OrderBook Bids by address
 * @param address
 */
export const getOrderBookBidsByAddress = async (
    address: string,
    config?: IAppConfig,
): Promise<OrderBookBidDetail[] | undefined> => {
    const loader = new SuiObjectDataLoader(config)
    loader.loader.clear(address)
    try {
        const data = (await loader.loader.load(address)) as unknown as {
            res: SuiObjectResponse
        }

        const orderBookFields = getObjectFields(data.res) as OriginBytesOrderBookFields

        const id = (getObjectFields(orderBookFields.bids) as OriginBytesBidsFields).leaves.fields.id.id
        const allFields = await getAllDynamicFields(id)

        const ids = allFields.map((it) => it.objectId)

        const allObjects = (
            (await loader.loader.loadMany(ids)) as {
                res: SuiObjectResponse
            }[]
        ).map((it) => it.res)

        return parseOrderBookBidsDetail(allObjects, id)
    } catch (error) {
        console.log('get order book error', error)
        return undefined
    }
}

/**
 * Get OrderBook Bids by address
 * @param address
 */
export const getOriginbyteV1OrderBookBidsByAddress = async (
    address: string,
    config?: IAppConfig,
): Promise<OrderBookBidDetail[] | undefined> => {
    const loader = new SuiObjectDataLoader(config)
    loader.loader.clear(address)
    try {
        const data = (await loader.loader.load(address)) as unknown as {
            res: SuiObjectResponse
        }

        return parseOriginbytesV1OrderBookBidsDetail(data.res)
    } catch (error) {
        console.log('get order book error', error)
        return undefined
    }
}

/**
 * Get OrderBooks by address (v2)
 * @param address
 */
export const getSomisOrderBookBidByAddress = async (
    address: string,
    config?: IAppConfig,
): Promise<SomisOrderBookBidDetail[] | undefined> => {
    const loader = new SuiObjectDataLoader(config)
    loader.loader.clear(address)
    try {
        const data = (await loader.loader.load(address)) as unknown as {
            res: SuiObjectResponse
        }

        const orderBookFields = getObjectFields(data.res) as OriginBytesOrderBookFields

        const id = (getObjectFields(orderBookFields.bids) as OriginBytesBidsFields).leaves.fields.id.id
        const allFields = await getAllDynamicFields(id)
        const ids = allFields.map((it) => it.objectId)

        const allObjects = (
            (await loader.loader.loadMany(ids)) as {
                res: SuiObjectResponse
            }[]
        ).map((it) => it.res)
        return parseSomisOrderBookBidsDetail(allObjects, id)
    } catch (error) {
        console.log('get order book error', error)
        return undefined
    }
}

export const getPaymentModule = async (
    paymentAddress: string,
): Promise<{
    package: string
    module: string
}> => {
    const paymentObj = await getProvider().getObject({
        id: paymentAddress,
        options: { showType: true, showOwner: true, showContent: true, showDisplay: true },
    })

    const paymentType = getMoveObjectType(paymentObj)
    const [package_, module] = paymentType?.split('<')?.[1]?.split('::') ?? []

    return {
        package: package_,
        module,
    }
}

export const getOwnedOriginbyteKiosk = async (address: string): Promise<string | null> => {
    const ownerObjects = await getAllOwnedObjects(address)
    const ownerTokens = ownerObjects.filter((it) => it.data?.type?.includes('ob_kiosk::OwnerToken'))
    const tokenKiosks = ownerTokens.map((it) => getObjectFields(it)?.kiosk ?? null).filter((it) => it != null)
    return tokenKiosks?.[0] ?? null
}

export const getOwnedKioskNftAddresses = async (
    address: string,
): Promise<
    {
        kioskAddress: string | null
        nftAddress: string
    }[]
> => {
    const ownerObjects = await getAllOwnedObjects(address)
    const ownerTokens = ownerObjects.filter((it) => it.data?.type?.includes('ob_kiosk::OwnerToken'))
    const tokenKiosks = ownerTokens.map((it) => getObjectFields(it)?.kiosk ?? null).filter((it) => it != null)
    const allDynameicFields = await Promise.all(tokenKiosks.map((it) => getAllDynamicFields(it)))
    const flatFields = allDynameicFields.flatMap((it, index) => {
        return it.map((field) => {
            return {
                ...field,
                kioskAddress: tokenKiosks[index],
            }
        })
    })
    const items = flatFields.filter((it) => it?.name?.type.includes('::kiosk::Item'))

    return items.map((it) => ({
        kioskAddress: it.kioskAddress,
        nftAddress: it.objectId,
    }))
}

export const getOwnedWhitelistCerts = async (address: string): Promise<Certificate[]> => {
    try {
        const ownedObjects = await getAllOwnedObjects(address)
        const cert = ownedObjects.filter((c) => c.data?.type?.includes('::market_whitelist::Certificate'))
        return cert.map((it) => ({
            address: it.data?.objectId ?? '',
            listingId: getObjectFields(it)?.listing_id ?? '',
            venueId: getObjectFields(it)?.venue_id ?? '',
            type: it.data?.type ?? '',
            owner:
                (
                    it.data?.owner as {
                        AddressOwner: string
                    }
                )?.AddressOwner ?? '',
        }))
    } catch (error) {
        console.log('get whitelist cert error', error)
        return []
    }
}

export const getOwnedNftLengthByType = async (address: string, nftType: string): Promise<number> => {
    try {
        const [ownedObjects, ownedKioskNftAddresses] = await Promise.all([
            getAllOwnedObjects(address),
            getOwnedKioskNftAddresses(address),
        ])
        const kioskNfts = await getNftByNftAddresses(ownedKioskNftAddresses.map((it) => it.nftAddress))
        const ownedNftLength =
            ownedObjects.filter((it) => it.data?.type === nftType).length +
            kioskNfts.filter((it) => it.nftType === nftType).length

        return ownedNftLength
    } catch (error) {
        console.log('get nft length error', error)
        return 0
    }
}

export const getOwnedNftsByType = async (address: string, nftType: string): Promise<OriginBytesNft[]> => {
    const [ownedObjects, ownedKioskNftAddresses] = await Promise.all([
        getAllOwnedObjects(address),
        getOwnedKioskNftAddresses(address),
    ])
    const kioskNfts = (await getNftByNftAddresses(ownedKioskNftAddresses.map((it) => it.nftAddress))).filter(
        (it) => it.nftType === nftType,
    )
    const ownedNfts = ownedObjects.filter((it) => it.data?.type === nftType) as OriginBytesNft[]

    return ownedNfts.concat(kioskNfts)
}

export const getNoAttributesNftsByType = async (address: string, nftType: string): Promise<OriginBytesNft[]> => {
    const ownedNfts = await getOwnedNftsByType(address, nftType)
    const noAttributesNfts = ownedNfts.filter((nft) => nft.attributes.length === 0)
    return noAttributesNfts
}

export default {
    getNftByAddress,
    getNftByNftAddresses,
    getCollection,
    getBalanceByWalletAddress,
    getCoinMetadata,
    getLaunchpadInfo,
    getOrderBooksByAddress,
    getOriginbyteV1OrderBooksByAddress,
    getSomisOrderBooksByAddress,
    getSomisOrderBookBidByAddress,
    getOrderBookBidsByAddress,
    getNftsByOwnerAddress,
    getPaymentModule,
    getOwnedOriginbyteKiosk,
    getOrderbookPackage,
    getOriginbyteV1OrderBookBidsByAddress,
    getOwnedWhitelistCerts,
    getOwnedNftLengthByType,
    getOwnedNftsByType,
    getNoAttributesNftsByType,
}
