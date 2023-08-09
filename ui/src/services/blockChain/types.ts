import { ObjectContentFields, SuiObjectData } from '@mysten/sui.js'

export type OriginBytesOriginType<T> = SuiObjectData & {
    type: string
    fields: T
}

export type OriginBytesNft = {
    address: string
    owner: {
        address: string
        type: 'owner' | 'contract' | 'object' | 'immutable'
    } | null
    name: string
    description: string
    url: string
    nftType?: string
    attributes: {
        key: string
        value: string
    }[]
}

export type SomisOrderbookConfigFields = {
    commission_beneficiary: string
    commission_bps: string
    royalty_bps: string
}
export type SomisOrderbookConfig = OriginBytesOriginType<SomisOrderbookConfigFields>

export type SomisOrderBookFields = {
    bids: OriginBytesBids
    asks: OriginBytesAsks
    id: {
        id: string
    }
    protected_actions: OriginBytesOriginType<{
        buy_nft: boolean
        cancel_ask: boolean
        cancel_bid: boolean
        create_ask: boolean
        create_bid: boolean
    }>
    config: SomisOrderbookConfig
}

export type OriginBytesOrderBookFields = {
    bids: OriginBytesBids
    asks: OriginBytesAsks
    id: {
        id: string
    }
    protected_actions: OriginBytesOriginType<{
        buy_nft: boolean
        cancel_ask: boolean
        cancel_bid: boolean
        create_ask: boolean
        create_bid: boolean
    }>
}

/**
 * @deprecated
 */
export type OriginBytesBids = OriginBytesOriginType<OriginBytesBidsFields>
export type OriginBytesBidsFields = {
    internal_nodes: OriginBytesInternalNodes
    leaves: OriginBytesLeaves
}

export type OriginBytesInternalNodes = OriginBytesOriginType<OriginBytesInnerNodeFields>
export type OriginBytesLeaves = OriginBytesOriginType<OriginBytesInnerNodeFields>

export type OriginBytesAsks = OriginBytesOriginType<OriginBytesAsksFields>
export type OriginBytesAsksFields = {
    internal_nodes: OriginBytesInternalNodes
    leaves: OriginBytesLeaves
}

export type OriginBytesV1AsksFields = {
    i: OriginBytesV1InnerNode[]
    o: OriginBytesOuterNode[]
    r: string
}

export type OriginBytesV1InnerNode = OriginBytesOriginType<OriginBytesV1InnerNodeFields>
export type OriginBytesV1InnerNodeFields = {
    c: number
    l: string
    p: string
    r: string
}

export type OriginBytesInnerNode = OriginBytesOriginType<OriginBytesOuterNodeFields>
export type OriginBytesInnerNodeFields = {
    size: string
    id: {
        id: string
    }
}

export type OriginBytesOuterNode = OriginBytesOriginType<OriginBytesOuterNodeFields>
export type OriginBytesOuterNodeFields = {
    k: string
    p: string
    v: OriginBytesOuterNodeValue[]
}

export type OriginBytesV1BidsFields = {
    i: OriginBytesV1InnerNode[]
    o: OriginBytesOuterBidNode[]
    r: string
}

export type OriginBytesOuterBidNode = OriginBytesOriginType<OriginBytesOuterNodeFields>
export type OriginBytesOuterBidNodeFields = {
    k: string
    p: string
    v: OriginBytesOuterBidNodeValue[]
}

export type OriginBytesOuterBidNodeValue = OriginBytesOriginType<OriginBytesOuterNodeValueFields>
export type OriginBytesOuterBidNodeValueFields = {
    commission: OriginBytesCommission
    owner: string
    offer: string
    kiosk: string
}
export type OriginBytesOuterNodeValue = OriginBytesOriginType<OriginBytesOuterNodeValueFields>
export type OriginBytesOuterNodeValueFields = {
    commission: OriginBytesCommission
    owner: string
    price: string
    nft_id: string
    kiosk_id: string
}

export type OriginBytesTransferCap = OriginBytesOriginType<OriginBytesTransferCapFields>

export type OriginBytesTransferCapInnerFields = {
    id: { id: string }
    is_exclusive: boolean
    is_generic: boolean
    nft: string
    safe: string
    version: string
}

export type OriginBytesTransferCapFields = {
    id: { id: string }
    inner: OriginBytesOriginType<OriginBytesTransferCapInnerFields>
    safe: string
}

export type OriginBytesCommission = OriginBytesOriginType<OriginBytesCommissionFields>

export type OriginBytesCommissionFields = {
    beneficiary: string
    cut: string
}

export type OriginBytesNftFields = {
    name: string
    description: string
    url: string
    attributes: { fields: ObjectContentFields }
    id: { id: string }
}

export type OriginBytesListFields = {
    proceeds: {
        fields: {
            id: { id: string }
            qt_sold: {
                fields: {
                    collected: string
                    total: string
                }
                type: string
            }
        }
        type: string
    }
}

export type OriginBytesInventoryFields = {
    nfts: string[]
}

export type SuiCoin = {
    symbol: string
    id: string | null
    description: string
    name: string
    decimals: number
    iconUrl: string | null
}

export type TransferObjectEvent = {
    transferObject: {
        objectId: string
        version: number
        recipient:
            | {
                  AddressOwner: string
              }
            | {
                  ObjectOwner: string
              }
            | {
                  Shared: {
                      initial_shared_version: number
                  }
              }
            | 'Immutable'
        sender: string
        packageId: string
        transactionModule: string
        objectType: string
    }
}

export type OrderBookDetail = {
    address: string
    commission: OriginBytesCommissionFields | null
    owner: string
    price: string
    nftAddress: string
    kioskAddress: string
}

export type OrderBookBidDetail = {
    commission: OriginBytesCommissionFields | null
    owner: string
    offer: string
    kioskAddress: string
}

export type SomisOrderbookAskField = {
    nft: OriginBytesOriginType<OriginBytesNft>
    nft_id: string
    price: string
    seller: string
}

export type SomisBidNodeValue = OriginBytesOriginType<SomisBidNodeFields>
export type SomisBidNodeFields = {
    owner: string
    offer: string
    buyer: string
}

export type SomisOrderBookDetail = {
    address: string
    seller: string
    price: string
    nftAddress: string
    commission: OriginBytesCommissionFields | null
}

export type SomisOrderBookBidDetail = {
    owner: string
    offer: string
    address: string
    buyer: string
}

export enum EmitEventType {
    Buy = 'BUY',
    List = 'LIST',
    Cancel = 'CANCEL',
}

export type Certificate = {
    listingId: string
    venueId: string
    type: string
    address: string
    owner: string
}
