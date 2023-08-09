import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'
import { CSSTransition } from 'react-transition-group'
import arrow from '@assets/icons/arrow.svg'
import { formatAddress, loadSVG } from '~/utils/helpers'
import { Typography } from '../Typography'
import { Icon, IconType } from '../Icon'
interface Props {
    title: string
    address: string
    className?: string | string[]
}

export const AddressSelect = ({ title, address, className }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [isCopied])

    return (
        <div className={clsx('relative', className)}>
            <button
                className={clsx(
                    'py-[7px]',
                    'h-full',
                    'px-4',
                    'flex',
                    'justify-between',
                    'relative',
                    'border',
                    'color-border',
                    'border-opacity-10 dark:border-opacity-10',
                    'rounded',
                    'focus:outline-none',
                    'bg-light-input-background',
                    'dark:bg-dark-input-background',
                    'opacity-80 dark:opacity-80',
                )}
                onClick={() => {
                    setIsOpen(!isOpen)
                }}
            >
                <Typography
                    variant="md"
                    font="jbm"
                    className={clsx('truncate', 'block', 'max-w-[100px]', 'top-0', 'bottom-0', 'relative', 'm-auto')}
                    regular
                >
                    {title}
                </Typography>
                <ReactSVG
                    src={loadSVG(arrow)}
                    className={clsx(
                        'transform',
                        'transition-transform',
                        'duration-100',
                        'ml-3',
                        'ease-in',
                        isOpen ? 'rotate-0' : 'rotate-180',
                        'fill-light',
                        'dark:fill-dark',
                    )}
                />
            </button>
            <CSSTransition
                in={isOpen}
                timeout={100}
                classNames={clsx('transition-opacity', 'duration-100')}
                unmountOnExit
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
                <div
                    className={clsx(
                        'py-3',
                        'px-4',
                        'absolute',
                        'transform',
                        'left-0',
                        'mt-1',
                        'bg-light-background',
                        'dark:bg-dark-background',
                        'shadow-lg',
                        'transition-all',
                        'duration-100',
                        'ease-in',
                        'rounded',
                        'overflow-hidden',
                        'z-10',
                        'w-[200px]',
                        'bg-light-background',
                        'dark:bg-dark-background',
                        'color-border',
                        'opacity-0',
                        isOpen ? 'scale-100' : 'scale-95',
                    )}
                >
                    <div
                        className={clsx('cursor-pointer', 'focus:outline-none', 'focus:bg-none')}
                        onClick={() => {
                            setIsCopied(true)
                            navigator.clipboard.writeText(address)
                            setTimeout(() => {
                                setIsOpen(false)
                            }, 400)
                        }}
                    >
                        <Typography className={clsx('flex', 'gap-2', 'pr-14')}>
                            {isCopied ? (
                                'Copied'
                            ) : (
                                <>
                                    <Icon
                                        icon={IconType.sui}
                                        beforeInjection={(svg) => {
                                            svg.classList.add('fill-blue')
                                            svg.setAttribute('width', '14')
                                            svg.setAttribute('height', '14')
                                        }}
                                        className={clsx('my-auto')}
                                    />
                                    {formatAddress(address, 5, 3)}
                                </>
                            )}
                        </Typography>
                        <Icon
                            icon={IconType.copy}
                            className={clsx('absolute', 'right-4', 'top-1/2', 'transform', 'translate-y-[-50%]')}
                        />
                    </div>
                </div>
            </CSSTransition>
        </div>
    )
}
