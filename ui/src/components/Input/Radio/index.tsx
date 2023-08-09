import clsx from 'clsx'
import { forwardRef } from 'react'
import { Flex } from '../../Flex'
import { Typography } from '../../Typography'

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    reverse?: boolean
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>((props: RadioProps, ref) => {
    const { label, defaultChecked, onChange, reverse, ...rest } = props
    return (
        <label
            className={clsx(
                'group',
                'flex',
                'justify-between',
                'items-center',
                'w-full',
                'cursor-pointer',
                'relative',
                'gap-2',
            )}
        >
            <input
                type="radio"
                {...rest}
                defaultChecked={defaultChecked}
                ref={ref}
                onChange={(e) => {
                    onChange?.(e)
                }}
                className={clsx('peer', 'sr-only')}
            />

            <Typography className={clsx(reverse ? 'order-2' : 'order-1')}>{label}</Typography>
            <Flex
                className={clsx(
                    'w-5',
                    'h-5',
                    'p-1',
                    'border-2',
                    'rounded-full',
                    'transition-colors',
                    'peer-checked:border-light-primary',
                    'dark:peer-checked:border-dark-primary',
                    reverse ? 'order-1' : 'order-2',
                )}
            />
            <Flex
                className={clsx(
                    'w-3',
                    'absolute',
                    'h-3',
                    'rounded-full',
                    'transition-colors',
                    'peer-checked:bg-light-primary',
                    'dark:peer-checked:bg-dark-primary',
                    reverse ? 'left-[0.25rem]' : 'right-[0.25rem]',
                )}
            />
        </label>
    )
})

Radio.displayName = 'Radio'
