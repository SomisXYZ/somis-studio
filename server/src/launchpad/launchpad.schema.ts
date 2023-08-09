import { Schema } from 'mongoose'

export interface ILaunchpad {
    id: string
    name: string
    category: string
    imageUrl: string
    coverUrl: string
    logoUrl: string
    // @deprecated
    launchDate?: number
    // @deprecated
    mintPrice?: string
    twitter?: string
    discord?: string
    website?: string
    supply?: number
    royalty?: number
    sections?: ILaunchpadSection[]
    flags?: ILaunchpadFlag[]
    collectionAddress?: string
    listing?: string
    // @deprecated
    venue?: string
    venues?: ILaunchpadVenue[]
    publisher?: string
    metadataStore?: string
    hatchMetadata?: ILaunchpadMetadata[]
    hatchDate?: number
    borrowPolicy?: string
    warehouse?: string
    market?: string
    zealySubdomain?: string
    zealyApiKey?: string
    zealyXp?: number
    order?: number
    owner?: string
    whitelisted?: boolean
}

export interface ILaunchpadSection {
    title: string
    content: string
}

export interface ILaunchpadFlag {
    name: string
    included: boolean
}

export interface ILaunchpadVenue {
    name: string
    address: string
    isPublicSale: boolean
    maxMintPerWallet: number
    startTime: number
    price: string
}

export interface ILaunchpadMetadataAttribute {
    name: string
    value: string
}

export interface ILaunchpadMetadata {
    name: string
    description: string
    imageUrl: string
    attributes: ILaunchpadMetadataAttribute[]
}

export const LaunchpadMetadataAttributeSchema = new Schema<ILaunchpadMetadataAttribute>({
    name: { type: String, required: true },
    value: { type: String, required: true },
})

export const LaunchpadSectionSchema = new Schema<ILaunchpadSection>({
    title: { type: String, required: true },
    content: { type: String, required: true },
})

export const LaunchpadFlagSchema = new Schema<ILaunchpadFlag>({
    name: { type: String, required: true },
    included: { type: Boolean, required: true },
})

export const LaunchpadMetadataSchema = new Schema<ILaunchpadMetadata>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    attributes: { type: [LaunchpadMetadataAttributeSchema], required: true },
})

export const LaunchpadVenueSchema = new Schema<ILaunchpadVenue>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    isPublicSale: { type: Boolean, required: true },
    maxMintPerWallet: { type: Number, required: true },
    startTime: { type: Number, required: true },
    price: { type: String, required: true },
})

export const LaunchpadSchema = new Schema<ILaunchpad>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    coverUrl: { type: String, required: true },
    logoUrl: { type: String, required: true },
    launchDate: { type: Number, required: false },
    mintPrice: { type: String, required: false },
    twitter: { type: String, required: false },
    discord: { type: String, required: false },
    website: { type: String, required: false },
    supply: { type: Number, required: false },
    royalty: { type: Number, required: false },
    sections: { type: [LaunchpadSectionSchema], required: false },
    flags: { type: [LaunchpadFlagSchema], required: false },
    publisher: { type: String, required: false },
    metadataStore: { type: String, required: false },
    hatchMetadata: { type: [LaunchpadMetadataSchema], required: false },
    hatchDate: { type: Number, required: false },
    borrowPolicy: { type: String, required: false },
    collectionAddress: { type: String, required: false },
    listing: { type: String, required: false },
    venue: { type: String, required: false },
    venues: { type: [LaunchpadVenueSchema], required: false },
    warehouse: { type: String, required: false },
    market: { type: String, required: false },
    zealySubdomain: { type: String, required: false },
    zealyApiKey: { type: String, required: false },
    zealyXp: { type: String, required: false },
    order: { type: Number, required: false },
    owner: { type: String, required: false },
    whitelisted: { type: Boolean, required: false },
})

LaunchpadSchema.index({ id: 1 }, { unique: true })
LaunchpadSchema.index({ collectionAddress: 1 }, { unique: true })
LaunchpadSchema.index({ launchDate: -1 })
