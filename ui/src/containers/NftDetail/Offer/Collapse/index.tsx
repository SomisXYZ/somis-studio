import useTranslation from 'next-translate/useTranslation'
import { Flex } from '~/components'
import { ItemCollapse } from '~/containers/ItemCollapse'
import { useNftDetailPageContext } from '../../context'
import { MockOffer, OfferCard } from '../Card'

export const OfferCollapse = ({ offers }: { offers: MockOffer[] }) => {
    const { t } = useTranslation('common')
    const { nft } = useNftDetailPageContext()
    if (!offers || offers?.length === 0) return <></>

    return (
        <ItemCollapse header={t('nft.offers.title')}>
            <Flex flexDirection="column" className="w-full" alignContent="center">
                {offers.map((offer, key) => (
                    <OfferCard
                        offer={offer as MockOffer}
                        key={key}
                        isLast={key === offers.length - 1}
                        totalMarketCap={nft?.collection?.stats?.floor ?? ''}
                    />
                ))}
            </Flex>
        </ItemCollapse>
    )
}
