import { CSSProperties, ReactElement } from 'react'
import { clsx } from 'clsx'
import { UseFormRegisterReturn } from 'react-hook-form'
import { Flex } from '../Flex'

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checkedCallback?: (checked: boolean) => void
    offIcon?: string
    onIcon?: string
    onBgColor?: string
    offBgColor?: string
    register?: UseFormRegisterReturn
}

export const Toggle = ({
    checkedCallback,
    onBgColor = 'white',
    offBgColor = 'white',
    checked = false,
    offIcon,
    onIcon,
    register,
    disabled,
}: ToggleProps): ReactElement => {
    const style = {
        ...(offIcon && { '--toggle-off-icon-url': `url('${offIcon}')` }),
        ...(onIcon && { '--toggle-on-icon-url': `url('${onIcon}')` }),
        ...(onBgColor && { '--toggle-on-bg-color': onBgColor }),
        ...(offBgColor && { '--toggle-off-bg-color': offBgColor }),
    } as CSSProperties
    return (
        <Flex alignItems="center" className={clsx(disabled ? ['cursor-not-allowed', 'opacity-50'] : 'cursor-pointer')}>
            <label className="relative mr-5 inline-flex items-center">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    onChange={(event) => {
                        checkedCallback?.(event.target.checked)
                    }}
                    disabled={disabled}
                    defaultChecked={checked}
                    readOnly
                    {...register}
                />
                <div
                    style={style}
                    className={clsx(
                        /* Base */
                        'transition-all',
                        'duration-300',
                        'w-12',
                        'h-4',
                        'rounded-full',
                        'peer',
                        'bg-gray-300',
                        /* Switch */
                        "after:content-['']",
                        'after:absolute',
                        'after:top-[-6px]',
                        'after:left-[-6px]',
                        'after:shadow',
                        'after:rounded-full',
                        'after:h-7',
                        'after:w-7',
                        'after:transition-all',
                        'after:duration-300',
                        'after:ease-in-out',
                        offIcon && 'after:bg-[image:var(--toggle-off-icon-url)]',
                        offBgColor && 'after:bg-[var(--toggle-off-bg-color)]',
                        /* Checked */
                        'peer-checked:bg-light-primary',
                        'dark:peer-checked:bg-dark-primary',
                        'after:bg-no-repeat',
                        'after:bg-center',
                        onIcon && 'peer-checked:after:bg-[image:var(--toggle-on-icon-url)]',
                        onBgColor && 'peer-checked:after:bg-[var(--toggle-on-bg-color)]',
                        'peer-checked:after:translate-x-full',
                        disabled ? ['cursor-not-allowed', 'opacity-50'] : 'cursor-pointer',
                    )}
                />
            </label>
        </Flex>
    )
}
