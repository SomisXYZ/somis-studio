import clsx from 'clsx'
import { useState } from 'react'
import { Button } from '../Button'
import { Flex } from '../Flex'

interface Props {
    onClick?: (value: string) => void
    buttons: { value: string; label: string }[]
    disabled?: boolean
}
export const ButtonGroup = ({ buttons, onClick, disabled }: Props) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    return (
        <Flex
            flexDirection="row"
            className={clsx('rounded-md shadow-sm', disabled && 'cursor-not-allowed', 'w-full')}
            role="group"
        >
            {buttons.map((button, index) => (
                <Button
                    key={index}
                    disabled={disabled}
                    variant="grouped"
                    onClick={() => {
                        setSelectedIndex(index)
                        onClick?.(button.value)
                    }}
                    className={clsx(
                        index === 0 ? 'rounded-l-md' : '',
                        index === buttons.length - 1 ? 'rounded-r-md' : '',
                        'rounded-none',
                        index === selectedIndex ? 'bg-button-group-selected' : 'bg-button-group-normal',
                        index === selectedIndex ? 'text-button-group-selected-text' : 'text-button-group-normal-text',
                        'w-full',
                        'max-lg:py-3',
                    )}
                    title={button.label}
                />
            ))}
        </Flex>
    )
}
