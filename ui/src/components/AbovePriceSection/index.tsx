import useTranslation from 'next-translate/useTranslation'
import { Typography, TypographyProps } from '~/components'
import { formatNumber, getNftPriceBelowOrAboveMarketCap } from '~/utils/helpers'

export const AbovePriceSection = ({
    nftPrice,
    totalMarketCap,
    color,
    statusColor = true,
    skeleton,
    bold,
    font = 'jbm',
    variant = 'md',
    ...props
}: {
    nftPrice: string
    totalMarketCap: string
    statusColor?: boolean
} & TypographyProps) => {
    const { t } = useTranslation('common')

    const nftPricePercent = getNftPriceBelowOrAboveMarketCap(parseFloat(nftPrice) ?? 0, parseFloat(totalMarketCap) ?? 0)
    const contentKey = nftPricePercent && nftPricePercent > 0 ? 'floorDifference.above' : 'floorDifference.below'
    const content = nftPricePercent ? t(contentKey, { percent: formatNumber(Math.abs(nftPricePercent), 2) }) : '--'
    return (
        <Typography
            font={font}
            variant={variant}
            color={statusColor ? (nftPricePercent > 0 ? 'success' : 'error') : color}
            skeleton={skeleton}
            bold={bold}
            {...props}
        >
            {content}
        </Typography>
    )
}
