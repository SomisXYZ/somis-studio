import clsx from 'clsx'
import { Flex, Typography } from '~/components'
import { User } from '~/gql/generated/graphql'

interface Props {
    user: User
    loading: boolean
}

export const UserName = ({ user, loading }: Props) => {
    return (
        <Flex className={clsx('relative', 'max-lg:w-full')} gap={2}>
            <Typography
                variant="h1"
                bold
                font="ppm"
                textStyle={'text-heading-3'}
                className={clsx('opacity-100', 'max-w-[75%]', 'overflow-hidden', 'whitespace-nowrap', 'text-ellipsis')}
                skeleton={loading}
            >
                {user?.name}
            </Typography>
        </Flex>
    )
}
