import clsx from 'clsx'
import { ReactNode } from 'react'
import { Flex } from '~/components'
import { useBreakpoint } from '~/hooks'
import styles from './style.module.scss'

export const ContentWrapper = ({
    leftMemu,
    children,
    className,
    id,
}: {
    leftMemu: ReactNode
    children: ReactNode
    className?: string | string[]
    id?: string
}) => {
    const { breakpoint } = useBreakpoint()

    return (
        <Flex id={id} fullWidth gap={5} className={clsx('mx-auto', className)}>
            {/* Left Content */}
            {!['xs', 'sm', 'md', 'lg'].includes(breakpoint) && (
                <div
                    className={clsx(
                        'flex',
                        'basis-3/12',
                        'max-w-xs',
                        'min-w-[220px]',
                        'max-lg:hidden',
                        'flex',
                        'flex-col',
                        styles['left-content'],
                        'mr-5',
                        'pt-14',
                    )}
                >
                    {leftMemu}
                </div>
            )}
            {/* Right Content */}
            <Flex flexDirection="column" className="w-full">
                {children}
            </Flex>
        </Flex>
    )
}
