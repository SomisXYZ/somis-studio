import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import React, { createRef, useEffect, useState } from 'react'
import { Typography } from '../Typography'
import { ReactSVG } from 'react-svg'
import arrow from '@assets/icons/arrow.svg'
import { useBreakpoint } from '~/hooks'
import { loadSVG } from '~/utils/helpers'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    header: string | React.ReactElement
    headerClassName?: string | string[]
    contentClassName?: string | string[]
    defaultOpen?: boolean
    reverse?: boolean
}

export const Collapse = ({
    header,
    headerClassName,
    children,
    contentClassName,
    defaultOpen = false,
    reverse = false,
}: Props): React.ReactElement => {
    const [isOpen, setIsOpen] = useState(false)
    const [height, setHeight] = useState(0)
    const ref = createRef<HTMLDivElement>()
    const { breakpoint } = useBreakpoint()

    useEffect(() => {
        setHeight(ref?.current?.scrollHeight ?? 0)
    }, [breakpoint, isOpen, children])

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(defaultOpen)
        }, 300)

        return () => {
            setIsOpen(!defaultOpen)
            clearTimeout(timer)
        }
    }, [defaultOpen])
    return (
        <div className={clsx('w-full', contentClassName)}>
            <div
                className={twMerge(
                    'flex',
                    'justify-between',
                    'items-center',
                    'cursor-pointer',
                    'rounded-md',
                    'hover:bg-light-background-hover',
                    'dark:hover:bg-dark-background-hover',
                    'p-2',
                    headerClassName,
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={clsx(reverse ? 'order-2' : 'order-1')}>
                    {typeof header === 'string' ? (
                        <Typography variant="title" transform="uppercase" bold className={clsx('py-2')}>
                            {header}
                        </Typography>
                    ) : (
                        header
                    )}
                </div>
                <ReactSVG
                    src={loadSVG(arrow)}
                    className={clsx(
                        'transform',
                        'transition-transform',
                        'duration-300',
                        'ease-in-out',
                        isOpen ? 'rotate-0' : 'rotate-180',
                        'fill-light',
                        'dark:fill-dark',
                        reverse ? 'order-1' : 'order-2',
                    )}
                />
            </div>
            <section
                className={clsx(
                    'flex',
                    'flex-col',
                    'space-y-2',
                    'overflow-hidden',
                    'transition-height',
                    'duration-300',
                    'ease-out',
                    isOpen && 'mt-2',
                )}
                style={{
                    height: isOpen ? height : 0,
                }}
            >
                <div ref={ref} className={'mb-4'}>
                    {isOpen && children}
                </div>
            </section>
        </div>
    )
}
