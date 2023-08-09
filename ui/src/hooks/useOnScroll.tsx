import { useEffect, useState } from 'react'

export const useOnScroll = (): {
    scrollTop: number
    scrolling: boolean
} => {
    const [scrollTop, setScrollTop] = useState(0)
    const [scrolling, setScrolling] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrollTop(window.pageYOffset)
            setScrolling(true)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setScrolling(false)
        }, 100)
        return () => clearTimeout(timer)
    }, [scrollTop])

    return {
        scrollTop,
        scrolling,
    }
}
