import { useEffect, useState } from 'react'
import { NftWithIndex } from '~/containers/CollectionPage/Contexts/ListContext'
import {
    Nft,
    NftsByOwnerListedFilter,
    useGetCollectionsByOwnerQuery,
    useInfiniteGetNftsByOwnerQuery,
} from '~/gql/generated/graphql'
import { getNftByNftAddresses } from '~/services/blockChain'

type UserOwnedCollection = {
    address: string
    name: string
    image: string | null
    slug: string
    floor: string
    owned: number
}

export const useOwnerNfts = (address?: string) => {
    const limit = 20
    const [loading, setLoading] = useState<boolean>(false)
    const [total, setTotal] = useState<number | null>(null)
    const [nfts, setNfts] = useState<NftWithIndex[] | null>(null)
    const [listedFilter, setListedFilter] = useState<NftsByOwnerListedFilter>(NftsByOwnerListedFilter.All)
    const [userOwnedCollections, setUserOwnedCollections] = useState<UserOwnedCollection[]>([])
    const [collectionAddress, setCollectionAddress] = useState<string | null>(null)
    const {
        data: nftsData,
        hasNextPage,
        fetchNextPage,
        isFetching,
        refetch,
        remove,
    } = useInfiniteGetNftsByOwnerQuery(
        'skip',
        {
            owner: address ?? '',
            limit,
            skip: 0,
            listedFilter,
            collectionAddress,
        },
        {
            getNextPageParam: (_, pages) => {
                if ((total && pages.length * limit >= total) || total === 0) {
                    return undefined
                }
                return pages.length * limit
            },
        },
    )

    const { data: userOwnedCollectionsData } = useGetCollectionsByOwnerQuery({
        owner: address ?? '',
    })

    useEffect(() => {
        if (userOwnedCollectionsData?.collectionsByOwner) {
            const collections = userOwnedCollectionsData.collectionsByOwner.map((collection) => ({
                address: collection.collection.address,
                name: collection.collection.name,
                slug: collection.collection.slug,
                image: collection.collection.imageUrl ?? null,
                floor: collection.collection.stats?.floor ?? '0',
                owned: collection.ownedItems,
            }))
            setUserOwnedCollections(collections)
        }
    }, [userOwnedCollectionsData])

    useEffect(() => {
        setNfts(null)
    }, [listedFilter, collectionAddress])

    const getNftsDetailFromChain = async (newItems: Nft[], lastItems: Nft[]) => {
        setLoading(true)
        const nftAddresses = lastItems.map((nft) => nft.address)
        // Get detail from chain, and filter by owner
        const nfts = await getNftByNftAddresses(nftAddresses)
        const newNfts = newItems
            // .filter((nft) => nfts.find((chainNft) => chainNft.address === nft.address))
            .map((nft, index) => {
                const chainNft = nfts.find((chainNft) => chainNft.address === nft.address)
                return {
                    ...nft,
                    name: chainNft?.name ?? nft.name,
                    imageUrl: chainNft?.url ?? nft.imageUrl,
                    index: index,
                    orderCommission: null,
                }
            })
        setNfts(newNfts)
        setLoading(false)
    }

    useEffect(() => {
        const lastPage = nftsData?.pages.slice(-1)[0]
        setTotal(lastPage?.nftsByOwner?.totalItems !== undefined ? lastPage?.nftsByOwner?.totalItems ?? 0 : null)
        const newItems = (nftsData?.pages.flatMap((page) => page.nftsByOwner.items) as Nft[]) ?? ([] as Nft[])
        if (newItems.length > 0) {
            const lastItems = (lastPage?.nftsByOwner.items ?? []) as Nft[]
            getNftsDetailFromChain(newItems, lastItems)
        } else {
            setNfts([] as NftWithIndex[])
        }
    }, [nftsData])

    useEffect(() => {
        return () => {
            remove()
        }
    }, [])
    const nftsIsFetching = isFetching || loading

    return {
        nfts,
        total,
        nftsIsFetching,
        hasNextPage,
        listedFilter,
        userOwnedCollections,
        collectionAddress,
        setCollectionAddress,
        fetchNextPage,
        refetch,
        remove,
        setListedFilter,
    }
}
