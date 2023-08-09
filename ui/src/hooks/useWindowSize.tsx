import { useState, useEffect } from 'react'
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

export interface Size {
    width: number | undefined
    height: number | undefined
}

export const useWindowSize = (reSizeAction?: (size: Size) => void): Size => {
    const [windowSize, setWindowSize] = useState<Size>({
        width: undefined,
        height: undefined,
    })

    const handleResize = () => {
        const newSize = {
            width: window.innerWidth,
            height: window.innerHeight,
        }
        setWindowSize(newSize)
        reSizeAction && reSizeAction(newSize)
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Set size at the first client-side load
    useIsomorphicLayoutEffect(() => {
        handleResize()
    }, [])

    return windowSize
}
