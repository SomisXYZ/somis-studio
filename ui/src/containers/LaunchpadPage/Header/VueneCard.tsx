import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { Card, Coin, Flex, Typography } from '~/components'
import { useCountdown } from '~/hooks'
import { Countdown } from '~/components/Countdown'

export const VueneCard = ({ venue, isSelected, whitelist, onClick }: any) => {
    const { t } = useTranslation('launchpad')
    const { isExpired } = useCountdown(venue.startTime)
    return (
        <Card
            id={`venue-card-${venue.address}`}
            fullWidth
            justifyContent="between"
            padding={false}
            border={!isSelected}
            onClick={() => {
                if (whitelist?.canMint && isExpired) {
                    onClick()
                }
            }}
            className={clsx(
                'px-6',
                'py-6',
                'border-2',
                whitelist?.canMint && isExpired ? 'cursor-pointer' : ['opacity-50', 'cursor-not-allowed'],
                isSelected && ['color-border-gradient', 'color-border-gradient-shadow'],
            )}
            alignItems="end"
        >
            <Flex flexDirection="column" gap={2}>
                <Typography variant="lg" bold transform="uppercase">
                    {venue.name}
                </Typography>
                <Flex gap={3} alignItems="end">
                    <Typography variant="sm" color="gray" bold transform="uppercase">
                        {t('mintPrice')}
                    </Typography>
                    <Coin bold number={venue.price} showZero />
                </Flex>
            </Flex>
            <Flex gap={3} justifyContent="start" alignItems="end">
                {venue.startTime ? (
                    <>
                        <Typography variant="lg" bold>
                            <Countdown
                                prefixContent={
                                    <Typography variant="sm" color="gray" bold transform="uppercase" className="mr-3">
                                        {t('startsIn')}
                                    </Typography>
                                }
                                expiredText="Live Now"
                                targetDate={venue.startTime}
                            />
                        </Typography>
                    </>
                ) : (
                    <Typography variant="sm" color="gray" bold transform="uppercase">
                        {t('tbc')}
                    </Typography>
                )}
            </Flex>
        </Card>
    )
}
