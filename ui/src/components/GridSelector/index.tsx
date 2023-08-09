import { ReactElement } from 'react'
import { Flex } from '../Flex'
import clsx from 'clsx'
import { Icon, IconType } from '../Icon'

export interface GridSelectorProps {
    children: ReactElement
    selected?: boolean
    disabled?: boolean
    className?: string | string[]
}

export const GridSelector = ({ children, selected = false, className, disabled }: GridSelectorProps) => {
    return (
        <div className={clsx('relative', className)}>
            <Flex
                justifyContent="center"
                alignItems="center"
                className={clsx(
                    'absolute',
                    'left-2',
                    'top-2',
                    'z-10',
                    'h-6',
                    'w-6',
                    'rounded-sm',
                    selected ? ['bg-light-primary', 'dark:bg-dark-primary', 'opacity-100'] : ['bg-black', 'opacity-30'],
                    disabled && 'cursor-not-allowed',
                )}
            >
                <span className="text-2xl">
                    <Icon icon={IconType.check} colorClass={'fill-white'} />
                    <input type="checkbox" className="sf-only hidden" />
                </span>
            </Flex>
            {children}
        </div>
    )
}
