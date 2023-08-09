import clsx from 'clsx'
import { Flex, FlexProps, IconType, LinkIcon } from '~/components'
import { AddressSelect } from '~/components/AddressSelect'

export interface SocialButtonsProps extends FlexProps {
    website?: string
    discord?: string
    twitter?: string
    zealySubdomain?: string
    title?: string
    address?: string
}

export const SocialButtons = ({
    website,
    discord,
    twitter,
    zealySubdomain,
    address,
    title,
    gap = 4,
    ...props
}: SocialButtonsProps) => {
    return (
        <Flex gap={gap} {...props}>
            {address && title && <AddressSelect title={title} address={address} className={clsx('max-md:hidden')} />}
            {website && (
                <LinkIcon
                    icon={IconType.website}
                    url={website}
                    className={clsx('bg-[#14B8A6]', 'rounded')}
                    colorClassName={clsx('stroke-white')}
                />
            )}
            {discord && (
                <LinkIcon
                    icon={IconType.discord}
                    url={discord}
                    className={clsx('bg-[#5865F2]', 'rounded')}
                    colorClassName={clsx('fill-white')}
                />
            )}
            {twitter && (
                <LinkIcon
                    icon={IconType.twitter}
                    url={twitter}
                    className={clsx('bg-[#6FBCF0]', 'rounded')}
                    colorClassName={clsx('fill-white')}
                />
            )}
            {zealySubdomain && (
                <LinkIcon
                    className="overflow-hidden rounded p-0"
                    icon={IconType.crew3}
                    url={`https://crew3.xyz/c/${zealySubdomain}`}
                />
            )}
        </Flex>
    )
}
