import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { useCallback, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Button, Card, Collapse, Flex, Image, NFTCard, TextInput, Typography } from '~/components'
import { CollectionWrapper } from '~/components/CollectionWrapper'
import { Coin } from '~/components/Coin'
import { ContentWrapper } from '~/containers/ContentWrapper'
import { NftsByOwnerListedFilter } from '~/gql/generated/graphql'
import { UserPageFormContextProvider, useUserPageContext, useUserPageFormContext } from '../context'
import { debounce } from 'lodash'

const FilterMenu = () => {
    const { t } = useTranslation('user')
    const { setListedFilter, listedFilter, userOwnedCollections, setCollectionAddress, collectionAddress } =
        useUserPageFormContext()
    const [hiddenItems, setHiddenItems] = useState<string[]>([])
    const filterChildren = useCallback(
        debounce((keyword: string) => {
            const newItems = userOwnedCollections
                .filter((item) => {
                    return !item.name.toLowerCase().includes(keyword.toLowerCase())
                })
                .map((item) => item.address)
            setHiddenItems(newItems)
        }, 150),
        [],
    )
    return (
        <>
            <Flex alignSelf="start" flexDirection="column" fullWidth>
                <Flex fullWidth gap={3}>
                    <Button
                        title="Listed"
                        variant={listedFilter === NftsByOwnerListedFilter.Listed ? 'default' : 'tertiary'}
                        className={clsx('w-full')}
                        onClick={() => {
                            setListedFilter((prev) =>
                                prev === NftsByOwnerListedFilter.Listed
                                    ? NftsByOwnerListedFilter.All
                                    : NftsByOwnerListedFilter.Listed,
                            )
                        }}
                    />
                    <Button
                        title="Unlisted"
                        variant={listedFilter === NftsByOwnerListedFilter.Unlisted ? 'default' : 'tertiary'}
                        className={clsx('w-full')}
                        onClick={() => {
                            setListedFilter((prev) =>
                                prev === NftsByOwnerListedFilter.Unlisted
                                    ? NftsByOwnerListedFilter.All
                                    : NftsByOwnerListedFilter.Unlisted,
                            )
                        }}
                    />
                </Flex>
                <Flex gap={3} className={clsx('m-4', 'border-b', 'color-border')} />
                <Collapse header="Collection" defaultOpen={userOwnedCollections.length > 0}>
                    <div className={clsx('flex', 'flex-col', 'gap-2')}>
                        <div className="px-2">
                            <TextInput
                                placeholder={t('common:input.search.placeholder') as string}
                                className="mb-2"
                                onChange={(e) => {
                                    filterChildren(e.target.value)
                                }}
                            />
                        </div>
                        <div className={clsx('flex', 'flex-col', 'gap-2', 'relative', 'max-h-60', 'overflow-auto')}>
                            {userOwnedCollections?.map((collection) => (
                                <Card
                                    hover
                                    key={collection.address}
                                    gap={4}
                                    padding={false}
                                    className={clsx(
                                        'px-2',
                                        'py-3',
                                        'cursor-pointer',
                                        hiddenItems.includes(collection.address) && 'hidden',
                                        collectionAddress === collection.address && [
                                            'bg-light-background-hover',
                                            'dark:bg-dark-card-background-hover',
                                        ],
                                    )}
                                    onClick={() => {
                                        setCollectionAddress((prev) =>
                                            prev === collection.address ? null : collection.address,
                                        )
                                    }}
                                >
                                    <Image
                                        src={collection.image}
                                        className={clsx('w-8', 'h-8', 'rounded-full', 'object-cover')}
                                    />
                                    <Flex flexDirection="column" fullWidth flex={1}>
                                        <Typography>{collection.name}</Typography>
                                        <Flex alignItems="center" gap={1} className={clsx('text-left')}>
                                            <Coin number={collection.floor ?? ''} variant="sm" bold color="secondary" />
                                            <Typography variant="sm" className="font-light" color="secondary">
                                                {t('common:floor')}
                                            </Typography>
                                        </Flex>
                                    </Flex>
                                    <Flex justifyContent="end">
                                        <Typography variant="title" className={clsx('text-right')}>
                                            {collection.owned}
                                        </Typography>
                                    </Flex>
                                </Card>
                            ))}
                        </div>
                    </div>
                </Collapse>
            </Flex>
        </>
    )
}

const UserOwnedPageContent = () => {
    const { t } = useTranslation('user')
    const { nfts: ownedNfts, total, hasNextPage, fetchNextPage, nftsIsFetching } = useUserPageFormContext()

    return (
        <ContentWrapper leftMemu={<FilterMenu />} className="pt-6">
            <InfiniteScroll
                pageStart={0}
                loadMore={() => {
                    if (hasNextPage && !nftsIsFetching) {
                        fetchNextPage()
                    }
                }}
                hasMore={hasNextPage}
            >
                <CollectionWrapper>
                    {(ownedNfts ?? []).map((nft, index) => (
                        <NFTCard key={index} nft={nft} className={'w-[var(--column-width)]'} orderbook={nft?.order} />
                    ))}
                    {nftsIsFetching &&
                        Array.from({ length: 12 }).map((_, index) => (
                            <NFTCard key={index} nft={null} className={'w-[var(--column-width)]'} />
                        ))}
                    {total !== null && total === 0 && !nftsIsFetching ? (
                        <Flex fullWidth justifyContent="center" alignItems="center" className={'pt-10'}>
                            <Typography variant="lg">{t('common:empty.noData')}</Typography>
                        </Flex>
                    ) : null}
                </CollectionWrapper>
            </InfiniteScroll>
        </ContentWrapper>
    )
}

export const UserOwnedPage = () => {
    const { user } = useUserPageContext()
    return (
        <UserPageFormContextProvider user={user}>
            <UserOwnedPageContent />
        </UserPageFormContextProvider>
    )
}
