import clsx from 'clsx'
import React, { ChangeEvent } from 'react'
import { Flex } from '../../Flex'
import { Icon, IconType } from '../../Icon'
import { JetBrainsMono } from '../../Typography/fonts'
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    type?: 'text' | 'number' | 'password' | 'email' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local'
    suffix?: React.ReactNode
    suffixType?: 'primary' | 'secondary'
    suffixIcon?: IconType
    suffixIconColorClass?: string
    error?: string
    containerClassName?: string | string[]
}

export const TextInput = React.forwardRef(
    (props: Props, ref: React.ForwardedRef<HTMLInputElement>): React.ReactElement => {
        const darkClasses = ['dark:placeholder:text-dark-input-placeholder', 'dark:text-dark-text']

        const fontClasses = [JetBrainsMono.className, 'text-body-sm']

        const borderClasses = ['border', 'border-light-input-border', 'rounded']

        const [oldValue, setOldValue] = React.useState<string>(props.value?.toString() ?? '')

        const {
            className,
            type = 'text',
            onChange,
            error,
            suffixIcon,
            suffixIconColorClass,
            suffixType = 'primary',
            suffix,
            min,
            max,
            containerClassName,
            ...remain
        } = props

        return (
            <div className={clsx('relative', 'flex-1', containerClassName)}>
                <input
                    ref={ref}
                    onKeyDown={(e) => {
                        if (type === 'number') {
                            if (e.key === 'ArrowUp') {
                                e.preventDefault()
                                const value = parseInt(e.currentTarget.value) + 1
                                if (Number(max) && value > Number(max)) return
                                e.currentTarget.value = value.toString()
                                onChange?.(e as unknown as ChangeEvent<HTMLInputElement>)
                            }
                            if (e.key === 'ArrowDown') {
                                e.preventDefault()
                                const value = parseInt(e.currentTarget.value) - 1
                                if (min !== null && min !== undefined && value < Number(min)) return
                                e.currentTarget.value = value.toString()
                                onChange?.(e as unknown as ChangeEvent<HTMLInputElement>)
                            }
                        }
                    }}
                    min={min}
                    max={max}
                    type={type}
                    onChange={(e) => {
                        if (type === 'number') {
                            e.preventDefault()
                            const value = e.target.value.replace(/[^0-9.]/g, '')
                            if (max && Number(value) > Number(max)) e.target.value = oldValue
                            else if (value !== '' && min !== null && min !== undefined && Number(value) < Number(min))
                                e.target.value = oldValue
                            else e.target.value = value
                            setOldValue(e.target.value)
                        }
                        onChange?.(e)
                    }}
                    className={clsx(
                        'w-full',
                        'py-3',
                        'px-3',
                        'color-input-background',
                        'color-text-default',
                        'focus-visible:outline-none',
                        'placeholder:font-[400]',
                        'placeholder:' + JetBrainsMono.className,
                        'placeholder:text-light-input-placeholder',
                        'disabled:opacity-50',
                        'disabled:cursor-not-allowed',
                        'hover:transition-[border-color] hover:duration-200',
                        borderClasses,
                        fontClasses,
                        darkClasses,
                        className,
                        'input-border-gradient',
                        'rounded-sm',
                    )}
                    {...remain}
                />
                {suffixIcon && (
                    <Flex
                        alignItems="center"
                        className="color-selected-background absolute right-[1px] top-[1px] bottom-[1px] m-auto transform rounded-tr rounded-br p-2"
                    >
                        <Icon icon={suffixIcon} width={12} colorClass={suffixIconColorClass} />
                    </Flex>
                )}
                {suffix && (
                    <div
                        className={
                            suffixType === 'primary'
                                ? 'absolute right-4 top-1/2 -translate-y-1/2 transform'
                                : 'color-selected-background absolute right-[1px] top-[1px] bottom-[1px] m-auto transform rounded-tr rounded-br p-2'
                        }
                    >
                        {suffix}
                    </div>
                )}
                {error && (
                    <div
                        className={clsx(
                            'relative',
                            'flex',
                            'items-center',
                            'mt-2',
                            'text-light-input-error',
                            'dark:text-dark-input-error',
                            JetBrainsMono.className,
                            'text-body-sm',
                        )}
                    >
                        {error}
                    </div>
                )}
            </div>
        )
    },
)

TextInput.displayName = 'TextInput'
