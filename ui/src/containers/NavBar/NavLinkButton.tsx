import clsx from 'clsx'
import Link from 'next/link'
import { Flex, Typography } from '~/components'
import { Icon, IconType } from '~/components/Icon'

interface Props {
    icon: IconType
    name: string
    to: string
    onClick?: () => void
}

export const NavLinkButton = ({ icon, name, to, onClick }: Props) => {
    return (
        <Link
            href={to}
            className={clsx(
                'group',
                'transition-colors',
                'duration-300',
                'cursor-pointer',
                'p-3',
                'rounded-md',
                'overflow-hidden',
                'dark:hover:bg-button-tertiary-dark-background hover:bg-button-tertiary-background',
            )}
            onClick={onClick}
        >
            <Flex gap={11} alignItems="center">
                <Icon icon={icon} showHoverColor />
                <Typography variant="b4" color="default" font="jbm" bold hover>
                    {name}
                </Typography>
                <div className="grow"></div>
                <Icon icon={IconType.arrowRight} showHoverColor />
            </Flex>
        </Link>
    )
}
