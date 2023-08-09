import { Typography, TypographyProps } from '../Typography'
import { DateTime } from 'luxon'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export const DateAgoText = ({
    date,
    live = true,
    short = false,
    variant = 'sm',
    ...props
}: { date: string; short?: boolean; live?: boolean } & TypographyProps) => {
    const { t } = useTranslation('common')
    const key = short ? 'shortDateAgo' : 'dateAgo'
    const { inView, ref } = useInView()
    const [diff, setDiff] = useState(
        DateTime.now().diff(DateTime.fromISO(date), ['years', 'months', 'days', 'hours', 'minutes', 'seconds']),
    )

    useEffect(() => {
        setDiff(DateTime.now().diff(DateTime.fromISO(date), ['years', 'months', 'days', 'hours', 'minutes', 'seconds']))
    }, [date])

    const content = () => {
        try {
            if (!DateTime.fromISO(date).isValid || !diff) return '--'
            if (diff.years > 0) return t(`${key}.years`, { years: diff.years.toFixed(0) })
            if (diff.months > 0) return t(`${key}.months`, { months: diff.months.toFixed(0) })
            if (diff.days > 0) return t(`${key}.days`, { days: diff.days.toFixed(0) })
            if (diff.hours > 0) return t(`${key}.hours`, { hours: diff.hours.toFixed(0) })
            if (diff.minutes > 0) return t(`${key}.minutes`, { minutes: diff.minutes.toFixed(0) })
            if (diff.seconds > 0) return t(`${key}.seconds`, { seconds: diff.seconds.toFixed(0) })
            return '--'
        } catch (error) {
            console.log(error)
            return '--'
        }
    }

    useEffect(() => {
        if (live && inView) {
            const interval = setInterval(() => {
                const newDiff = DateTime.now().diff(DateTime.fromISO(date), [
                    'years',
                    'months',
                    'days',
                    'hours',
                    'minutes',
                    'seconds',
                ])
                setDiff(newDiff)
            }, 1000 * 1)
            return () => clearInterval(interval)
        }
    }, [live, date, inView])

    return (
        <Typography variant={variant} {...props} ref={ref}>
            {content()}
        </Typography>
    )
}
