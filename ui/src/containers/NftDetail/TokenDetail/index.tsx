import useTranslation from 'next-translate/useTranslation'
import { memo } from 'react'
import { Flex, Typography, Link } from '~/components'
import { ItemCollapse } from '~/containers/ItemCollapse'
import { useAppState } from '~/contexts/app'
import { Nft } from '~/gql/generated/graphql'
import { covertBpsToPercentage, formatAddress } from '~/utils/helpers'
import { explorerObjectLink } from '~/utils/sui'

export const TokenDetail = memo(({ nft }: { nft: Nft | null }) => {
    const { t } = useTranslation('common')
    const { config } = useAppState()
    const ColumnWrapper = ({ children }: { children: React.ReactNode }) => (
        <Flex justifyContent="between" className="p-2">
            {children}
        </Flex>
    )

    return (
        <ItemCollapse header={t('nft.tokenDetails.title')}>
            <Flex flexDirection="column" className="w-full p-3" alignContent="center">
                <ColumnWrapper>
                    <Typography variant="md" font="jbm" regular transform="capitalize" color="secondary">
                        {t('nft.tokenDetails.mintAddress')}
                    </Typography>
                    <Link title={formatAddress(nft?.address ?? '', 5, 3)} url={explorerObjectLink(nft?.address)} />
                </ColumnWrapper>
                <ColumnWrapper>
                    <Typography variant="md" font="jbm" regular transform="capitalize" color="secondary">
                        {t('nft.tokenDetails.onChainCollection')}
                    </Typography>
                    <Link
                        title={formatAddress(nft?.collection?.address ?? '', 5, 3)}
                        url={explorerObjectLink(nft?.collection?.address)}
                    />
                </ColumnWrapper>
                <ColumnWrapper>
                    <Typography variant="md" font="jbm" regular transform="capitalize" color="secondary">
                        {t('nft.tokenDetails.creatorRoyalties')}
                    </Typography>
                    <Typography variant="md" font="jbm" bold transform="capitalize" skeleton={!nft}>
                        {nft?.collection?.royalty ? `${(nft.collection.royalty / 100).toFixed() ?? 0}%` : '--'}
                    </Typography>
                </ColumnWrapper>
                <ColumnWrapper>
                    <Typography variant="md" font="jbm" regular transform="capitalize" color="secondary">
                        {t('nft.tokenDetails.platformFee')}
                    </Typography>
                    <Typography variant="md" font="jbm" bold transform="capitalize" skeleton={!nft}>
                        {`${covertBpsToPercentage(config?.commissionBps)}%`}
                    </Typography>
                </ColumnWrapper>
                <ColumnWrapper>
                    <Typography variant="md" font="jbm" regular transform="capitalize" color="secondary">
                        {t('nft.tokenDetails.listBiddingCancel')}
                    </Typography>
                    <Typography variant="md" font="jbm" bold transform="capitalize" skeleton={!nft}>
                        {t('nft.tokenDetails.free')}
                    </Typography>
                </ColumnWrapper>
            </Flex>
        </ItemCollapse>
    )
})

TokenDetail.displayName = 'TokenDetail'
