import clsx from 'clsx'
import React from 'react'
import { Flex, FlexProps } from '../Flex'
import style from './container.module.scss'

interface Props extends FlexProps {
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit'
    isFullWidth?: boolean
    backgroundBlur?: boolean
}

export const Container = React.forwardRef(
    (
        { className, overflow = 'hidden', isFullWidth = true, backgroundBlur = false, children, ...props }: Props,
        ref: React.ForwardedRef<HTMLDivElement>,
    ) => {
        const overFlowClass = (overflow: string) => {
            switch (overflow) {
                case 'visible':
                    return 'overflow-visible'
                case 'hidden':
                    return 'overflow-hidden'
                case 'scroll':
                    return 'overflow-scroll'
                case 'auto':
                    return 'overflow-auto'
                case 'initial':
                    return 'overflow-initial'
                case 'inherit':
                    return 'overflow-inherit'
                default:
                    return 'overflow-hidden'
            }
        }
        return (
            <Flex
                ref={ref}
                className={clsx(
                    'px-4',
                    'md:px-8',
                    'lg:px-8',
                    'xl:px-24',
                    '2xl:px-32',
                    'mx-auto',
                    'relative',
                    'somis-container',
                    overFlowClass(overflow),
                    'w-full',
                    !isFullWidth && 'max-w-[120rem]',
                    className,
                )}
                {...props}
            >
                {backgroundBlur ? <div className={clsx(style['background-blur'])} /> : null}
                {children}
            </Flex>
        )
    },
)

Container.displayName = 'Container'
