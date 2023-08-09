// REF: https://github.com/MystenLabs/sui/blob/5d88f8c8b9789617b8a236d05c92088d1e552891/apps/explorer/src/hooks/useFormatCoin.ts

import { Coin, SUI_TYPE_ARG } from '@mysten/sui.js'
import BigNumber from 'bignumber.js'
import { useEffect, useMemo } from 'react'
import { persist } from 'zustand/middleware'
import create from 'zustand'
import service from '~/services/blockChain/service'
import appContext from '~/contexts/app'

type FormattedCoin = {
    roundedAmount: string
    fullAmount: string
    decimals: number
    symbol: string
    loading: boolean
}

export enum CoinFormat {
    ROUNDED = 'ROUNDED',
    FULL = 'FULL',
}

interface CoinDecimalsState {
    loading: boolean
    cache: {
        [key: string]: number
    }
    refresh: (coinType: string) => Promise<void>
    getDecimals: (coinType: string) => number
    clear: () => void
}

const initCoinDecimalsState = {
    loading: true,
    cache: {},
}

const useCoinDecimals = create(
    persist<CoinDecimalsState>(
        (set, get) => {
            return {
                ...initCoinDecimalsState,
                cache: get()?.cache,
                refresh: async (coinType: string) => {
                    set({
                        loading: true,
                    })
                    const coin = await service.getCoinMetadata(coinType)
                    const { cache } = get()
                    // TODO: handle error
                    const decimals = coin?.decimals ?? 9
                    const newCache = {
                        ...cache,
                        [coinType]: decimals,
                    }
                    set({
                        loading: false,
                        cache: newCache,
                    })
                },
                getDecimals: (coinType: string) => {
                    const { cache } = get()
                    if (cache && cache?.[coinType] && cache[coinType] !== undefined) {
                        return cache[coinType]
                    }
                    return 0
                },
                clear: () => {
                    set(initCoinDecimalsState)
                },
            }
        },
        {
            name: 'somis-coin-storage', // name of item in the storage (must be unique)
            getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
        },
    ),
)

/**
 * Formats a coin balance based on our standard coin display logic.
 * If the balance is less than 1, it will be displayed in its full decimal form.
 * For values greater than 1, it will be truncated to 3 decimal places.
 */
export function formatBalance(
    balance: bigint | number | string,
    decimals: number,
    format: CoinFormat = CoinFormat.ROUNDED,
) {
    let postfix = ''
    let bn = new BigNumber(balance.toString()).shiftedBy(-1 * decimals)

    if (format === CoinFormat.FULL) {
        return bn.toFormat()
    }

    if (bn.gte(1_000_000_000)) {
        bn = bn.shiftedBy(-9)
        postfix = ' B'
    } else if (bn.gte(1_000_000)) {
        bn = bn.shiftedBy(-6)
        postfix = ' M'
    } else if (bn.gte(10_000)) {
        bn = bn.shiftedBy(-3)
        postfix = ' K'
    }

    if (bn.gte(1)) {
        bn = bn.decimalPlaces(3, BigNumber.ROUND_DOWN)
    }

    return bn.toFormat() + postfix
}

export function useFormatCoin(
    balance?: bigint | number | string | null,
    coinType: string = SUI_TYPE_ARG,
    clearCache = false,
): FormattedCoin {
    const symbol = useMemo(() => (coinType ? Coin.getCoinSymbol(coinType) : ''), [coinType])
    const { getDecimals, loading, refresh, clear } = useCoinDecimals()
    const { config } = appContext.useAppState()
    const decimals = getDecimals(coinType)
    useEffect(() => {
        if (clearCache) {
            clear()
        }
    }, [clearCache])

    useEffect(() => {
        if (decimals === 0) {
            refresh(coinType)
        }
    }, [coinType, decimals, config])

    const roundedAmount = useMemo(() => {
        if (typeof balance === 'undefined' || balance === null) return ''
        if (loading) return '--'
        return formatBalance(balance, decimals, CoinFormat.ROUNDED)
    }, [decimals, balance, loading])

    const fullAmount = useMemo(() => {
        if (typeof balance === 'undefined' || balance === null) return ''
        if (loading) return '--'
        return formatBalance(balance, decimals, CoinFormat.FULL)
    }, [decimals, balance, loading])

    return { roundedAmount, fullAmount, decimals, symbol, loading }
}
