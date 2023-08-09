import clsx from 'clsx'
import React, { ForwardedRef, TextareaHTMLAttributes } from 'react'
import { JetBrainsMono } from '~/components/Typography/fonts'

export interface TextAreaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    resize?: 'none' | 'both' | 'horizontal' | 'vertical'
}

export const TextAreaInput = React.forwardRef(
    (props: TextAreaInputProps, ref: ForwardedRef<HTMLTextAreaElement>): React.ReactElement => {
        const darkClasses = ['dark:placeholder:text-dark-input-placeholder', 'dark:text-dark-text']

        const fontClasses = [JetBrainsMono.className, 'text-body-sm']

        const borderClasses = ['border', 'border-light-input-border', 'rounded']
        const { className, resize, rows = 10, ...rest } = props
        return (
            <textarea
                {...rest}
                rows={rows}
                ref={ref}
                className={clsx(
                    resize ? `resize-${resize}` : 'resize-none',
                    'w-full',
                    'py-3',
                    'px-3',
                    'bg-light-input-background',
                    'dark:bg-dark-input-background',
                    'color-text-default',
                    'focus-visible:outline-none',
                    'placeholder:font-[400]',
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
            />
        )
    },
)

TextAreaInput.displayName = 'TextAreaInput'

export default TextAreaInput
