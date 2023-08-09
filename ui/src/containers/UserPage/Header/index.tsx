import { Container } from '~/components'
import clsx from 'clsx'
import { MobileProfileImage } from './MobileProfileImage'
import { DesktopProfileImage } from './DesktopProfileImage'
import { UserDetail } from './UserDetail'
import { useUserPageContext } from '../context'

export const UserHeader = ({
    loading = false,
    editable = false,
}: {
    loading?: boolean
    editable?: boolean
}): React.ReactElement => {
    const { user } = useUserPageContext()
    const light =
        user?.coverUrl && `linear-gradient(0deg, #FFFFFF 48.96%, rgba(255, 255, 255, 0.8) 100%), url(${user?.coverUrl})`
    const dark =
        user?.coverUrl && `linear-gradient(0deg, #131525 44.27%, rgba(19, 21, 37, 0.8) 100%), url(${user?.coverUrl})`

    const style = {
        ...(light && { '--collection-header-bg': light }),
        ...(dark && { '--collection-header-bg-dark': dark }),
        ...(user?.coverUrl && { '--collection-header-bg-lg': `url(${user?.coverUrl})` }),
    } as React.CSSProperties

    return (
        <div
            className={clsx(
                'lg:py-16',
                'lg:bg-cover',
                'relative',
                'w-full',
                'lg:bg-[image:var(--collection-header-bg)]',
                'dark:lg:bg-[image:var(--collection-header-bg-dark)]',
                'bg-cover',
                'max-lg:mb-10',
            )}
            style={style}
        >
            <MobileProfileImage user={user} loading={loading} editable={editable} />
            <Container gap={10} className={clsx('mx-auto', 'max-lg:flex-col', '2xl:gap-[40px]')}>
                <DesktopProfileImage user={user} loading={loading} editable={editable} />
                <UserDetail loading={loading} editable={editable} />
            </Container>
        </div>
    )
}
