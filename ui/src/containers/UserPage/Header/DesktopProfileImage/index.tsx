import clsx from 'clsx'
import { Flex } from '~/components'
import { User } from '~/gql/generated/graphql'
import { EditableProfileImage } from '../EditableProfileImage'

interface Props {
    user: User
    loading: boolean
    editable: boolean
}

export const DesktopProfileImage = ({ user, loading }: Props) => {
    return (
        <Flex
            alignItems="center"
            justifyContent="center"
            className={clsx('max-w-xs', 'min-w-[160px]', 'max-lg:hidden', 'mx-auto', 'relative', 'grow')}
        >
            <EditableProfileImage
                user={user}
                loading={loading}
                editable={false}
                className={clsx('max-w-[160px]', 'aspect-square', 'w-full', 'rounded-full')}
            />
        </Flex>
    )
}
