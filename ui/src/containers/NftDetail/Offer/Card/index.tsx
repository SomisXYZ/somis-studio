import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { DateTime } from 'luxon'
import { AbovePriceSection, Coin, Flex, Typography } from '~/components'
import { AddressCard } from '~/containers'
import { User } from '~/gql/generated/graphql'

export interface MockOffer {
    id: string
    nftAddress: string
    offerer: User
    price: string
    expiresAt: string
}

export const OfferCard = ({
    offer,
    isLast = false,
    totalMarketCap,
}: {
    offer?: MockOffer
    isLast: boolean
    totalMarketCap: string
}) => {
    const { t } = useTranslation('common')
    const expiresAt = DateTime.fromISO(offer?.expiresAt ?? '').toFormat('dd LLL yyyy HH:mm:ss') ?? '--'
    return (
        <Flex
            gap={3}
            className={clsx(
                'relative',
                !isLast && 'border-b',
                'max-xl:flex-col',
                'max-xl:gap-2',
                'max-xl:py-4',
                'max-xl:mx-4',
                'xl:py-6',
                'xl:mx-4',
                'color-border',
            )}
        >
            <Flex justifyContent="start" flexDirection="column" className="flex-warp flex-1" gap={2}>
                {offer?.price && (
                    <Flex gap={4}>
                        <Coin number={offer?.price ?? 0} className={clsx('min-w-[3.875rem]')} />
                        {totalMarketCap && (
                            <AbovePriceSection
                                nftPrice={offer?.price ?? ''}
                                totalMarketCap={totalMarketCap}
                                statusColor={true}
                                regular
                                variant="sm"
                            />
                        )}
                    </Flex>
                )}
                <Flex gap={3}>
                    <AddressCard address={offer?.offerer?.address ?? '--'} type="from" />
                </Flex>
            </Flex>
            <Flex flexDirection="column" justifyContent="between">
                <Typography color="secondary" regular variant="sm" align="right" className="max-xl:text-left">
                    {t('offer.expiresAt', { date: expiresAt })}
                </Typography>
            </Flex>
        </Flex>
    )
}
