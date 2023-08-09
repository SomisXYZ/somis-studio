import { MIST_PER_SUI, getObjectFields } from '@mysten/sui.js'
import appContext from '~/contexts/app'
import { Nft, Order, OrderbookType, User } from '~/gql/generated/graphql'
import {
    OrderBookDetail,
    OriginBytesCommissionFields,
    OriginBytesNft,
    SomisOrderBookDetail,
    getCollection,
    getObject,
} from '../services/blockChain'

export const DEFAULT_MIN_GAS_BUDGET = 80000000 // 0.08 SUI
export const DEFAULT_GAS_BUDGET = 200000000 // 0.2 SUI

export const EnableFixedGasPrice = process.env.NEXT_PUBLIC_ENABLE_FIXED_GAS_PRICE === 'true' || false

export function explorerAddressLink(address?: string): string | undefined {
    return `https://explorer.sui.io/addresses/${address}?network=${appContext.getConfig().network}` ?? undefined
}

export function explorerObjectLink(address?: string): string | undefined {
    return `https://explorer.sui.io/objects/${address}?network=${appContext.getConfig().network}` ?? undefined
}

export function explorerTransactionLink(txId?: string): string | undefined {
    return `https://explorer.sui.io/transaction/${txId}?network=${appContext.getConfig().network}` ?? undefined
}

export async function covertOriginBytesNftToNft(originBytesNft: OriginBytesNft): Promise<Nft> {
    const owner =
        originBytesNft?.owner?.type === 'owner'
            ? ({
                  address: originBytesNft.owner.address,
              } as User)
            : await getOwnerByObjectOwner(originBytesNft)
    return {
        address: originBytesNft.address,
        name: originBytesNft.name,
        imageUrl: originBytesNft.url,
        owner,
        events: [],
        attributes: originBytesNft.attributes.map((attribute) => ({
            floor: '0',
            items: 0,
            name: attribute.key,
            value: attribute.value,
        })),
    }
}

export async function getOwnerByObjectOwner(originBytesNft: OriginBytesNft): Promise<User | null> {
    if (originBytesNft.owner?.type === 'object') {
        const object = await getObject(originBytesNft.owner.address)
        const name = getObjectFields(object)?.name?.fields?.name
        const isKosikObject = (name.type && name.type.includes('kiosk::Item')) ?? false
        const owner = isKosikObject
            ? ({
                  address: getObjectFields(
                      await getObject(
                          (
                              object.data?.owner as {
                                  ObjectOwner: string
                              }
                          )?.ObjectOwner ?? '',
                      ),
                  )?.owner,
              } as User)
            : null
        return owner
    }

    return null
}

export function covertOrderbookToOrder(
    originBytesOrderbook: OrderBookDetail,
    nft: Nft,
): Order & {
    kioskAddress?: string
    type: OrderbookType | undefined | null
    commission: OriginBytesCommissionFields | null
} {
    // TODO: fix this
    const price = Number(originBytesOrderbook.price) * (1 / Number(MIST_PER_SUI))
    const isSameSeller = originBytesOrderbook.owner === nft?.order?.seller?.address
    return {
        collectionAddress: nft?.collection?.address ?? '',
        createdAt: nft?.order?.createdAt ?? '',
        id: originBytesOrderbook.address,
        nft,
        nftAddress: originBytesOrderbook.nftAddress,
        price,
        seller: {
            ...(isSameSeller ? nft?.order?.seller : {}),
            address: originBytesOrderbook.owner,
            name: isSameSeller ? nft?.order?.seller?.name ?? '' : originBytesOrderbook.owner,
            username: isSameSeller ? nft?.order?.seller?.username ?? '' : originBytesOrderbook.owner,
            estValue: 0,
            listed: 0,
            unlisted: 0,
            ownedItems: 0,
        },
        orderbook: originBytesOrderbook.address,
        orderbookType: nft.order?.orderbookType ?? nft.collection?.orderbookType ?? OrderbookType.Somis,
        kioskAddress: originBytesOrderbook.kioskAddress,
        sellerKiosk: originBytesOrderbook.kioskAddress,
        // sellerSafe: originBytesOrderbook.safeAddress,
        type: nft.collection?.orderbookType,
        commission: originBytesOrderbook.commission,
    }
}

export function covertSomisOrderbookToOrder(
    originBytesOrderbook: SomisOrderBookDetail,
    nft: Nft,
): Order & {
    type: OrderbookType | undefined | null
    kioskAddress?: string
    commission: OriginBytesCommissionFields | null
} {
    const price = Number(originBytesOrderbook.price) * (1 / Number(MIST_PER_SUI))
    const isSameSeller = originBytesOrderbook.seller === nft?.order?.seller?.address
    return {
        collectionAddress: nft?.collection?.address ?? '',
        createdAt: nft?.order?.createdAt ?? '',
        id: originBytesOrderbook.address,
        nft,
        nftAddress: originBytesOrderbook.nftAddress,
        price,
        seller: {
            ...(isSameSeller ? nft?.order?.seller : {}),
            address: originBytesOrderbook.seller,
            name: isSameSeller ? nft?.order?.seller?.name ?? '' : originBytesOrderbook.seller,
            username: isSameSeller ? nft?.order?.seller?.username ?? '' : originBytesOrderbook.seller,
            estValue: 0,
            listed: 0,
            unlisted: 0,
            ownedItems: 0,
        },
        orderbook: originBytesOrderbook.address,
        orderbookType: nft.order?.orderbookType ?? nft.collection?.orderbookType ?? OrderbookType.Somis,
        type: nft.collection?.orderbookType,
        commission: originBytesOrderbook.commission,
    }
}

export function convertSuiToMist(sui: number | string): bigint {
    return BigInt((Number(sui) * Number(MIST_PER_SUI)).toFixed(0))
}
