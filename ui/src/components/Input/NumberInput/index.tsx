import clsx from 'clsx'
import { forwardRef, InputHTMLAttributes, useEffect, useRef, useState } from 'react'
import { Flex } from '../../Flex'
import { IconType } from '../../Icon'
import { LinkIcon } from '../../LinkIcon'

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    max?: number
    onChange?: (value: number) => void
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => {
    const numberRef = useRef<HTMLInputElement | null>(null)
    const [number, setNumber] = useState(props.defaultValue ?? 1)
    const { max, onChange } = props

    useEffect(() => {
        if (onChange) {
            onChange(number as number)
        }
    }, [number])
    return (
        <Flex
            flexDirection="row"
            alignItems="center"
            gap={2}
            className={clsx(
                'border',
                'border-light-input-border',
                'bg-light-background dark:bg-dark-background',
                'rounded',
                'p-2',
            )}
        >
            <LinkIcon
                icon={IconType.minus}
                onClick={() => {
                    if (!numberRef.current || numberRef.current?.value === '1') return
                    numberRef.current.value = (parseInt(numberRef.current.value) - 1).toString()
                    setNumber(parseInt(numberRef.current.value))
                }}
            />
            <input
                type="number"
                defaultValue={1}
                className={clsx('w-7', 'text-center', 'bg-light-background dark:bg-dark-background', 'border-none')}
                ref={(node) => {
                    numberRef.current = node
                    if (typeof ref === 'function') {
                        ref(node)
                    } else if (ref) {
                        ref.current = node
                    }
                }}
                onChange={(event) => {
                    if (
                        isNaN(parseInt(event.target.value)) ||
                        parseInt(event.target.value) < 1 ||
                        (max && parseInt(event.target.value) > max)
                    ) {
                        event.target.value = number.toString()
                    }
                }}
                max={max}
                // className={clsx('sf-only', 'hidden')}
            />
            <LinkIcon
                icon={IconType.plus}
                onClick={() => {
                    if (!numberRef.current || (max && parseInt(numberRef.current.value) >= max)) return
                    numberRef.current.value = (parseInt(numberRef.current.value) + 1).toString()
                    setNumber(parseInt(numberRef.current.value))
                }}
            />
        </Flex>
    )
})

NumberInput.displayName = 'NumberInput'
