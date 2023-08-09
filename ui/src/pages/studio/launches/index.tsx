import authContext from '~/contexts/auth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Card, Coin, Flex, Image, Typography } from '~/components'
import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { StudioContainer } from '~/containers/Studio/Container'
import { getLaunchpadsInfo } from '~/services/blockChain'
import { Launchpad, useInfiniteListLaunchpadsQuery } from '~/gql/generated/graphql'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export async function getStaticProps() {
    return {
        props: {
            seo: {
                title: 'Somis Studio',
            },
        },
    }
}

const StudioPage = () => {
    const { user } = authContext.useAuthState()
    const router = useRouter()
    const { t } = useTranslation('studio')

    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user])

    const limit = 20
    const { ref, inView } = useInView()
    const [total, setTotal] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [items, setItems] = useState<
        | {
              launchpad: Launchpad
              mintInfo?: {
                  remain: number
                  total: number
                  sold: number
              }
          }[]
        | null
    >(null)
    const { data, fetchNextPage, isFetching, remove } = useInfiniteListLaunchpadsQuery(
        'skip',
        {
            limit: limit,
            skip: 0,
            owner: user?.address,
        },
        {
            getNextPageParam: (_, pages) => {
                if (total && pages.length * limit >= total) {
                    return undefined
                }
                return pages.length * limit
            },
        },
    )

    useEffect(() => {
        if (inView && total && total > 0 && !isLoading) {
            fetchNextPage()
        }
    }, [inView, isFetching, total])

    useEffect(() => {
        const getFromBlockchain = async () => {
            setIsLoading(true)
            const lastPage = data?.pages.slice(-1)[0]
            if (lastPage?.launchpads?.totalItems !== undefined && lastPage?.launchpads?.totalItems !== null) {
                const launchpads = lastPage?.launchpads.items ? (lastPage?.launchpads.items as Launchpad[]) : []
                const cnaSyncLaunchpads = launchpads.filter((l) => l.listing && l.warehouse)
                const chainData = await getLaunchpadsInfo(cnaSyncLaunchpads)
                const launchpadsWithMintInfo = launchpads.map((l) => {
                    const mintInfo = chainData.find((d) => d.launchpad.id === l.id)
                    return {
                        launchpad: l,
                        mintInfo,
                    }
                })
                setItems([
                    ...(items ?? []),
                    ...launchpadsWithMintInfo.filter((l) => {
                        return !(items ?? []).find((i) => i.launchpad.id === l.launchpad.id)
                    }),
                ])

                setTotal(lastPage?.launchpads.totalItems ?? 0)
            }
            setIsLoading(false)
        }

        getFromBlockchain()
    }, [data])

    useEffect(() => {
        return () => {
            setItems(null)
            setTotal(null)
            remove()
        }
    }, [])

    return (
        <StudioContainer
            title={t('launches.title')}
            description={t('launches.description')}
            right={
                <Button title={t('launches.button.createLaunch')} to="/studio/launches/create" className="self-start" />
            }
        >
            <Flex fullWidth flexDirection="column" gap={4}>
                {/* <Flex fullWidth gap={4} alignItems="center">
                    <TextInput placeholder={t('launches.input.search')} />
                    <Flex className={clsx('relative')}>
                        <Button
                            variant="tertiary"
                            title={t('common:button.sort')}
                            icon={IconType.sort}
                            className={clsx('min-w-[140px]')}
                            iconSize="small"
                        />
                    </Flex>
                </Flex> */}
                {/* List */}
                <Flex fullWidth flexDirection="column" gap={4}>
                    {!!items && (
                        <>
                            {items?.map((item, index) => (
                                <Card key={index} fullWidth border gap={3}>
                                    <Flex
                                        gap={4}
                                        alignItems="center"
                                        className={clsx('flex-[72px]', 'max-lg:flex-[48px]')}
                                    >
                                        <Image
                                            src={item.launchpad.logoUrl}
                                            className={clsx('w-[56px]', 'max-lg:w-[32px]', 'aspect-square')}
                                        />
                                    </Flex>
                                    <Flex
                                        gap={4}
                                        alignItems="center"
                                        className={clsx(
                                            'flex-[1_1_25%]',
                                            'max-lg:flex-[1_1_30%]',
                                            'max-md:flex-[1_1_70%]',
                                        )}
                                    >
                                        <Link href={`/launchpad/${item.launchpad.id}`}>
                                            <Typography
                                                variant="h4"
                                                bold
                                                font="jbm"
                                                className={clsx('max-lg:text-sm')}
                                                hover
                                            >
                                                {item.launchpad.name}
                                            </Typography>
                                        </Link>
                                    </Flex>
                                    <Flex
                                        alignItems="end"
                                        justifyContent="center"
                                        flexDirection="column"
                                        gap={1}
                                        className={clsx('flex-[1_1_15%]', 'max-md:hidden')}
                                    >
                                        <Typography variant="h4" bold font="jbm" className={clsx('max-lg:text-sm')}>
                                            {'--'}
                                        </Typography>
                                        <Typography
                                            variant="sm"
                                            color="gray"
                                            bold
                                            align="right"
                                            className={clsx('max-lg:text-xs')}
                                        >
                                            {t('launches.collectionList.uniqueOwners')}
                                        </Typography>
                                    </Flex>
                                    <Flex
                                        alignItems="end"
                                        justifyContent="center"
                                        flexDirection="column"
                                        gap={1}
                                        className={clsx('flex-[1_1_15%]', 'max-md:hidden')}
                                    >
                                        <Typography variant="h4" bold font="jbm" className={clsx('max-lg:text-sm')}>
                                            {'--'}
                                        </Typography>
                                        <Typography
                                            variant="sm"
                                            color="gray"
                                            bold
                                            align="right"
                                            className={clsx('max-lg:text-xs')}
                                        >
                                            {t('launches.collectionList.percentSold')}
                                        </Typography>
                                    </Flex>
                                    <Flex
                                        alignItems="end"
                                        justifyContent="center"
                                        flexDirection="column"
                                        gap={1}
                                        className={clsx('flex-[1_1_15%]', 'max-md:hidden')}
                                    >
                                        <Coin
                                            number={item.mintInfo?.sold ?? '--'}
                                            variant="h4"
                                            bold
                                            font="jbm"
                                            className={clsx('max-lg:text-sm')}
                                        />
                                        <Typography
                                            variant="sm"
                                            color="gray"
                                            bold
                                            align="right"
                                            className={clsx('max-lg:text-xs')}
                                        >
                                            {t('launches.collectionList.totalSales')}
                                        </Typography>
                                    </Flex>
                                    <Flex
                                        alignItems="end"
                                        justifyContent="center"
                                        flexDirection="column"
                                        gap={2}
                                        className={clsx('flex-[1_1_15%]')}
                                    >
                                        <Button
                                            title={t(
                                                item.mintInfo?.total && item.mintInfo?.total > 0
                                                    ? 'launches.button.manage'
                                                    : 'launches.button.continue',
                                            )}
                                            variant="tertiary"
                                            onClick={() => {
                                                if (item.mintInfo?.total && item.mintInfo?.total > 0) {
                                                    router.push(`/studio/launches/${item.launchpad.id}`)
                                                } else {
                                                    router.push(`/studio/launches/create/type/${item.launchpad.id}`)
                                                }
                                            }}
                                        />
                                    </Flex>
                                    {index === items.length - 1 && (
                                        <div className="absolute h-[0px] w-[0px]" ref={ref} />
                                    )}
                                </Card>
                            ))}
                        </>
                    )}
                    {total === 0 && (
                        <Typography
                            variant="title"
                            transform="uppercase"
                            className="m-auto flex min-h-[75px] items-center justify-center"
                        >
                            {t('common:empty.noLaunchpads')}
                        </Typography>
                    )}
                    {(isLoading || total === null) && (
                        <>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <Card key={index} fullWidth border gap={3}>
                                    <Flex
                                        gap={4}
                                        alignItems="center"
                                        className={clsx('flex-[72px]', 'max-lg:flex-[48px]')}
                                    >
                                        <Image
                                            skeleton
                                            className={clsx('w-[56px]', 'max-lg:w-[32px]', 'aspect-square')}
                                        />
                                    </Flex>
                                    <Flex
                                        gap={4}
                                        alignItems="center"
                                        className={clsx(
                                            'flex-[1_1_25%]',
                                            'max-lg:flex-[1_1_30%]',
                                            'max-md:flex-[1_1_70%]',
                                        )}
                                    >
                                        <Typography
                                            variant="h4"
                                            bold
                                            font="jbm"
                                            className={clsx('max-lg:text-sm')}
                                            skeleton
                                        >
                                            {''}
                                        </Typography>
                                    </Flex>
                                    <Flex
                                        alignItems="end"
                                        justifyContent="center"
                                        flexDirection="column"
                                        gap={1}
                                        className={clsx('flex-[1_1_20%]', 'max-sm:hidden')}
                                    >
                                        <Typography
                                            variant="h4"
                                            bold
                                            font="jbm"
                                            align="right"
                                            className={clsx('max-lg:text-sm')}
                                            skeleton
                                        >
                                            {'--'}
                                        </Typography>
                                    </Flex>
                                    <Flex
                                        alignItems="end"
                                        justifyContent="center"
                                        flexDirection="column"
                                        gap={1}
                                        className={clsx('flex-[1_1_15%]', 'max-md:hidden')}
                                    >
                                        <Typography
                                            variant="h4"
                                            bold
                                            font="jbm"
                                            className={clsx('max-lg:text-sm')}
                                            skeleton
                                        >
                                            {'--'}
                                        </Typography>
                                        <Typography
                                            variant="sm"
                                            color="gray"
                                            bold
                                            align="right"
                                            className={clsx('max-lg:text-xs')}
                                        >
                                            {t('launches.collectionList.uniqueOwners')}
                                        </Typography>
                                    </Flex>
                                    <Flex
                                        alignItems="end"
                                        justifyContent="center"
                                        flexDirection="column"
                                        gap={1}
                                        className={clsx('flex-[1_1_15%]', 'max-md:hidden')}
                                    >
                                        <Typography
                                            variant="h4"
                                            bold
                                            font="jbm"
                                            className={clsx('max-lg:text-sm')}
                                            skeleton
                                        >
                                            {'--'}
                                        </Typography>
                                        <Typography
                                            variant="sm"
                                            color="gray"
                                            bold
                                            align="right"
                                            className={clsx('max-lg:text-xs')}
                                        >
                                            {t('launches.collectionList.percentSold')}
                                        </Typography>
                                    </Flex>
                                    <Flex
                                        alignItems="end"
                                        justifyContent="center"
                                        flexDirection="column"
                                        gap={1}
                                        className={clsx('flex-[1_1_15%]', 'max-md:hidden')}
                                    >
                                        <Coin
                                            number={'--'}
                                            skeleton
                                            variant="h4"
                                            bold
                                            font="jbm"
                                            className={clsx('max-lg:text-sm')}
                                        />
                                        <Typography
                                            variant="sm"
                                            color="gray"
                                            bold
                                            align="right"
                                            className={clsx('max-lg:text-xs')}
                                        >
                                            {t('launches.collectionList.totalSales')}
                                        </Typography>
                                    </Flex>
                                    <Flex
                                        alignItems="end"
                                        justifyContent="center"
                                        flexDirection="column"
                                        gap={2}
                                        className={clsx('flex-[1_1_15%]')}
                                    ></Flex>
                                </Card>
                            ))}
                        </>
                    )}
                </Flex>
            </Flex>
        </StudioContainer>
    )
}

export default StudioPage
