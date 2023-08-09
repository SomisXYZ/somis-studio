import clsx from 'clsx'
import { Flex } from '~/components'
import { Nft } from '~/gql/generated/graphql'
import { useBreakpoint } from '~/hooks'
import { AttributeCollapse } from '../../Attribute/Collapse'
import { useNftDetailPageContext } from '../../context'
import { EventCollapse } from '../../Event/Collapse'
import { NftInfo } from '../../Info'
import { MockOffer } from '../../Offer/Card'
import { OfferCollapse } from '../../Offer/Collapse'
import { TokenDetail } from '../../TokenDetail'
import { NftTransactionCard } from '../../TransactionCard'

export const NftContentRight = ({ offers }: { offers: MockOffer[] }) => {
    const { breakpoint } = useBreakpoint()
    const { nft } = useNftDetailPageContext()

    return (
        <Flex flexDirection="column" gap={6} className={clsx('lg:max-w-[60%]', '2xl:max-w-[auto]', 'lg:basis-[120%]')}>
            <Flex flexDirection="column" gap={6} className={clsx('sm:pt-4')}>
                <NftInfo />
                <NftTransactionCard />
            </Flex>
            <Flex className={clsx('max-lg:hidden')}>
                <TokenDetail nft={nft ? (nft as Nft) : null} />
            </Flex>
            {['sm', 'md', 'lg'].includes(breakpoint) && <AttributeCollapse />}
            <OfferCollapse offers={offers} />
            <EventCollapse />
        </Flex>
    )
}
