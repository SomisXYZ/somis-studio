import authContext from '~/contexts/auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Button, Card, Flex, Typography } from '~/components'
import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { StudioContainer } from '~/containers/Studio/Container'
import { GetServerSideProps } from 'next'
import { QueryClient } from '@tanstack/react-query'
import { Launchpad, useQueryLaunchpadQuery } from '~/gql/generated/graphql'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params } = context
    const id = params?.id as string
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
        },
    }
}

const StudioCreateTypePage = ({ launchpad }: { launchpad: Launchpad }) => {
    const { user } = authContext.useAuthState()
    const router = useRouter()
    const { t } = useTranslation('studio')
    useEffect(() => {
        if (!user || !launchpad) {
            router.push('/')
        }
        if (launchpad?.launchDate) {
            router.push(`/studio/launches/`)
        }
    }, [user, launchpad])

    return (
        <StudioContainer title={t('create.title')} description={t('create.description')}>
            <Flex fullWidth gap={8} className={clsx('max-lg:flex-col', 'max-lg:gap-12')}>
                <Card justifyContent="between" fullWidth flexDirection="column" gap={6} border className="px-10 py-10">
                    <Flex flexDirection="column" gap={6}>
                        <Typography variant="xl" font="jbm" bold className={clsx('whitespace-pre-wrap')}>
                            {t('create.fixedCollection')}
                        </Typography>
                        <Typography color="gray">{t('create.fixedCollectionDescription')}</Typography>
                    </Flex>
                    <Button
                        className={clsx('max-w-[200px]')}
                        variant="primary"
                        title={t('create.button.createCollection')}
                        to={`/studio/launches/create/fixed/${launchpad.id}`}
                    />
                </Card>
                <Card fullWidth flexDirection="column" border gap={6} className="px-10 py-10">
                    <Typography variant="xl" font="jbm" bold className={clsx('whitespace-pre-wrap')}>
                        {t('create.generativeCollection')}
                    </Typography>
                    <Typography color="gray">{t('create.generativeCollectionDescription')}</Typography>
                    <Button
                        variant="primary"
                        className={clsx('max-w-[200px]')}
                        title={t('create.button.createCollection')}
                        to={`/studio/launches/create/generative/${launchpad.id}`}
                    />
                </Card>
            </Flex>
        </StudioContainer>
    )
}

export default StudioCreateTypePage
