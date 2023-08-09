import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { UserContent } from '~/containers/UserPage/Content'
import { UserPageContextProvider } from '~/containers/UserPage/context'
import { UserHeader } from '~/containers/UserPage/Header'
import { useGetUserQuery, User } from '~/gql/generated/graphql'
import { useAuthState } from '~/contexts/auth'

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking', //indicates the type of fallback
    }
}
export const getStaticProps: GetStaticProps = async (context) => {
    const { params } = context
    if (!params?.keyword) {
        return {
            notFound: true,
        }
    }
    const queryClient = new QueryClient()
    const keyword = params.keyword as string

    const data = await queryClient.fetchQuery(
        useGetUserQuery.getKey({ address: keyword }),
        useGetUserQuery.fetcher({ address: keyword }),
    )

    if (data.user === null) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            address: data.user?.address,
            user: data.user,
            dehydratedState: dehydrate(queryClient),
            seo: {
                title: data.user?.name,
                description: data.user?.address,
                image: data.user?.profileUrl,
                page: 'User',
            },
        },
        revalidate: 1,
    }
}
interface IProps {
    address: string
    user: User
    seo: {
        title?: string
        description?: string
    }
}

const UserPage = ({ user }: IProps) => {
    const { user: self } = useAuthState()
    const [mounted, setMounted] = useState(false)
    const { replace } = useRouter()

    useEffect(() => {
        setMounted(true)
        if (!user) {
            replace('/')
        }

        if (user && self && user.address === self.address) {
            replace('/profile')
        }
    }, [user])

    return (
        mounted &&
        user && (
            <UserPageContextProvider user={user}>
                <UserHeader />
                <UserContent />
            </UserPageContextProvider>
        )
    )
}

export default UserPage
