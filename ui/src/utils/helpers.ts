export const formatAddress = (text: string, start = 5, end = 3) => {
    return text.length > start + end ? text.slice(0, start) + '...' + text.slice(-end) : text
}

export const formatNumber = (number: number, decimals = 2) => {
    return number.toLocaleString(undefined, { maximumFractionDigits: decimals })
}

export const kFormatter = (number: number, decimals = 1) => {
    if (isNaN(number)) {
        return '--'
    }
    if (Math.abs(number) <= 9999) {
        return formatNumber(number, decimals)
    } else if (Math.abs(number) > 9999 && Math.abs(number) <= 999999) {
        return formatNumber(Math.sign(number) * (Math.abs(number) / 1000), 2) + 'K'
    } else if (Math.abs(number) > 999999 && Math.abs(number) <= 999999999) {
        return formatNumber(Math.sign(number) * (Math.abs(number) / 1000000), 2) + 'M'
    }

    return formatNumber(Math.sign(number) * (Math.abs(number) / 1000000000), 2) + 'B'
}

export const handleVol24DeltaText = (vol24Delta: string): string => {
    if (vol24Delta && parseFloat(vol24Delta)) {
        const d = formatNumber(parseFloat(vol24Delta), 2)
        return parseFloat(vol24Delta) > 0 ? `+${d}%` : `${d}%`
    }
    return '--'
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const getBrowserOS = (): string => {
    if (typeof window === 'undefined') {
        return 'unknown'
    }
    const userAgent = window.navigator.userAgent.toLowerCase(),
        macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i,
        windowsPlatforms = /(win32|win64|windows|wince)/i,
        iosPlatforms = /(iphone|ipad|ipod)/i
    let os = 'unknown'

    if (macosPlatforms.test(userAgent)) {
        os = 'macos'
    } else if (iosPlatforms.test(userAgent)) {
        os = 'ios'
    } else if (windowsPlatforms.test(userAgent)) {
        os = 'windows'
    } else if (/android/.test(userAgent)) {
        os = 'android'
    } else if (!os && /linux/.test(userAgent)) {
        os = 'linux'
    }

    return os
}

// Calculate the the nft price blow or above the market cap in percentage
export const getNftPriceBelowOrAboveMarketCap = (nftPrice: number, marketCap: number): number => {
    if (nftPrice === 0 || marketCap === 0) {
        return 0
    }
    return Math.round(((nftPrice - marketCap) / marketCap) * 100)
}

export const enumFromStringValue = <T>(enm: { [s: string]: T }, value: string): T | undefined => {
    return (Object.values(enm) as unknown as string[]).includes(value) ? (value as unknown as T) : undefined
}
export const loadSVG = (svg: string | { src: string; height: number; width: number }) =>
    typeof svg === 'string' ? svg : svg.src

export const splitNftName = (
    originName?: string,
): {
    name: string
    code: string
} => {
    const matches = originName?.match(/(.*) (#[a-zA-Z0-9]+)(.*)/) ?? []
    const name = matches?.[1] ? matches[1] + (matches[3] ? ` ・ ${matches[3].trim()}` : '') : originName ?? '--'
    const code = matches?.[2] ? matches[2] : ''

    return {
        name,
        code,
    }
}

export type Features =
    | 'collections'
    | 'launchpads'
    | 'marketplace'
    | 'leaderboard'
    | 'discord'
    | 'twitter'
    | 'tradingView'
    | 'studio'
    | 'bid'
export const isFeatureEnabled = (feature: Features): boolean => {
    if (!process.env.NEXT_PUBLIC_ENABLE_FEATURES) {
        console.warn('NEXT_PUBLIC_ENABLE_FEATURES is not set')
        return false
    }
    if (process.env.NEXT_PUBLIC_ENABLE_FEATURES === 'all') {
        return true
    }
    return process.env.NEXT_PUBLIC_ENABLE_FEATURES?.split(',').includes(feature) ?? false
}

export const openPopupWindow = (url: string) => {
    if (!window) {
        return
    }

    window.open(url, '_blank', 'noopener,noreferrer,toolbar=0,location=0,menubar=0,width=500,height=750')
}

export const getWebVersion = () => {
    if (!window) {
        return ''
    }
    const url = window.location.href
    if (url.includes('staging')) {
        return 'staging'
    } else if (url.includes('beta')) {
        return 'beta'
    } else if (url.includes('localhost')) {
        return 'local'
    } else {
        return 'production'
    }
}

export const calculateCommission = (price: number, commissionBps: number): number => {
    return (price * commissionBps) / 10000
}

export const covertBpsToPercentage = (commissionBps: number | string | undefined | null): number => {
    if (!commissionBps) {
        return 0
    }

    if (typeof commissionBps === 'string') {
        return parseFloat(commissionBps) / 100
    }

    return commissionBps / 100
}
