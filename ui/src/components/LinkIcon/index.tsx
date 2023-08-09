import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { Icon, IconType } from '../Icon'

interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
    icon: IconType
    iconClassName?: string
    colorClassName?: string
    url?: string
    size?: 'small' | 'medium' | 'large'
    target?: '_blank' | '_self' | '_parent' | '_top'
    onClick?: () => void
}

export const LinkIcon = ({
    icon,
    url,
    onClick,
    className,
    iconClassName,
    colorClassName,
    target,
}: Props): React.ReactElement => {
    const sizeClass = {
        small: 'w-[24px] h-[24px]',
        medium: 'w-[42px] h-[42px]',
        large: 'w-[64px] h-[64px]',
    }
    return url ? (
        <Link
            href={url}
            target={target}
            className={clsx(sizeClass, 'align-center', 'justify-center', 'flex', 'p-2', 'cursor-pointer', className)}
        >
            <Icon icon={icon} className={iconClassName} colorClass={colorClassName} />
        </Link>
    ) : (
        <div
            className={clsx(sizeClass, 'align-center', 'justify-center', 'flex', 'p-2', 'cursor-pointer', className)}
            onClick={onClick}
        >
            <Icon icon={icon} className={iconClassName} colorClass={colorClassName} />
        </div>
    )
}
