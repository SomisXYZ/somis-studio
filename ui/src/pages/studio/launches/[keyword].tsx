import { QueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'

import { Container, Flex, Icon, IconType, Image, Typography } from '~/components'

import { Launchpad, useQueryLaunchpadQuery } from '~/gql/generated/graphql'

import { FeatureWrapper } from '~/containers/FeatureWrapper'
import { Tab } from '~/components/Tabs'
import StudioDetailMetadataSection from '~/containers/Studio/DetailPage/MetadataSection'
import StudioDetailCollectionSection from '~/containers/Studio/DetailPage/CollectionSection'
import { useRouter } from 'next/router'
import { StudioDetailItemSection } from '~/containers/Studio/DetailPage/ItemsSection'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params } = context
    const id = params?.keyword as string
    if (!id) {
        return {
            notFound: true,
        }
    }

    const query = new QueryClient()
    const res = await query.fetchQuery(useQueryLaunchpadQuery.getKey({ id }), useQueryLaunchpadQuery.fetcher({ id }))
    const launchpad = res.launchpad

    if (!launchpad) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            launchpad,
            seo: {
                title: launchpad.name,
                description: launchpad.name,
                image: launchpad.imageUrl,
                page: 'Launchpad Studio',
            },
        },
    }
}

export const StudioLaunchDetailPage = ({ launchpad }: { launchpad: Launchpad }) => {
    const { t } = useTranslation('studio')
    const router = useRouter()

    const tabs = [
        {
            title: (
                <Flex justifyContent="start" className="items-center" gap={2}>
                    <Icon icon={IconType.sitemap} className={clsx('scale-[85%]')} />
                    <Typography variant="title" transform="uppercase">
                        {t('studioDetail.tabs.collection')}
                    </Typography>
                </Flex>
            ),
            content: <StudioDetailCollectionSection launchpad={launchpad} />,
        },
        {
            title: (
                <Flex justifyContent="start" className="items-center" gap={2}>
                    <Icon icon={IconType.grid} className={clsx('scale-[85%]')} />
                    <Typography variant="title" transform="uppercase">
                        {t('studioDetail.tabs.items')}
                    </Typography>
                </Flex>
            ),
            content: <StudioDetailItemSection launchpad={launchpad} />,
        },
        {
            title: (
                <Flex justifyContent="start" className="items-center" gap={2}>
                    <Icon icon={IconType.magic} className={clsx('scale-[85%]')} />
                    <Typography variant="title" transform="uppercase">
                        {t('studioDetail.tabs.hatching')}
                    </Typography>
                </Flex>
            ),
            content: <StudioDetailMetadataSection launchpad={launchpad} />,
        },
    ]

    return (
        launchpad && (
            <FeatureWrapper feature="studio" redirect>
                <Container
                    flexDirection="column"
                    gap={4}
                    isFullWidth={false}
                    overflow="visible"
                    className={clsx('pt-12', 'pb-[250px]', 'relative', 'min-h-[1229px]')}
                >
                    <Flex gap={4} flexDirection="row">
                        <Flex flexDirection="row">
                            <Image src={launchpad.logoUrl} className="h-[65px] w-[65px]" alt={launchpad.name} />
                        </Flex>
                        <Flex flexDirection="column" justifyContent="between">
                            <Typography font="jbm" variant="md" color="secondary" transform="uppercase">
                                {'Collection'}
                            </Typography>
                            <Typography
                                variant="h3"
                                component="h1"
                                className="cursor-pointer"
                                onClick={() => {
                                    router.push(`/launchpad/${launchpad.id}`)
                                }}
                            >
                                {launchpad.name}
                            </Typography>
                        </Flex>
                    </Flex>
                    <Tab tabs={tabs} />
                </Container>
            </FeatureWrapper>
        )
    )
}

export default StudioLaunchDetailPage
