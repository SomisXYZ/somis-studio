import React from 'react'
import { useBreakpoint } from '~/hooks'
import { kFormatter } from '~/utils/helpers'
import { Coin } from '../Coin'
import { Flex, FlexProps } from '../Flex'
import { Typography } from '../Typography'
import { Vol24DeltaSection } from '../Vol24DeltaSection'

interface Props extends FlexProps {
    title: string
    number?: number
    coin?: boolean
    skeleton?: boolean
    delta?: string
    currency?: 'sui' | 'mist'
}

export const NumberColumn = ({ title, number, coin, skeleton, delta, currency, ...ref }: Props) => {
    const { breakpoint } = useBreakpoint()
    return (
        <Flex gap={1} flexDirection="column" {...ref}>
            {coin ? (
                <Coin
                    number={number ? number : 0}
                    variant={['xs', 'sm', 'md'].includes(breakpoint) ? 'lg' : 'xl'}
                    font="jbm"
                    bold
                    skeleton={skeleton}
                    skeletonLength={40}
                    currency={currency}
                />
            ) : (
                <Typography
                    variant={['xs', 'sm', 'md'].includes(breakpoint) ? 'lg' : 'xl'}
                    bold
                    font="jbm"
                    skeleton={skeleton}
                    skeletonLength={40}
                >
                    {number ? kFormatter(number ?? 0) : '--'}
                </Typography>
            )}
            <Flex gap={2}>
                <Typography color="secondary" variant="md" bold transform="uppercase">
                    {title}
                </Typography>
                {typeof delta !== 'undefined' && <Vol24DeltaSection vol24Delta={delta} />}
            </Flex>
        </Flex>
    )
}
