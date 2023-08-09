import { useState } from 'react'
import { useWindowSize } from './useWindowSize'

const defaultBreakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
}

export const useBreakpoint = (breakpoints = defaultBreakpoints) => {
    const [detail, setDetail] = useState<{
        breakpoint: string
        isMobile: boolean
        isTablet: boolean
        isDesktop: boolean
    }>({
        breakpoint: '2xl',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
    })

    useWindowSize(() => {
        type BreakpointKey = keyof typeof breakpoints

        const currentBreakpoint =
            Object.keys(breakpoints as object).find((breakpoint) => {
                const maxWidth = breakpoints?.[breakpoint as BreakpointKey]
                return window.matchMedia(`(max-width: ${maxWidth})`).matches
            }) ?? '2xl'
        const breakpointKey = currentBreakpoint as BreakpointKey

        const isMobile = breakpointKey === 'sm'
        const isTablet = breakpointKey === 'md'
        const isDesktop = breakpointKey === 'lg' || breakpointKey === 'xl' || breakpointKey === '2xl'

        setDetail({
            breakpoint: breakpointKey as string,
            isMobile,
            isTablet,
            isDesktop,
        })
    })

    return detail
}
