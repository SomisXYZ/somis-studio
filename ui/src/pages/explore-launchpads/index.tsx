import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Container, Flex, Typography } from '~/components'
import { Launchpad, useInfiniteListLaunchpadsQuery } from '~/gql/generated/graphql'
import useTranslation from 'next-translate/useTranslation'
import { LaunchpadCard } from '~/containers/LandingPage/LaunchpadCard'
import { FeatureWrapper } from '~/containers/FeatureWrapper'
import { Seo } from '~/components/Seo'
import { getLaunchpadsInfo } from '~/services/blockChain'

export async function getStaticProps() {
    return {
        props: {
            seo: {
                title: 'Launchpads',
            },
        },
    }
}

export const exploreLaunchpadsPage = () => {
    const { t } = useTranslation('launchpad')
    const limit = 20
    const { ref, inView } = useInView()
    const [total, setTotal] = useState<number | null>(null)
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
    const { data, fetchNextPage, isFetching, isLoading } = useInfiniteListLaunchpadsQuery(
        'skip',
        {
            limit: limit,
            skip: 0,
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
        if (inView && total && !isFetching) {
            fetchNextPage()
        }
    }, [inView, isFetching, total])

    useEffect(() => {
        const getFromBlockchain = async () => {
            const lastPage = data?.pages.slice(-1)[0]
            if (lastPage?.launchpads?.totalItems !== undefined && lastPage?.launchpads?.totalItems !== null) {
                setTotal(lastPage?.launchpads?.totalItems)

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
            }
        }

        getFromBlockchain()
    }, [data])
    return (
        <>
            <Seo
                seo={{
                    title: t('exploreLaunchpads.title'),
                }}
            />
            <FeatureWrapper feature="launchpads" redirect>
                <Container
                    backgroundBlur
                    isFullWidth={false}
                    gap={16}
                    flexDirection="column"
                    className="py-8 lg:py-16"
                    overflow="inherit"
                >
                    {/* Header */}
                    <Flex flexDirection="column" gap={8}>
                        <Flex flexDirection="row" justifyContent="center">
                            <Typography variant="h1" textStyle="text-heading-2" font="ppm" color="gradient">
                                {t('exploreLaunchpads.title')}
                            </Typography>
                        </Flex>
                    </Flex>
                    {/* Body Table */}
                    <div className="overflow-hidden">
                        {items !== null && items.length === 0 ? (
                            <>
                                <Typography
                                    variant="h4"
                                    transform="uppercase"
                                    className="m-auto flex min-h-[75px] items-center justify-center"
                                >
                                    {t('common:empty.noLaunchpads')}
                                </Typography>
                            </>
                        ) : (
                            <>
                                <div
                                    className={clsx(
                                        'grid',
                                        'grid-cols-1',
                                        'md:grid-cols-2',
                                        'lg:grid-cols-3',
                                        'xl:grid-cols-4',
                                        '2xl:grid-cols-4',
                                        'gap-x-6',
                                        'gap-y-8',
                                        'w-full',
                                    )}
                                >
                                    {items &&
                                        items.map((launchpad, key) => (
                                            <LaunchpadCard
                                                key={key}
                                                launchpad={launchpad.launchpad}
                                                mintInfo={launchpad.mintInfo}
                                                loading={false}
                                            />
                                        ))}
                                </div>
                                <div className="" ref={ref} />
                            </>
                        )}
                        {(isLoading || items === null) && (
                            <div
                                className={clsx(
                                    'grid',
                                    'grid-cols-1',
                                    'md:grid-cols-2',
                                    'lg:grid-cols-3',
                                    'xl:grid-cols-4',
                                    '2xl:grid-cols-4',
                                    'gap-x-6',
                                    'gap-y-8',
                                    'w-full',
                                )}
                            >
                                {[...Array(8)].map((_, key) => (
                                    <LaunchpadCard key={key} loading={true} />
                                ))}
                            </div>
                        )}
                    </div>
                </Container>
            </FeatureWrapper>
        </>
    )
}

export default exploreLaunchpadsPage
