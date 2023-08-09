import clsx from 'clsx'
import { debounce } from 'lodash'
import { createRef, ReactNode, useCallback, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useWindowSize } from '~/hooks'
import { Typography } from '../Typography'

export const Tooltip = ({
    children,
    className,
    text,
}: {
    children: ReactNode
    text: string
    className?: string | string[]
}) => {
    const [show, setShow] = useState(false)
    const [textPosition, setTextPosition] = useState({ top: 0, left: 0 })
    const textRef = createRef<HTMLDivElement>()
    const tooltipRef = createRef<HTMLDivElement>()
    const { width } = useWindowSize()
    const updateTextPosition = useCallback((tooltip: HTMLDivElement | null) => {
        if (!tooltip) return
        const tooltipRect = tooltip?.getBoundingClientRect()
        const { left, width, bottom } = tooltipRect || {}
        // Calculate the tooltip text position
        const tooltipTop = bottom + 5
        const tooltipLeft = left - width / 2 - 300 / 2
        setTextPosition({ top: tooltipTop, left: tooltipLeft })
    }, [])
    useEffect(() => {
        const tooltip = tooltipRef.current
        updateTextPosition(tooltip)
    }, [width])
    return (
        <div
            ref={tooltipRef}
            onMouseEnter={(event) => {
                // Get the tooltip element position x, y
                const tooltip = event.currentTarget
                updateTextPosition(tooltip)
                setShow(true)
            }}
            onMouseLeave={() => {
                const debounced = debounce(() => {
                    setShow(false)
                }, 100)
                debounced()
            }}
            className={clsx(className)}
        >
            {children}
            <CSSTransition
                in={show}
                timeout={300}
                classNames="modal transition-opacity duration-300 ease-in-out"
                unmountOnExit
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
                <div
                    ref={textRef}
                    style={{
                        top: textPosition.top,
                        left: textPosition.left,
                    }}
                    className={clsx(
                        'fixed',
                        'transition-opacity',
                        'z-50',
                        'bg-light-background',
                        'p-2',
                        'rounded-md',
                        'shadow-md',
                        'max-w-xs',
                        'opacity-0',
                    )}
                >
                    <Typography>{text}</Typography>
                </div>
            </CSSTransition>
        </div>
    )
}
