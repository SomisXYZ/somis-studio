import useTranslation from 'next-translate/useTranslation'
import { Flex } from '~/components'
import { ItemCollapse } from '~/containers/ItemCollapse'
import { NftEvent, NftEventType } from '~/gql/generated/graphql'
import { useNftDetailPageContext } from '../../context'
import { EventCard, TypeLength } from '../Card'

export const EventCollapse = () => {
    const { t } = useTranslation('common')
    const { nft } = useNftDetailPageContext()
    if (!nft?.events || nft?.events?.length === 0) return <></>
    const eventTypeLength = nft?.events?.reduce((acc, cur) => {
        if ([NftEventType.AcceptOffer, NftEventType.CancelOrder, NftEventType.CancelOffer].includes(cur.type)) {
            return 'large'
        } else if (cur.type === NftEventType.Transfer && acc !== 'large') {
            return 'medium'
        } else {
            return acc
        }
    }, 'small')
    return (
        <ItemCollapse header={t('nft.activity.title')}>
            <Flex flexDirection="column" className="w-full" alignContent="center">
                {nft?.events?.map((event, key) => (
                    <EventCard
                        typeLength={eventTypeLength as TypeLength | undefined}
                        event={event as NftEvent}
                        key={event.id}
                        isLast={key === nft?.events?.length - 1}
                        totalMarketCap={nft?.collection?.stats?.floor ?? ''}
                    />
                ))}
            </Flex>
        </ItemCollapse>
    )
}
