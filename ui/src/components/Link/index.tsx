import React from 'react'
import NextLink from 'next/link'
import { Typography } from '../Typography'
import clsx from 'clsx'
import { TextColor, TypographyVariant } from '../Typography/types'
import { Flex } from '../Flex'
import { Icon, IconType } from '../Icon'

interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
    title: string
    url?: string
    bold?: boolean
    color?: TextColor
    onClick?: () => void
    showIcon?: boolean
    font?: 'jbm' | 'sg' | 'ppm'
    variant?: TypographyVariant
    skeleton?: boolean
    skeletonLength?: number
}

export const Link = ({
    title,
    url,
    color = 'primary',
    onClick,
    showIcon = true,
    className,
    font = 'jbm',
    bold = false,
    variant,
    skeleton,
    skeletonLength,
    ...ref
}: Props) => {
    const isATag = url && url.startsWith('http')
    const content = (
        <Flex gap={2}>
            <Typography
                bold={bold}
                font={font}
                hover
                color={color}
                variant={variant}
                skeleton={skeleton}
                skeletonLength={skeletonLength}
            >
                {title}
            </Typography>
            {showIcon && <Icon icon={IconType.externalLink} className={clsx('w-4', 'h-4')} />}
        </Flex>
    )
    return isATag ? (
        <NextLink
            href={url}
            target="_blank"
            rel="noreferrer"
            className={clsx('flex', 'items-center', 'gap-2', className)}
            {...ref}
        >
            {content}
        </NextLink>
    ) : (
        <NextLink
            href={url ?? ''}
            onClick={onClick}
            className={clsx('flex', 'items-center', 'gap-2', className)}
            {...ref}
        >
            {content}
        </NextLink>
    )
}
