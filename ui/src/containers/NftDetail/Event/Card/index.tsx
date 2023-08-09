import clsx from 'clsx'
import Link from 'next/link'
import { AbovePriceSection, Card, Coin, DateAgoText, EventTypeTag, Flex, Icon, IconType } from '~/components'
import { AddressCard } from '~/containers'
import { NftEvent, NftEventType } from '~/gql/generated/graphql'
import { explorerTransactionLink } from '~/utils/sui'

export type TypeLength = 'large' | 'medium' | 'small'

export const EventCard = ({
    event,
    isLast = false,
    totalMarketCap,
    typeLength = 'medium',
}: {
    event?: NftEvent
    isLast: boolean
    totalMarketCap: string
    typeLength?: TypeLength
}) => {
    const showFromCard = event?.type !== NftEventType.Mint
    const showToCard =
        event?.type &&
        [NftEventType.Buy, NftEventType.Transfer, NftEventType.Mint, NftEventType.FulfillCollectionBid].includes(
            event?.type,
        )
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
            <Flex
                justifyContent="start"
                alignItems="start"
                className={clsx(
                    'max-xl:w-full',
                    typeLength === 'large' && 'min-w-[9rem]',
                    typeLength === 'medium' && 'min-w-[6.5rem]',
                    typeLength === 'small' && 'min-w-[5rem]',
                )}
            >
                <EventTypeTag type={event?.type ? (event?.type as NftEventType) : ''} />
            </Flex>
            <Flex justifyContent="start" flexDirection="column" className="flex-warp flex-1" gap={2}>
                {event?.price && (
                    <Flex gap={4}>
                        <Coin number={event?.price ?? 0} decimal={9} className={clsx('min-w-[3.875rem]')} />
                        <AbovePriceSection
                            nftPrice={event?.price ?? ''}
                            totalMarketCap={totalMarketCap}
                            statusColor={true}
                            regular
                            variant="sm"
                        />
                    </Flex>
                )}
                <Flex gap={3}>
                    {showFromCard && <AddressCard address={event?.originOwner?.address ?? '--'} type="from" />}
                    {showToCard && <AddressCard address={event?.newOwner?.address ?? '--'} type="to" />}
                </Flex>
            </Flex>
            <Flex flexDirection="column" justifyContent="between">
                <DateAgoText
                    date={event?.createdAt}
                    color="secondary"
                    regular
                    variant="sm"
                    align="right"
                    className="max-xl:text-left"
                />
                <Flex
                    justifyContent="end"
                    alignItems="end"
                    className={clsx('max-xl:absolute', 'max-xl:top-4', 'max-xl:right-0', 'relative')}
                >
                    <Link href={explorerTransactionLink(event?.txId ?? undefined) ?? ''}>
                        <Card hover padding={false} className={clsx('p-2', 'rounded-[0.25rem]')} variant="secondary">
                            <Icon icon={IconType.externalLink} />
                        </Card>
                    </Link>
                </Flex>
            </Flex>
        </Flex>
    )
}
