import { Schema } from 'mongoose'

import { IOrder, OrderSchema } from '~/marketplace/marketplace.schema'

export interface INftAttribute {
    name: string
    value: string
}

export interface INft {
    address: string
    name?: string
    collectionAddress?: string
    packageModule?: string
    attributes?: INftAttribute[]
    imageUrl?: string
    owner?: string
    type?: string
    order?: IOrder
}

export interface INftEvent {
    id: string
    txId?: string
    nftAddress: string
    collectionAddress?: string
    createdAt: number
    type:
        | 'MINT'
        | 'LIST'
        | 'CREATE_AUCTION'
        | 'CANCEL_AUCTION'
        | 'BID'
        | 'CANCEL_BID'
        | 'CANCEL_ORDER'
        | 'CANCEL_OFFER'
        | 'BUY'
        | 'ACCEPT_OFFER'
        | 'OFFER'
        | 'TRANSFER'
        | 'BURN'
        | 'CREATE_COLLECTION_BID'
        | 'FULFILL_COLLECTION_BID'
        | 'CANCEL_COLLECTION_BID'
    originOwner?: string
    newOwner?: string
    user?: string
    price?: string
    notificationSent?: boolean
    somisEvent?: boolean
}

export const NftAttributeSchema = new Schema<INftAttribute>({
    name: { type: String, required: true },
    value: { type: String, required: true },
})

export const NftSchema = new Schema<INft>({
    address: { type: String, required: true },
    name: { type: String, required: true },
    collectionAddress: { type: String, required: true },
    packageModule: { type: String, required: false },
    attributes: { type: [NftAttributeSchema], required: true },
    imageUrl: { type: String, required: true },
    owner: { type: String, required: false },
    type: { type: String, required: false },
    order: { type: OrderSchema, required: false },
})

NftSchema.index({ address: 1 }, { unique: true })
NftSchema.index({ collectionAddress: 1 })
NftSchema.index({ name: 1 })
NftSchema.index({ type: 1 })
NftSchema.index({ collectionAddress: 1, order: 1 })
NftSchema.index({ 'order.priceMist': 1 })
NftSchema.index({ collectionAddress: 1, 'order.priceMist': 1 })
NftSchema.index({ 'order.seller': 1 })
NftSchema.index({ owner: 1 })
NftSchema.index({ 'attributes.name': 1 })
NftSchema.index({ 'attributes.value': 1 })

export const NftEventSchema = new Schema<INftEvent>({
    id: { type: String, required: true },
    txId: { type: String, require: false },
    nftAddress: { type: String, required: true },
    collectionAddress: { type: String, required: true },
    createdAt: { type: Number, required: true },
    type: {
        type: String,
        enum: [
            'MINT',
            'LIST',
            'CREATE_AUCTION',
            'CANCEL_AUCTION',
            'BID',
            'CANCEL_BID',
            'CANCEL_ORDER',
            'CANCEL_OFFER',
            'BUY',
            'ACCEPT_OFFER',
            'OFFER',
            'TRANSFER',
            'BURN',
            'CREATE_COLLECTION_BID',
            'FULFILL_COLLECTION_BID',
            'CANCEL_COLLECTION_BID',
        ],
        required: true,
    },
    originOwner: { type: String, required: false },
    newOwner: { type: String, required: false },
    user: { type: String, required: false },
    price: { type: String, required: false },
    notificationSent: { type: Boolean, required: false },
    somisEvent: { type: Boolean, required: false },
})

NftEventSchema.index({ id: 1 }, { unique: true })
NftEventSchema.index({ nftAddress: 1 })
NftEventSchema.index({ type: 1 })
NftEventSchema.index({ createdAt: 1 })
NftEventSchema.index({ collectionAddress: 1 })
