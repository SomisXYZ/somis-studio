import clsx from 'clsx'
import Link from 'next/link'
import { ButtonHTMLAttributes, FC, MouseEvent } from 'react'
import { CSSTransition } from 'react-transition-group'
import { Flex } from '../Flex'
import { Icon, IconType } from '../Icon'
import { Spinner } from '../Spinner'
import { JetBrainsMono, SpaceGrotesk } from '../Typography/fonts'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'title'> {
    title?: string | JSX.Element
    to?: string
    icon?: IconType
    iconColorClass?: string | string[]
    iconSize?: 'small' | 'medium' | 'large'
    flexDirection?: 'row' | 'column'
    variant?:
        | 'primary'
        | 'secondary'
        | 'default'
        | 'grouped'
        | 'tertiary'
        | 'outlined-gradient'
        | 'full-gradient'
        | 'outlined'
        | 'custom'
    onClick?: (e: MouseEvent) => void
    loading?: boolean
    spinnerSize?: 'small' | 'medium' | 'large'
}

export const Button: FC<ButtonProps> = ({
    title,
    className,
    variant = 'primary',
    icon,
    disabled = false,
    to,
    iconColorClass,
    iconSize = 'medium',
    onClick,
    loading = false,
    spinnerSize = 'medium',
    children,
    flexDirection = 'row',
    ...ref
}: ButtonProps) => {
    const sizeClass = [
        // Small & Medium
        'px-min-6',
        'py-3',
    ]

    const variantClass = (variant: string) => {
        switch (variant) {
            case 'primary':
                return [
                    'bg-button-primary-background',
                    'border-button-primary-border',
                    'text-button-primary-text',
                    'hover:bg-button-primary-hover',
                    'hover:text-button-primary-text-hover',
                ]
            case 'secondary':
                return [
                    'bg-button-secondary-background',
                    'border-button-secondary-border',
                    'text-button-secondary-text',
                    'hover:bg-button-secondary-hover',
                    'hover:text-button-secondary-text-hover',
                ]
            case 'tertiary':
                return [
                    'bg-button-tertiary-background',
                    'border-button-tertiary-border',
                    'text-button-tertiary-text',
                    'hover:bg-button-tertiary-hover',
                    'hover:text-button-tertiary-text-hover',
                ]
            case 'grouped':
                return ['border-none']
            case 'outlined-gradient':
                return [
                    'text-light',
                    'dark:text-dark',
                    'border-[3px]',
                    'color-border-gradient',
                    'hover:color-gradient',
                    'min-w-[150px]',
                ]
            case 'full-gradient':
                return ['color-text-reverse', 'color-gradient', 'border-none']
            case 'outlined':
                return [
                    'bg-light-background',
                    'dark:bg-dark-background',
                    'border',
                    'rounded-sm',
                    'border-light-input-border',
                    'dark:border-dark-input-border',
                    'text-light',
                    'dark:text-dark',
                    'hover:bg-button-primary-background',
                    'hover:text-button-primary-text',
                    'dark:hover:bg-button-primary-background',
                    'dark:hover:text-button-primary-text',
                ]
            case 'custom':
                return []
            default:
                return [
                    'bg-button-default-background',
                    'border-button-default-border',
                    'text-button-default-text',
                    'hover:bg-button-default-hover',
                    'hover:text-button-default-text-hover',
                ]
        }
    }

    const iconColorClassName = (variant: string) => {
        switch (variant) {
            case 'primary':
                return ['fill-button-primary-text', 'hover:fill-button-primary-text-hover']
            case 'secondary':
                return ['fill-button-secondary-text', 'hover:fill-button-secondary-text-hover']
            case 'tertiary':
                return ['fill-button-tertiary-text', 'hover:fill-button-tertiary-text']
            case 'outlined':
                return ['fill-light', 'dark:fill-dark']
            case 'grouped':
                return ['border-none']
            default:
                return ['fill-button-default-text', 'hover:fill-button-default-text-hover']
        }
    }

    const buttonContent = (
        <div className={clsx('relative')}>
            {children && !title ? (
                children
            ) : (
                <>
                    <Flex
                        gap={3}
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center"
                        className={clsx(loading && 'opacity-0', 'transition-opacity')}
                        flexDirection={flexDirection}
                    >
                        {icon && (
                            <Icon
                                icon={icon}
                                beforeInjection={(svg) => {
                                    const width = iconSize === 'small' ? 14 : iconSize === 'medium' ? 20 : 24
                                    const height = iconSize === 'small' ? 14 : iconSize === 'medium' ? 20 : 24
                                    svg.setAttribute('width', `${width}`)
                                    svg.setAttribute('height', `${height}`)
                                }}
                                colorClass={iconColorClass ?? iconColorClassName(variant)}
                            />
                        )}
                        {title}
                    </Flex>
                    <CSSTransition
                        in={loading}
                        timeout={300}
                        classNames="transition-opacity"
                        unmountOnExit
                        appear
                        mountOnEnter
                        onEnter={(node: HTMLElement) => {
                            node.style.opacity = '0'
                        }}
                        onEntered={(node: HTMLElement) => {
                            node.style.opacity = '1'
                        }}
                        onExit={(node) => {
                            node.style.opacity = '0'
                        }}
                        onExited={(node) => {
                            node.style.opacity = '1'
                        }}
                    >
                        <Flex
                            justifyContent="center"
                            alignContent="center"
                            alignItems="center"
                            className={clsx(
                                'absolute',
                                'top-0',
                                'bottom-0',
                                'left-2',
                                'right-0',
                                'm-auto',
                                'opacity-0',
                            )}
                        >
                            <Spinner size={spinnerSize} />
                        </Flex>
                    </CSSTransition>
                </>
            )}
        </div>
    )

    const button = (
        <button
            className={clsx(
                'rounded',
                !['outlined-gradient', 'custom'].includes(variant) && 'border',
                'hover:transition-colors',
                'font-bold',
                'text-body-md',
                'group',
                variantClass(variant),
                variant === 'full-gradient' ? SpaceGrotesk.className : JetBrainsMono.className,
                sizeClass,
                className,
                disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer',
                disabled || loading
                    ? 'opacity-50 hover:opacity-50 dark:opacity-50 dark:hover:opacity-50'
                    : 'opacity-100',
                (disabled || loading) && variant === 'full-gradient' ? 'disabled-color-gradient' : '',
            )}
            disabled={disabled || loading}
            onClick={(e) => {
                onClick && onClick(e)
            }}
            {...ref}
        >
            {buttonContent}
        </button>
    )

    const LinkButton = (url: string) => (
        <Link
            href={url}
            className={clsx(
                'rounded',
                variant !== 'outlined-gradient' && 'border',
                'transition-colors',
                'duration-300',
                variant === 'full-gradient' ? SpaceGrotesk.className : JetBrainsMono.className,
                'font-bold',
                'text-body-md',
                'text-center',
                'group',
                variantClass(variant),
                sizeClass,
                className,
                disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer',
                disabled || loading
                    ? 'opacity-50 hover:opacity-50 dark:opacity-50 dark:hover:opacity-50'
                    : 'opacity-100',
                (disabled || loading) && 'pointer-events-none',
                (disabled || loading) && variant === 'full-gradient' ? 'disabled-color-gradient' : '',
            )}
            onClick={(e) => {
                onClick && onClick(e)
            }}
        >
            {buttonContent}
        </Link>
    )

    return to ? LinkButton(to) : button
}
