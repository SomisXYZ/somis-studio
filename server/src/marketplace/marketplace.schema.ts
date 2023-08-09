import { Schema } from 'mongoose'

export interface IOrder {
    id: string
    seller: string
    sellerKiosk?: string
    price: string
    priceMist: number
    nftAddress: string
    collectionAddress: string
    createdAt: number
    orderbook: string
    orderbookType: string
    deleted?: boolean
}

export interface ICollectionBid {
    id: string
    bidder: string
    bidderKiosk?: string
    price: string
    collectionAddress: string
    createdAt: number
    orderbook: string
    deleted?: boolean
}

export interface ITradeIntermediate {
    id: string
    address: string
    nftAddress: string
    orderbook: string
    buyer: string
    buyerKiosk: string
    seller: string
    sellerKiosk: string
    settled: boolean
    nftType: string
    ftType: string
    price: string
    createdAt: number
}

export const OrderSchema = new Schema<IOrder>({
    id: { type: String, require: true },
    seller: { type: String, require: true },
    sellerKiosk: { type: String, require: false },
    price: { type: String, require: true },
    nftAddress: { type: String, require: true },
    collectionAddress: { type: String, require: true },
    createdAt: { type: Number, require: true },
    orderbook: { type: String, require: true },
    orderbookType: { type: String, require: true },
    deleted: { type: Boolean, require: false },
})

export const CollectionBidSchema = new Schema<ICollectionBid>({
    id: { type: String, require: true },
    bidder: { type: String, require: true },
    bidderKiosk: { type: String, require: false },
    price: { type: String, require: true },
    collectionAddress: { type: String, require: true },
    createdAt: { type: Number, require: true },
    orderbook: { type: String, require: true },
    deleted: { type: Boolean, require: false },
})

export const TradeIntermediateSchema = new Schema<ITradeIntermediate>({
    id: { type: String, require: true },
    address: { type: String, require: true },
    nftAddress: { type: String, require: true },
    orderbook: { type: String, require: true },
    buyer: { type: String, require: true },
    buyerKiosk: { type: String, require: true },
    seller: { type: String, require: true },
    sellerKiosk: { type: String, require: true },
    settled: { type: Boolean, require: true },
    nftType: { type: String, require: true },
    ftType: { type: String, require: true },
    price: { type: String, require: true },
    createdAt: { type: Number, require: true },
})

TradeIntermediateSchema.index({ id: 1 }, { unique: true })

CollectionBidSchema.index({ id: 1 }, { unique: true })
CollectionBidSchema.index({ bidder: 1 })
CollectionBidSchema.index({ bidderKiosk: 1 })
