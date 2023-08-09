import clsx from 'clsx'
import { Flex, Typography } from '~/components'
import { handleVol24DeltaText } from '~/utils/helpers'

export const Vol24DeltaSection = ({
    vol24Delta,
    loading = false,
    bold = false,
    style = 'normal',
    className,
}: {
    vol24Delta: string
    loading?: boolean
    bold?: boolean
    style?: 'normal' | 'badge'
    className?: string
}) => {
    const isEmpty = vol24Delta === '--' || loading || ''
    const isNegative = vol24Delta.startsWith('-')

    const color = () => {
        if (isEmpty) {
            return 'default'
        }
        if (isNegative) {
            return 'error'
        }
        return 'success'
    }

    const bgColor = () => {
        if (isEmpty) {
            return 'bg-light-secondary'
        }
        if (isNegative) {
            return 'bg-light-error'
        }
        return 'bg-light-success'
    }

    return style === 'normal' || isEmpty ? (
        <Typography
            font={'jbm'}
            variant="md"
            color={color()}
            skeleton={loading}
            regular={!bold}
            bold={bold}
            className={className}
        >
            {vol24Delta ? handleVol24DeltaText(vol24Delta) : '--'}
        </Typography>
    ) : (
        <Flex
            justifyContent="center"
            alignItems="center"
            className={clsx(bgColor(), 'px-2', 'py-1', 'rounded-sm', className)}
        >
            <Typography
                font={'jbm'}
                variant="title"
                skeleton={loading}
                regular={!bold}
                bold={bold}
                className={clsx('text-white')}
            >
                {vol24Delta ? handleVol24DeltaText(vol24Delta) : '--'}
            </Typography>
        </Flex>
    )
}
