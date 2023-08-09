import clsx from 'clsx'

import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetServerSideProps, NextPage } from 'next'
import { Nft, useQueryNftQuery } from '~/gql/generated/graphql'
import { Container } from '~/components'

import { MockOffer } from '~/containers/NftDetail/Offer/Card'
import { NftContentLeft } from '~/containers/NftDetail/Content/Left'
import { NftContentRight } from '~/containers/NftDetail/Content/Right'
import { NftDetailPageContextProvider } from '~/containers/NftDetail/context'
import { Seo } from '~/components/Seo'
import { getServerSideConfig } from '~/utils/config'
import { isNftCompleted, syncNftByBlockChain } from '~/utils/nft'

interface IProps {
    nft: Nft
    needsSync?: boolean
    offers?: MockOffer[]
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params } = context
    if (!params?.address) {
        return {
            notFound: true,
        }
    }
    const queryClient = new QueryClient()
    const address = params.address as string

    // Get the NFT detail from the server
    const data = await queryClient.fetchQuery(
        useQueryNftQuery.getKey({ address }),
        useQueryNftQuery.fetcher({ address }),
    )
    const backendNft = data.nft as Nft | null | undefined
    if (!backendNft) {
        return {
            notFound: true,
        }
    }

    const nft = isNftCompleted(backendNft)
        ? backendNft
        : await syncNftByBlockChain(backendNft, await getServerSideConfig(context))
    return {
        props: {
            nft,
            needsSync: false,
            offers: [],
            dehydratedState: dehydrate(queryClient),
            seo: {
                title: nft?.name ?? 'NFT',
                description: nft?.description,
                image: nft?.imageUrl,
                page: 'NFT',
            },
        },
    }
}

export const NFTPage: NextPage<IProps> = ({ nft, offers = [] }: IProps) => {
    return (
        <NftDetailPageContextProvider originalNft={nft}>
            <>
                <Seo
                    seo={{
                        title: `${nft?.name} | ${nft?.collection?.name}`,
                    }}
                />
                <Container
                    isFullWidth={false}
                    gap={6}
                    className={clsx('w-full', 'max-lg:flex-col', 'lg:gap-14', 'lg:mt-6')}
                >
                    <NftContentLeft />
                    <NftContentRight offers={offers} />
                </Container>
            </>
        </NftDetailPageContextProvider>
    )
}

export default NFTPage
