import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
    Collection,
    Launchpad,
    useUpdateCollectionLogoUrlMutation,
    useUpdateLaunchpadLogoMutation,
    useUpdateNftUploadImageUrlMutation,
} from '~/gql/generated/graphql'
import { useUpdateLaunchpadImageMutation } from '~/gql/generated/graphql'
import { useUpdateLaunchpadCoverMutation } from '~/gql/generated/graphql'
import { useCreateLaunchpadMutation } from '~/gql/generated/graphql'
import { useUpdateCollectionCoverUrlMutation } from '~/gql/generated/graphql'
import { useUpdateCollectionImageUrlMutation } from '~/gql/generated/graphql'
import { CreateCollectionInput } from '~/gql/generated/graphql'
import { CreateLaunchpadInput, useCreateCollectionMutation } from '~/gql/generated/graphql'

// TODO: move to env
export const BUILDER_URL = process.env.NEXT_PUBLIC_BUILDER_URL ?? 'https://builder-staging.somis.xyz'

export interface CreateStudioInput {
    collectionName: string
    description?: string
    url?: string
    symbol: string
    royalty: number
    venues: {
        name: string
        isPublicSale: boolean
        maxMintByWallet: number
        price: number
    }[]
    creator: string
}

export interface StudioBuilder {
    dependencies: string[]
    modules: string[]
}

export async function createStudio(input: CreateStudioInput): Promise<StudioBuilder> {
    const res = await axios.post(`${BUILDER_URL}/build`, input)
    return {
        ...res.data,
    }
}

export interface CreateCollectionWithImagesInput extends CreateCollectionInput {
    cover?: File
    logo?: File
    image?: File
}

export interface CreateLaunchpadWithImagesInput extends CreateLaunchpadInput {
    cover?: File
    logo?: File
    image?: File
}

export async function createCollection(input: CreateCollectionWithImagesInput): Promise<Collection> {
    const client = new QueryClient()
    const { cover, logo, image, ...rest } = input
    const { createCollection } = await client.fetchQuery(
        ['CreateCollection'],
        useCreateCollectionMutation.fetcher({
            input: {
                ...rest,
                whitelisted: false,
            },
        }),
    )
    const collection = createCollection as Collection

    let imageUrl = null,
        coverUrl = null,
        logoUrl = null

    if (image) {
        const imageRes = await client.fetchQuery(
            ['updateCollectionImageUrl'],
            useUpdateCollectionImageUrlMutation.fetcher({
                address: collection.address,
            }),
        )

        const { url, fields } = imageRes.updateCollectionImageUrl
        await uploadImagetoAWS({
            file: image,
            url,
            fields,
        })
        imageUrl = url
    }

    if (cover) {
        const coverRes = await client.fetchQuery(
            ['updateCollectionCoverUrl'],
            useUpdateCollectionCoverUrlMutation.fetcher({
                address: collection.address,
            }),
        )

        const { url, fields } = coverRes.updateCollectionCoverUrl
        await uploadImagetoAWS({
            file: cover,
            url,
            fields,
        })
        coverUrl = url
    }

    if (logo) {
        const logoRes = await client.fetchQuery(
            ['updateCollectionLogoUrl'],
            useUpdateCollectionLogoUrlMutation.fetcher({
                address: collection.address,
            }),
        )

        const { url, fields } = logoRes.updateCollectionLogoUrl
        await uploadImagetoAWS({
            file: logo,
            url,
            fields,
        })
        logoUrl = url
    }

    return {
        ...collection,
        imageUrl,
        coverUrl,
        logoUrl,
    }
}

export async function createLaunchpad(input: CreateLaunchpadWithImagesInput): Promise<Launchpad> {
    const client = new QueryClient()
    const { cover, logo, image, ...rest } = input
    const { createLaunchpad } = await client.fetchQuery(
        ['CreateLaunchpad'],
        useCreateLaunchpadMutation.fetcher({
            input: {
                ...rest,
                whitelisted: false,
            },
        }),
    )

    const launchpad = createLaunchpad as Launchpad

    let imageUrl = 'no-image',
        coverUrl = 'no-image',
        logoUrl = 'no-image'

    if (image) {
        const imageRes = await client.fetchQuery(
            ['updateLaunchpadImage'],
            useUpdateLaunchpadImageMutation.fetcher({
                id: launchpad.id,
            }),
        )

        const { url, fields } = imageRes.updateLaunchpadImage
        await uploadImagetoAWS({
            file: image,
            url,
            fields,
        })

        imageUrl = url
    }

    if (cover) {
        const coverRes = await client.fetchQuery(
            ['updateLaunchpadCover'],
            useUpdateLaunchpadCoverMutation.fetcher({
                id: launchpad.id,
            }),
        )

        const { url, fields } = coverRes.updateLaunchpadCover
        await uploadImagetoAWS({
            file: cover,
            url,
            fields,
        })

        coverUrl = url
    }

    if (logo) {
        const logoRes = await client.fetchQuery(
            ['updateLaunchpadLogo'],
            useUpdateLaunchpadLogoMutation.fetcher({
                id: launchpad.id,
            }),
        )

        const { url, fields } = logoRes.updateLaunchpadLogo
        await uploadImagetoAWS({
            file: logo,
            url,
            fields,
        })

        logoUrl = url
    }

    return {
        ...launchpad,
        imageUrl,
        coverUrl,
        logoUrl,
    }
}

export async function uploadFixedImage(collectionAddress: string, image?: File): Promise<string> {
    if (!image) return Promise.resolve('no-image')
    const client = new QueryClient()
    const { getNftUploadImageUrl } = await client.fetchQuery(
        ['getNftUploadImageUrl'],
        useUpdateNftUploadImageUrlMutation.fetcher({
            address: collectionAddress,
        }),
    )
    const { url, fields } = getNftUploadImageUrl

    return await uploadImagetoAWS({
        file: image,
        url,
        fields,
    })
}

export const uploadImagetoAWS = async ({
    file,
    url,
    fields,
}: {
    file: File
    url: string
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    fields: any
}) => {
    const formData = new FormData()

    Object.entries(fields).forEach(([field, value]) => {
        formData.append(field, value as string)
    })

    formData.append('file', file)
    await axios.request({
        method: 'post',
        url: url,
        data: formData,
    })

    return url + '/' + fields.key
}
