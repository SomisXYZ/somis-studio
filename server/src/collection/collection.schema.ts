import { Schema } from 'mongoose'

export interface ICollection {
    address: string
    name: string
    slug: string
    description?: string
    creators: ICreator[]
    royalty: number // Int bps
    verified: boolean
    imageUrl?: string
    coverUrl?: string
    logoUrl?: string
    twitter?: string
    discord?: string
    website?: string

    // @deprecated
    packageModule?: string
    type?: string

    // to be migrate
    orderbook?: string
    // @deprecated
    somisOrderbook?: string
    transferPolicy?: string
    withdrawPolicy?: string
    bpsRoyaltyStrategy?: string

    collectionObject?: string
    transferAllowlist?: string

    orderbookType?: string

    whitelisted?: boolean
    owner?: string
}

export interface ICreator {
    address: string
    share: number
}

export interface ICollectionStats {
    collectionAddress: string
    totalItems: number
    floor?: string
    vol7D: string
    vol30D: string
    vol24: string
    vol24Delta?: string | null
    totalVol: string
    updatedAt: number
}

export const CreatorSchema = new Schema<ICreator>({
    address: { type: String, require: true },
    share: { type: Number, require: true },
})

export const CollectionSchema = new Schema<ICollection>({
    address: { type: String, require: true },
    slug: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: false },
    creators: { type: [CreatorSchema], require: false },
    royalty: { type: Number, require: false },
    verified: { type: Boolean, require: true },
    imageUrl: { type: String, require: false },
    coverUrl: { type: String, require: false },
    logoUrl: { type: String, require: false },
    discord: { type: String, require: false },
    website: { type: String, require: false },
    twitter: { type: String, require: false },
    packageModule: { type: String, required: false },
    type: { type: String, required: false },
    transferPolicy: { type: String, required: false },
    withdrawPolicy: { type: String, required: false },
    bpsRoyaltyStrategy: { type: String, required: false },
    orderbook: { type: String, require: false },
    orderbookType: { type: String, require: false },
    somisOrderbook: { type: String, require: false },
    whitelisted: { type: Boolean, require: false },
    owner: { type: String, require: false },
    collectionObject: { type: String, require: false },
    transferAllowlist: { type: String, require: false },
})

export const CollectionStatsSchema = new Schema<ICollectionStats>({
    collectionAddress: { type: String, require: true },
    floor: { type: String, require: false },
    vol7D: { type: String, require: false },
    vol30D: { type: String, require: false },
    vol24: { type: String, require: true },
    vol24Delta: { type: String, require: false },
    totalVol: { type: String, require: true },
    totalItems: { type: Number, required: true },
    updatedAt: { type: Number, require: true },
})

CollectionSchema.index({ address: 1 }, { unique: true })
CollectionSchema.index({ slug: 1 }, { unique: true })
CollectionSchema.index({ type: 1 }, { unique: true })
CollectionStatsSchema.index({ collectionAddress: 1 }, { unique: true })
