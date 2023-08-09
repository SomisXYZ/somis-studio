import { useEffect, useState } from 'react'

export const useCountdown = (
    targetDate: string,
): {
    days: string | null
    hours: string | null
    minutes: string | null
    seconds: string | null
    isExpired: boolean
} => {
    const countDownDate = new Date(targetDate).getTime()

    const [countDown, setCountDown] = useState(countDownDate - new Date().getTime())

    useEffect(() => {
        if (isNaN(countDownDate)) {
            return
        }

        if (countDownDate - new Date().getTime() > 0) {
            const interval = setInterval(() => {
                setCountDown(countDownDate - new Date().getTime())
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [countDownDate])

    return getReturnValues(countDown)
}

const autoSupplement = (number: number | null): string | null => {
    return number ? number.toString().padStart(2, '0') : null
}

const getReturnValues = (countDown: number) => {
    const days =
        Math.floor(countDown / (1000 * 60 * 60 * 24)) >= 0 ? Math.floor(countDown / (1000 * 60 * 60 * 24)) : null
    const hours =
        Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) >= 0
            ? Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            : null
    const minutes =
        Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60)) >= 0
            ? Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
            : null
    const seconds =
        Math.floor((countDown % (1000 * 60)) / 1000) >= 0 ? Math.floor((countDown % (1000 * 60)) / 1000) : null

    return {
        days: autoSupplement(days),
        hours: autoSupplement(hours),
        minutes: autoSupplement(minutes),
        seconds: autoSupplement(seconds),
        isExpired: isNaN(countDown) ? true : countDown <= 0,
    }
}
