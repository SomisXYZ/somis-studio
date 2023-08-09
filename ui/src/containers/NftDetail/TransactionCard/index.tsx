import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { AbovePriceSection, Card, Coin, Flex, Skeleton, Typography } from '~/components'
import { useNftDetailPageContext } from '../context'
import { CommissionMarketplaceIcon } from '~/components/CommissionMarketplaceIcon'

export const NftTransactionCard = () => {
    const { t } = useTranslation('common')
    const { nft, isRefetching, status, price, orderCommission } = useNftDetailPageContext()

    const skeleton = isRefetching && status === null

    return (
        <Card fullWidth flex="auto" flexDirection="column" border className={clsx('p-6', 'lg:flex-row')}>
            <Flex flexDirection="column" justifyContent="between" flex="auto" gap={2}>
                <Flex gap={2} flexDirection="column" flex="auto">
                    <Typography variant="b2" font="jbm" bold transform="uppercase">
                        {t('nft.currentPrice')}
                    </Typography>
                    <Flex gap={3} alignItems="center">
                        <Coin
                            data-name="current-price"
                            variant="b5"
                            number={price ?? 0}
                            bold
                            skeleton={isRefetching}
                            skeletonLength={30}
                        />
                        <CommissionMarketplaceIcon commissionMarketplaceAddress={orderCommission?.beneficiary} />
                    </Flex>
                    <AbovePriceSection
                        font="jbm"
                        color="secondary"
                        nftPrice={price?.toString() ?? ''}
                        totalMarketCap={nft?.collection?.stats?.floor ?? ''}
                        statusColor={false}
                        skeleton={isRefetching}
                        skeletonLength={20}
                    />
                </Flex>
            </Flex>
            <Flex
                flexDirection="column"
                gap={4}
                flex="auto"
                justifyContent="start"
                alignItems="start"
                className={clsx('lg:max-w-[240px]', 'w-full')}
            ></Flex>
        </Card>
    )
}
