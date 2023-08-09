import clsx from 'clsx'
import { Container, Image } from '~/components'
import { User } from '~/gql/generated/graphql'
import { EditableProfileImage } from '../EditableProfileImage'

interface Props {
    user: User
    loading: boolean
    editable: boolean
}

export const MobileProfileImage = ({ user, loading }: Props) => {
    return (
        <div className={clsx('lg:hidden', !user?.coverUrl && 'mt-6')}>
            {user?.coverUrl && (
                <Image
                    src={user?.coverUrl}
                    alt={user?.name}
                    className={clsx('aspect-3/1', 'md:aspect-5/1')}
                    skeleton={loading}
                />
            )}
            <Container
                overflow="inherit"
                flexDirection="column"
                justifyContent="start"
                alignItems="start"
                className={clsx('mb-4')}
            >
                <EditableProfileImage
                    user={user}
                    loading={loading}
                    editable={false}
                    className={clsx(
                        'w-[120px]',
                        'h-[120px]',
                        'md:w-[150px]',
                        'md:h-[150px]',
                        'rounded-full',
                        'border-0',
                        'border-light-background',
                        'dark:border-dark-background',
                    )}
                />
                {/* <Flex gap={2} alignItems="end" justifyContent="center" className={clsx('w-full', 'mt-3', 'mb-9')}>
                    <LinkIcon icon={IconType.website} url={''} />
                    <LinkIcon icon={IconType.discord} url={''} />
                    <LinkIcon icon={IconType.twitter} url={''} />
                </Flex> */}
            </Container>
        </div>
    )
}
