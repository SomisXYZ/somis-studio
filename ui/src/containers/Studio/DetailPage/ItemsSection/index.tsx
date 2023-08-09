import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Flex, NFTCard, Typography } from '~/components'
import { CollectionWrapper } from '~/components/CollectionWrapper'
import { Launchpad, Nft, useIndexNftMutation, useInfiniteListNftsQuery } from '~/gql/generated/graphql'
import { usePrevious } from '~/hooks/usePrevious'
import { OriginBytesNft, getLaunchpadInfo, getNftByNftAddresses } from '~/services/blockChain'
import { covertOriginBytesNftToNft } from '~/utils/sui'

export const StudioDetailItemSection = ({ launchpad }: { launchpad: Launchpad }) => {
    const [unlistedNfts, setUnlistedNfts] = useState<Nft[] | null>(null)
    const [listedNfts, setListedNfts] = useState<Nft[] | null>(null)
    const [total, setTotal] = useState<number | null>(null)
    const { mutate: indexNftMutate } = useIndexNftMutation()
    const { t } = useTranslation('studio')
    useEffect(() => {
        const init = async () => {
            const mintInfo = await getLaunchpadInfo(launchpad)
            const unlistedNfts = await getNftByNftAddresses(mintInfo.unMintNftAddresses)
            const nfts = await Promise.all(unlistedNfts.map((nft) => covertOriginBytesNftToNft(nft)))
            setUnlistedNfts(nfts)
        }
        init()
    }, [launchpad])

    const {
        data: nftsData,
        hasNextPage,
        fetchNextPage,
        isFetching,
    } = useInfiniteListNftsQuery(
        'skip',
        {
            address: launchpad?.collection?.address ?? '',
            filter: {},
            skip: 0,
            limit: 20,
        },
        {
            getNextPageParam: (_items, pages) => {
                if ((total && pages.length * 20 >= total) || total === 0) {
                    return undefined
                }
                return pages.length * 20
            },
        },
    )
    const prevItems = usePrevious(listedNfts)
    useEffect(() => {
        const lastPage = nftsData?.pages.slice(-1)[0]
        setTotal(lastPage?.nfts?.totalItems !== undefined ? lastPage?.nfts?.totalItems ?? 0 : null)
        const newItems = (nftsData?.pages.flatMap((page) => page.nfts.items) as Nft[]) ?? ([] as Nft[])
        const newItemsWithIndex = newItems.map((item, index) => {
            return { ...item, index, orderCommission: null }
        })
        setListedNfts(newItemsWithIndex)
    }, [nftsData])

    useEffect(() => {
        const syncNfts = async () => {
            if (!listedNfts || (prevItems && listedNfts.length < prevItems.length)) {
                return
            }

            const latestItems = prevItems
                ? listedNfts.filter(
                      (item) => prevItems.findIndex((prevItem) => prevItem.address === item.address) === -1,
                  )
                : listedNfts

            if (!latestItems.length) {
                return
            }
            const unsyncNfts = (await getNftByNftAddresses(latestItems.map((item) => item.address))).filter(
                (nft) => listedNfts.find((item) => item.address === nft.address)?.imageUrl !== nft.url,
            )

            const nfts: Record<string, OriginBytesNft> = unsyncNfts.reduce(
                (prev, curr) => ({ ...prev, [curr.address]: curr }),
                {},
            )
            setListedNfts((prev) =>
                prev ? prev.map((item) => ({ ...item, imageUrl: nfts[item.address]?.url ?? item.imageUrl })) : null,
            )
            if (unsyncNfts.length > 0) {
                unsyncNfts.forEach((nft) => {
                    try {
                        indexNftMutate({
                            address: nft.address,
                        })
                    } catch (error) {
                        console.log(`${nft.address} index error`, error)
                    }
                })
            }
        }
        syncNfts()
    }, [listedNfts])
    return (
        <Flex flexDirection="column" fullWidth className="mt-8" gap={8}>
            <Flex fullWidth gap={4} flexDirection="column">
                <Flex fullWidth alignItems="center" className="color-border border-b pb-3">
                    <Typography variant="lg" bold transform="uppercase">
                        {t('studioDetail.items.unMintNfts')}
                    </Typography>
                </Flex>
                <CollectionWrapper>
                    {unlistedNfts
                        ? (unlistedNfts ?? []).map((nft, index) => (
                              <NFTCard
                                  key={index}
                                  nft={nft}
                                  className={'w-[var(--column-width)]'}
                                  orderbook={nft?.order}
                                  showPrice={false}
                              />
                          ))
                        : Array.from({ length: 12 }).map((_, index) => (
                              <NFTCard key={index} nft={null} className={'w-[var(--column-width)]'} />
                          ))}
                </CollectionWrapper>
            </Flex>
            <Flex fullWidth gap={4} flexDirection="column">
                <Flex fullWidth alignItems="center" className="color-border border-b pb-3">
                    <Typography variant="lg" bold transform="uppercase">
                        {t('studioDetail.items.mintedNfts')}
                    </Typography>
                </Flex>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={() => {
                        if (hasNextPage && !isFetching) {
                            fetchNextPage()
                        }
                    }}
                    hasMore={hasNextPage}
                >
                    <CollectionWrapper>
                        {listedNfts
                            ? (listedNfts ?? []).map((nft, index) => (
                                  <NFTCard
                                      key={index}
                                      nft={nft}
                                      className={'w-[var(--column-width)]'}
                                      orderbook={nft?.order}
                                  />
                              ))
                            : Array.from({ length: 12 }).map((_, index) => (
                                  <NFTCard key={index} nft={null} className={'w-[var(--column-width)]'} />
                              ))}
                    </CollectionWrapper>
                </InfiniteScroll>
            </Flex>
        </Flex>
    )
}
