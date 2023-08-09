import clsx from 'clsx'
import React, { useRef } from 'react'
import { ReactSVG } from 'react-svg'
import checkIcon from '@assets/icons/check.svg'
import { loadSVG } from '~/utils/helpers'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    children?: React.ReactNode
    bgColor?: boolean
    dataname?: string
}

export const Checkbox = React.forwardRef(
    (
        { children, onChange, disabled, bgColor = true, checked = false, className, dataname, ...props }: CheckboxProps,
        ref: React.ForwardedRef<HTMLInputElement>,
    ): React.ReactElement => {
        const checkBoxRef = useRef<HTMLInputElement | null>(null)
        const [isChecked, setIsChecked] = React.useState(checked)

        React.useEffect(() => {
            setIsChecked(checked)
        }, [checked])
        return (
            <label
                data-name={dataname}
                className={clsx(
                    'flex',
                    'w-full',
                    'p-2',
                    'rounded-md',
                    'hover:bg-light-background-hover',
                    'dark:hover:bg-dark-background-hover',
                    'translation-all',
                    'ease-out',
                    'duration-100',
                    isChecked === true &&
                        bgColor === true && ['bg-light-selected-background', 'dark:bg-dark-selected-background'],
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                    disabled && 'opacity-50',
                    className,
                )}
            >
                <div className="m-auto flex flex-none items-center justify-center">
                    <input
                        ref={(node) => {
                            checkBoxRef.current = node
                            if (typeof ref === 'function') {
                                ref(node)
                            } else if (ref) {
                                ref.current = node
                            }
                        }}
                        type="checkbox"
                        disabled={disabled}
                        className={clsx('sr-only', 'peer')}
                        checked={isChecked}
                        readOnly
                        onChange={(event) => {
                            setIsChecked(event.target.checked)
                            onChange?.(event)
                        }}
                        {...props}
                    />
                    <span
                        className={clsx(
                            'flex',
                            'justify-center',
                            'items-center',
                            'mr-2',
                            'w-5',
                            'h-5',
                            'color-checkbox-primary',
                            isChecked && 'color-checkbox-primary-checked',
                            'border',
                            'border-light-input-border',
                            'dark:border-dark-input-border',
                            'rounded-sm',
                            'cursor-pointer',
                            'transition-opacity',
                            'relative',
                            'm-auto',
                            'relative',
                            disabled && 'opacity-50',
                            disabled && 'cursor-not-allowed',
                        )}
                    >
                        <ReactSVG
                            src={loadSVG(checkIcon)}
                            className={clsx(
                                'translate relative top-[2px] h-4 w-4',
                                'duration-300',
                                isChecked ? 'opacity-1' : 'opacity-0',
                                isChecked && 'fill-white',
                                // 'fill-white',
                                // 'dark:fill-dark-border',
                            )}
                        />
                    </span>
                </div>
                <div className="flex-1 pl-2">{children}</div>
            </label>
        )
    },
)

Checkbox.displayName = 'Checkbox'
