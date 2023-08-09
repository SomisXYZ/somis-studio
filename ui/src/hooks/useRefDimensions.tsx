import { useState, useEffect } from 'react'

export const useRefDimensions = (ref: React.RefObject<HTMLElement>) => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    useEffect(() => {
        if (ref.current) {
            const { current } = ref
            const boundingRect = current.getBoundingClientRect()
            const { width, height } = boundingRect
            setWidth(Math.round(width))
            setHeight(Math.round(height))
        }
    }, [ref])
    return {
        width,
        height,
    }
}
