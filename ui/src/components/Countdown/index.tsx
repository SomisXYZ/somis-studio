import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { useCountdown } from '~/hooks'
import { Flex } from '../Flex'
import { Typography, TypographyProps } from '../Typography'
import { JetBrainsMono } from '../Typography/fonts'
import { ReactNode } from 'react'

export interface CountdownProps extends TypographyProps {
    targetDate: string
    prefixContent?: ReactNode
    expiredText?: string
}

export const Countdown = ({
    targetDate,
    prefixContent,
    expiredText,
    variant = 'sm',
    ...rest
}: CountdownProps): React.ReactElement => {
    const { t } = useTranslation('common')
    const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate)

    return (
        <Flex>
            {isExpired && expiredText ? (
                <Typography variant={variant} bold {...rest}>
                    {expiredText}
                </Typography>
            ) : (
                <>
                    {prefixContent}
                    <Flex
                        gap={1}
                        className={clsx(
                            'text-white',
                            JetBrainsMono.className,
                            'text-3xl',
                            'md:text-4xl',
                            'lg:text-5xl',
                            'xl:text-6xl',
                            '2xl:text-7xl',
                        )}
                    >
                        {days && (
                            <Typography variant={variant} bold {...rest}>
                                {t('countdown.days', { days: days })}
                            </Typography>
                        )}
                        <Typography variant={variant} bold {...rest}>
                            {t('countdown.hours', { hours: hours ?? '00' })}
                        </Typography>
                        <Typography variant={variant} bold {...rest}>
                            {t('countdown.minutes', { minutes: minutes ?? '00' })}
                        </Typography>
                        <Typography variant={variant} bold {...rest}>
                            {t('countdown.seconds', { seconds: seconds ?? '00' })}
                        </Typography>
                    </Flex>
                </>
            )}
        </Flex>
    )
}
