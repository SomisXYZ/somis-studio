import clsx from 'clsx'
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { TransitionGroup, Transition as ReactTransition } from 'react-transition-group'
import { useBreakpoint, useWindowSize } from '~/hooks'
import { Flex } from '../Flex'
import { Typography } from '../Typography'

export interface ITab {
    title: string | ReactElement
    content: ReactElement
    disabled?: boolean
    childrenRef?: React.RefObject<HTMLDivElement>
    key?: string
}

export const Tab = ({
    tabs,
    border = true,
    onchange,
    disableFullWidth = false,
    color = 'gradient',
}: {
    tabs: ITab[]
    border?: boolean
    disableFullWidth?: boolean
    color?: 'gradient' | 'primary'
    onchange?: (index: number) => void
}): ReactElement => {
    const [active, setActive] = useState(0)
    const [width, setWidth] = useState(0)
    const [left, setLeft] = useState(0)
    const [fullWidth, setFullWidth] = useState(false)
    const { width: windowWidth } = useWindowSize()
    const { breakpoint } = useBreakpoint()

    const tabList = tabs.map((tab) => ({
        ...tab,
        ref: useRef<HTMLDivElement | null>(null),
    }))

    const parentRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const ref = tabList[active].ref.current

        const pRef = parentRef.current
        if (ref && pRef) {
            const { left: pLeft } = pRef.getBoundingClientRect()
            const { width, left } = ref.getBoundingClientRect()
            setWidth(width)
            setLeft(left - pLeft)
        }
    }, [active, windowWidth, tabList[active]])

    useEffect(() => {
        if (['sm', 'md', 'lg'].includes(breakpoint) && !disableFullWidth) {
            setFullWidth(true)
        } else {
            setFullWidth(false)
        }
    }, [breakpoint])

    const TIMEOUT = 300
    const memoizedTabList = useMemo(() => tabList, [tabList])

    return (
        <Flex fullWidth flexDirection="column" className="relative min-h-[80vh]">
            <Flex
                ref={parentRef}
                className={clsx(
                    border && 'border-b',
                    'relative',
                    'tab-header',
                    'mb-[1px]',
                    'border-light-border dark:border-dark-border',
                )}
                fullWidth
                justifyContent={fullWidth ? 'center' : 'start'}
            >
                {memoizedTabList.map((tab, index) => (
                    <Flex
                        fullWidth={fullWidth}
                        key={index}
                        ref={tab.ref}
                        onClick={() => {
                            if (!tab.disabled && index !== active) {
                                setActive(index)
                                onchange && onchange(index)
                            }
                        }}
                        justifyContent="center"
                        alignItems="center"
                        className={clsx(
                            tab.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                            tab.disabled ? 'opacity-50' : 'opacity-100',
                            'px-4',
                            'py-4',
                        )}
                    >
                        <Typography bold={active === index} transform="uppercase">
                            {tab.title}
                        </Typography>
                    </Flex>
                ))}
                <div
                    className={clsx(
                        'absolute',
                        'bottom-[-2px]',
                        color === 'gradient' && 'color-gradient',
                        color === 'primary' && 'bg-light-primary',
                        'h-1',
                        'transition-all',
                    )}
                    style={{
                        width,
                        left,
                    }}
                />
            </Flex>
            <TransitionGroup className={clsx('max-w-full', '', 'relative')}>
                <ReactTransition
                    key={active}
                    timeout={{
                        enter: TIMEOUT,
                        exit: TIMEOUT,
                    }}
                    onEntering={(node: HTMLElement) => {
                        node.style.opacity = `0`
                        node.style.position = 'absolute'
                    }}
                    onEntered={(node: HTMLElement) => {
                        node.style.transition = `opacity ${TIMEOUT}ms ease-in-out`
                        node.style.opacity = `1`
                        node.style.position = 'relative'
                    }}
                    onExiting={(node: HTMLElement) => {
                        node.style.transition = `opacity ${TIMEOUT}ms ease-in-out`
                        node.style.opacity = `0`
                        node.style.position = 'absolute'
                    }}
                >
                    <div className={clsx('relative', 'w-full', 'top-0', 'left-0', 'right-0', 'bottom-0')}>
                        {tabList[active].content}
                    </div>
                </ReactTransition>
            </TransitionGroup>
        </Flex>
    )
}
