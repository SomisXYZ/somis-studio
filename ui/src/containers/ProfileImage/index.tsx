import { toSvg } from 'jdenticon'
import { Image, ImageProps } from '~/components'
import { User } from '~/gql/generated/graphql'

export interface ProfileImageProps extends Omit<ImageProps, 'src' | 'alt'> {
    user: User
}

export const ProfileImage = ({ user, className = 'h-10 w-10 rounded-full', skeleton, ...props }: ProfileImageProps) => {
    const emptyImage = 'data:image/svg+xml;base64,' + Buffer.from(toSvg(user?.address, 100)).toString('base64')
    if (!user) return <></>

    return (
        <Image
            src={user.profileUrl ?? emptyImage}
            alt={user.name}
            className={className}
            skeleton={skeleton === undefined ? !user.profileUrl && !emptyImage : skeleton}
            {...props}
        />
    )
}
