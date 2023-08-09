import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetServerSideProps, NextPage } from 'next'
import { Seo } from '~/components/Seo'
import { LaunchpadPageContent } from '~/containers/LaunchpadPage/Content'
import { LaunchpadPageHeader } from '~/containers/LaunchpadPage/Header'
import { Launchpad, useQueryLaunchpadQuery } from '~/gql/generated/graphql'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params } = context
    if (!params?.slug) {
        console.error('LaunchpadPage No slug provided')
        return {
            notFound: true,
        }
    }
    const queryClient = new QueryClient()
    const slug = params.slug as string
    try {
        const data = await queryClient.fetchQuery(
            useQueryLaunchpadQuery.getKey({ id: slug }),
            useQueryLaunchpadQuery.fetcher({ id: slug }),
        )
        if (data.launchpad === null) {
            console.error('LaunchpadPage No launchpad found')
            return {
                notFound: true,
            }
        }

        return {
            props: {
                launchpad: data.launchpad,
                dehydratedState: dehydrate(queryClient),
                seo: {
                    title: data.launchpad?.name,
                    description: data.launchpad?.name,
                    image: data.launchpad?.imageUrl,
                    page: 'Launchpad',
                },
            },
        }
    } catch (error) {
        console.error('LaunchpadPage Error', error)
        return {
            notFound: true,
        }
    }
}
interface IProps {
    launchpad: Launchpad
}

const LaunchpadPage: NextPage<IProps> = ({ launchpad }: IProps) => {
    return (
        <>
            <Seo seo={{ title: launchpad.name }} />
            <LaunchpadPageHeader launchpad={launchpad} />
            <LaunchpadPageContent launchpad={launchpad} />
        </>
    )
}

export default LaunchpadPage
