import clsx from 'clsx'
import { useState } from 'react'
import { ReactSVG } from 'react-svg'
import { CSSTransition } from 'react-transition-group'
import arrow from '@assets/icons/arrow.svg'
import { loadSVG } from '~/utils/helpers'
import { Typography } from '../Typography'
interface Props {
    options: { value: string; label: string }[]
    defaultValue?: string
    onSelect?: (value: string | undefined) => void
    disabled?: boolean
}

export const Select = ({ disabled, defaultValue, onSelect, options = [] }: Props) => {
    const [selectedIndex, setSelectedIndex] = useState(
        defaultValue ? options.findIndex((option) => option.value === defaultValue) : 0,
    )
    const [isOpen, setIsOpen] = useState(false)

    const padding = ['px-6', 'py-3']
    const selectedStyle = [
        'bg-light-select-background',
        'dark:bg-dark-select-background',
        'text-light-select-text',
        'dark:text-dark-select-text',
    ]
    const isDisabled = disabled || options.length === 0
    return (
        <div
            className={clsx('relative', 'w-full', disabled ? 'opacity-50' : 'opacity-100')}
            onBlur={() => {
                setIsOpen(false)
            }}
        >
            <button
                className={clsx(
                    'w-full',
                    'flex',
                    'justify-between',
                    'relative',
                    padding,
                    'border',
                    'border-gray-300',
                    'dark:border-gray-600',
                    'rounded-md',
                    'focus:outline-none',
                    'min-w-[16rem]',
                    isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
                    'bg-light-selected-background dark:bg-dark-selected-background',
                )}
                onClick={() => {
                    setIsOpen(!isOpen)
                }}
                disabled={isDisabled}
            >
                <Typography variant="md" font="jbm" className={clsx('contents')} regular>
                    {options?.[selectedIndex]?.label ?? '------'}
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
                classNames={clsx('transform', 'transition-opacity', 'duration-100', 'ease-in')}
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
                        'absolute',
                        'transform',
                        'left-0',
                        'mt-1',
                        'w-full',
                        'bg-light-input-background',
                        'dark:bg-dark-input-background',
                        'shadow-lg',
                        'transition-[scale]',
                        'duration-100',
                        'ease-in',
                        'rounded-md',
                        'overflow-hidden',
                        'z-10',
                        'bg-light-background',
                        'dark:bg-dark-background',
                        'opacity-0',
                        isOpen ? 'scale-100' : 'scale-95',
                    )}
                >
                    {options.map((option, index) => {
                        return (
                            <div
                                className={clsx(
                                    padding,
                                    index === selectedIndex && selectedStyle,
                                    'hover:bg-light-select-background',
                                    'hover:text-light-select-text',
                                    'dark:hover:bg-dark-select-background',
                                    'dark:hover:text-dark-select-text',
                                    'cursor-pointer',
                                    'focus:outline-none',
                                    'focus:bg-none',
                                )}
                                key={index}
                                onClick={() => {
                                    if (index === selectedIndex) return
                                    setSelectedIndex(index)
                                    setIsOpen(false)
                                    onSelect?.(option.value)
                                }}
                            >
                                {option.label}
                            </div>
                        )
                    })}
                </div>
            </CSSTransition>
        </div>
    )
}
