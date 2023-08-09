import clsx from 'clsx'
import { memo, useEffect, useState } from 'react'
import { Range, getTrackBackground } from 'react-range'
import { Flex } from '../Flex'

export interface RangeSliderProps {
    min: number
    max: number
    className?: string | string[]
    trackClassName?: string | string[]
    thumbClassName?: string | string[]
    defaultValue?: number
    onChange?: (value: number) => void
}

export const RangeSlider = memo(
    ({ min, max, className, trackClassName, thumbClassName, onChange, defaultValue }: RangeSliderProps) => {
        const [values, setValues] = useState([defaultValue ?? 0])

        useEffect(() => {
            setValues([defaultValue ?? 0])
        }, [defaultValue])

        return (
            <Flex fullWidth justifyContent="start" alignItems="center" className={clsx('pl-2', className)}>
                <Range
                    step={0.01}
                    min={min}
                    max={max <= min ? min + 1 : max}
                    values={values}
                    onChange={(values) => {
                        setValues(values)
                        onChange?.(Math.round(values[0]))
                        // debounceChange(values)
                    }}
                    renderTrack={({ props: { style, ...rest }, children }) => (
                        <div
                            {...rest}
                            className={clsx('h-1.5', 'w-full', 'rounded', trackClassName)}
                            style={{
                                ...style,
                                background: getTrackBackground({
                                    values,
                                    colors: ['var(--color-primary)', 'var(--color-gray)'],
                                    min,
                                    max,
                                }),
                            }}
                        >
                            {children}
                        </div>
                    )}
                    renderThumb={({ props: { style, ...rest } }) => (
                        <div
                            {...rest}
                            className={clsx(
                                'h-5',
                                'w-5',
                                'rounded-full',
                                'shadow-md',
                                'bg-light-primary',
                                thumbClassName,
                            )}
                            style={style}
                        />
                    )}
                />
            </Flex>
        )
    },
)

RangeSlider.displayName = 'RangeSlider'
