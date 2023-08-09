import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { Coin, Flex, Link, Typography } from '~/components'
import { isFeatureEnabled } from '~/utils/helpers'
import { useNftDetailPageContext } from '../context'

export const CollectionInfo = () => {
    const { t } = useTranslation('common')
    const { nft } = useNftDetailPageContext()
    const isEnableCollection = isFeatureEnabled('collections')
    return (
        <>
            <Link
                variant="h4"
                font="sg"
                color="quaternary"
                url={isEnableCollection ? `/collection/${nft?.collection?.address}` : '#'}
                title={nft?.collection?.name ?? '--'}
                bold
                skeletonLength={50}
                showIcon={false}
                className={clsx('w-full')}
            />
            <Flex gap={3}>
                <Typography regular color="secondary">
                    {t('nft.globalFloor')}
                </Typography>
                <Coin number={isEnableCollection ? nft?.collection?.stats?.floor ?? 0 : '0'} />
            </Flex>
        </>
    )
}
