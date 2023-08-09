import clsx from 'clsx'
import React, { ReactElement } from 'react'
import { Flex, FlexProps } from '../Flex'

interface Props extends FlexProps {
    hover?: boolean
    padding?: boolean
    border?: boolean
    name?: string
    variant?: 'primary' | 'secondary'
}

export const Card = React.memo(
    ({
        className,
        children,
        onClick,
        border = false,
        padding = true,
        gap = 4,
        name,
        hover = false,
        variant = 'primary',
        ...ref
    }: Props): ReactElement => {
        const variantClass = () => {
            switch (variant) {
                case 'secondary':
                    return 'bg-light-background-hover dark:bg-dark-card-background-hover'
                case 'primary':
                default:
                    return 'bg-light-card-background dark:bg-dark-card-background'
            }
        }
        return (
            <Flex
                gap={gap}
                className={clsx(
                    name && `card-${name}`,
                    padding && ['pl-5', 'pr-6', 'py-6'],
                    'rounded-md',
                    variantClass(),
                    className,
                    hover && [
                        'group',
                        variant === 'primary'
                            ? ['hover:bg-light-background-hover', 'dark:hover:bg-dark-card-background-hover']
                            : ['hover:bg-light-input-border', 'dark:hover:bg-dark-input-border'],

                        'ease-in-out',
                    ],
                    border && ['border', 'border-light-card-border', 'dark:border-dark-card-border'],
                )}
                onClick={onClick}
                {...ref}
            >
                {children}
            </Flex>
        )
    },
)

Card.displayName = 'Card'
