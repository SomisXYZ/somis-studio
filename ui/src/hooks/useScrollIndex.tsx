import { useCallback, useState } from 'react'
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

export const useScrollIndex = (refs: React.RefObject<HTMLDivElement>[], getExtendHeight: () => number): number => {
    const [index, setIndex] = useState<number>(0)
    const scrollMaxValue = () => {
        const body = document.body
        const html = document.documentElement

        const documentHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight,
        )

        const windowHeight = window.innerHeight

        return documentHeight - windowHeight
    }

    const nearestIndex = (
        currentPosition: number,
        sectionPositionArray: React.RefObject<HTMLDivElement>[],
        startIndex: number,
        endIndex: number,
    ): number => {
        if (startIndex === endIndex) return startIndex
        else if (startIndex === endIndex - 1) {
            const startOffsetTop = sectionPositionArray?.[startIndex]?.current?.offsetTop ?? 0
            const endOffsetTop = sectionPositionArray?.[endIndex]?.current?.offsetTop ?? 0
            const extendHeight = getExtendHeight() ?? 0
            if (
                Math.abs(startOffsetTop + extendHeight - currentPosition) <
                Math.abs(endOffsetTop + extendHeight - currentPosition)
            )
                return startIndex
            else return endIndex
        } else {
            const maxScrollHeight = scrollMaxValue()
            if (currentPosition >= maxScrollHeight - 10) return endIndex
            const nextNearest = ~~((startIndex + endIndex) / 2)
            const startOffsetTop = sectionPositionArray?.[nextNearest]?.current?.offsetTop ?? 0
            const endOffsetTop = sectionPositionArray?.[nextNearest + 1]?.current?.offsetTop ?? 0
            const extendHeight = getExtendHeight() ?? 0
            const a = Math.abs(startOffsetTop + extendHeight - currentPosition)
            const b = Math.abs(endOffsetTop + extendHeight - currentPosition)
            if (a < b) {
                return nearestIndex(currentPosition, sectionPositionArray, startIndex, nextNearest)
            } else {
                return nearestIndex(currentPosition, sectionPositionArray, nextNearest, endIndex)
            }
        }
    }

    const handlePageScroll = useCallback(() => {
        if (!refs?.length) return
        const newIndex = nearestIndex(window.scrollY, refs, 0, refs.length - 1)
        setIndex(newIndex)
    }, [refs])

    useIsomorphicLayoutEffect(() => {
        window.addEventListener('scroll', handlePageScroll)
        return () => window.removeEventListener('scroll', handlePageScroll)
    }, [refs])

    return index
}
