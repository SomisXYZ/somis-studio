import { Nft, NftEventType, OrderbookType } from '~/gql/generated/graphql'
import blockChainService from '~/services/blockChain/service'
import { IAppConfig } from './config'
import { covertOrderbookToOrder, covertOriginBytesNftToNft } from './sui'
import { covertSomisOrderbookToOrder } from './sui'
import { OriginBytesCommissionFields } from '~/services/blockChain'

export enum CommissionAddressType {
    hyperspace = 'hyperspace',
    bluemove = 'bluemove',
    clutchy = 'clutchy',
    somis = 'somis',
}

export enum NftStatus {
    Listed = 'listed',
    NotListed = 'notListed',
    /* @Deprecated */
    Canceling = 'canceling',
    CanBuy = 'canBuy',
    CanOffer = 'canOffer',
}

export const isNftCompleted = (nft: Nft | null) => {
    return nft?.name && nft?.name !== ''
}

export const getOrderBook = async (nft: Nft, config?: IAppConfig) => {
    const orderBookAddress = nft.collection?.orderbook
    const somisOrderBookAddress = nft.collection?.somisOrderbook
    const type = nft.collection?.orderbookType

    if (type === OrderbookType.ObV1 && orderBookAddress) {
        const orderBooks = await blockChainService.getOriginbyteV1OrderBooksByAddress(orderBookAddress, config)
        const orderBook = orderBooks?.find((orderBook) => orderBook.nftAddress === nft.address) ?? null
        if (orderBook) {
            return orderBook
        }
    } else if (orderBookAddress) {
        const orderBooks = await blockChainService.getOrderBooksByAddress(orderBookAddress, config)
        const orderBook = orderBooks?.find((orderBook) => orderBook.nftAddress === nft.address) ?? null
        if (orderBook) {
            return orderBook
        }
    }

    if (somisOrderBookAddress) {
        const orderBooks = await blockChainService.getSomisOrderBooksByAddress(somisOrderBookAddress, config)
        const orderBook = orderBooks?.find((orderBook) => orderBook.nftAddress === nft.address) ?? null
        if (orderBook) {
            return orderBook
        }
    }

    return null
}

export const syncNftOrder = async (nft: Nft, config?: IAppConfig) => {
    const orderbookAddress = nft?.collection?.orderbook
    const somisOrderbookAddress = nft?.collection?.somisOrderbook
    const type = nft?.collection?.orderbookType

    const orderbook = orderbookAddress
        ? type === OrderbookType.ObV1
            ? await blockChainService.getOriginbyteV1OrderBooksByAddress(orderbookAddress, config)
            : await blockChainService.getOrderBooksByAddress(orderbookAddress, config)
        : null
    const somisOrderbook = somisOrderbookAddress
        ? await blockChainService.getSomisOrderBooksByAddress(somisOrderbookAddress, config)
        : null
    const nftOrderbook = orderbook?.find((orderbook) => orderbook.nftAddress === nft.address)
    const somisNftOrderbook = somisOrderbook?.find((orderbook) => orderbook.nftAddress === nft.address)
    const order = somisNftOrderbook
        ? covertSomisOrderbookToOrder(somisNftOrderbook, nft)
        : nftOrderbook
        ? covertOrderbookToOrder(nftOrderbook, nft)
        : null

    return order
}

export const syncNftByBlockChain = async (
    originalNft: Nft,
    config?: IAppConfig,
): Promise<
    Nft & {
        kioskAddress?: string
        orderCommission?: OriginBytesCommissionFields | null
    }
> => {
    const [chainNft, order] = await Promise.all([
        await covertOriginBytesNftToNft(await blockChainService.getNftByAddress(originalNft.address, config)),
        await syncNftOrder(originalNft, config),
    ])
    // If blockchain orderbook not find this nft, we delete the order in nft object, the single source of truth is blockchain
    const imageUrl = chainNft.imageUrl && chainNft.imageUrl !== '' ? chainNft.imageUrl : 'no-image'
    return {
        ...originalNft,
        owner: chainNft.owner ?? order?.seller,
        order: order ?? null,
        name: chainNft.name ?? '',
        description: chainNft.description ?? originalNft.description,
        imageUrl,
        kioskAddress: order?.kioskAddress ?? order?.sellerKiosk ?? '',
        ...((!originalNft.attributes || originalNft.attributes.length === 0) && {
            attributes: chainNft.attributes,
        }),
        orderCommission: order?.commission ?? null,
    }
}

/**
 * Reference Diagram: /docs/nft-status.md
 *
 * Get nft status, if nft is not owner, return CanBuy or CanOffer, if nft is owner, return Listed or NotListed
 * @param nft
 * @param walletAddress
 * @returns
 */
export const getNftStatus = async (nft: Nft, isOwner: boolean) => {
    const isListed = !!nft?.order
    if (!isOwner) {
        return isListed ? NftStatus.CanBuy : NftStatus.CanOffer
    }
    if (isListed) {
        return NftStatus.Listed
    }
    return NftStatus.NotListed
}

export const getNftStatusByEvent = (eventType: NftEventType, isOwner: boolean) => {
    const isListed = eventType === NftEventType.List
    if (!isOwner) {
        return isListed ? NftStatus.CanBuy : NftStatus.CanOffer
    }
    if (isListed) {
        return NftStatus.Listed
    }

    return NftStatus.NotListed
}

export const getCommissionMarketplaceByAddress = (address?: string | null) => {
    switch (address) {
        case '0x1954e6b9b6e483d1d1db8c4b9cb830c9436fcb1ce9f016e6d6294b34bd152036':
            return CommissionAddressType.hyperspace
        case '0x8084455a96bdde21edd8fe48ec3f15dbe1c82b2ee2e0e963d800f3d7d8fbbcd5':
            return CommissionAddressType.bluemove
        case '0x59ff302653885e57a48d8f78abae7da6a7100f14b59ef56866bbb76664410cad':
            return CommissionAddressType.clutchy
        case '0x5c370ee41d19373b7f2cc35b36c6dd569531f022f9c9c6a63e557e6c5b16b94d':
            return CommissionAddressType.somis
    }

    return null
}

export default {
    isNftCompleted,
    getOrderBook,
    syncNftOrder,
    syncNftByBlockChain,
    getNftStatus,
    getNftStatusByEvent,
    getCommissionMarketplaceByAddress,
}
