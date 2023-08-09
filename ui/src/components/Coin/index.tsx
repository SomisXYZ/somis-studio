import { Typography, TypographyProps } from '../Typography'
import { kFormatter } from '~/utils/helpers'
import clsx from 'clsx'
import { useFormatCoin } from '~/hooks/useFormatCoin'
import { Icon, IconType } from '../Icon'

interface Props extends TypographyProps {
    number: number | string
    currency?: 'sui' | 'mist'
    decimal?: number
    showZero?: boolean
    showSign?: boolean
}

export const Coin = ({
    number,
    variant = 'md',
    currency = 'sui',
    className,
    showSign = false,
    showZero = false,
    decimal = 2,
    ...ref
}: Props) => {
    const formatNumber = (number: number | string) => {
        if (typeof number === 'string') {
            return isNaN(parseFloat(number)) ? 0 : parseFloat(number)
        }
        return number
    }
    const formettedNumber = formatNumber(number)
    const displaySign = formettedNumber > 0 ? '+' : formettedNumber < 0 ? '-' : ''
    const getSizeByVariant = () => {
        switch (variant) {
            case 'h1':
                return 20
            case 'h2':
                return 18
            case 'h3':
                return 16
            case 'h4':
                return 14
            case 'h5':
                return 12
            case 'b5':
                return 22
            case 'xl':
                return 18
            case 'md':
                return 13
            case 'sm':
                return 12
            default:
                return 16
        }
    }
    const getColor = () => {
        if (!showSign) return
        if (formettedNumber > 0) {
            return 'success'
        }
        if (formettedNumber < 0) {
            return 'error'
        }
    }
    const { roundedAmount: formattedBalance } =
        currency === 'mist'
            ? useFormatCoin(number)
            : {
                  roundedAmount: kFormatter(formettedNumber, decimal),
              }
    const emptyString = showZero ? '0' : '--'
    return (
        <Typography
            variant={variant}
            color={getColor()}
            className={clsx('flex', 'gap-1', 'items-center', className)}
            {...ref}
        >
            <span className={clsx(showSign && ['flex', 'gap-1'])}>
                <span>{showSign && displaySign}</span>
                {formattedBalance === '0'
                    ? emptyString
                    : formattedBalance.replace(showSign ? '-' : '', '') ?? emptyString}
            </span>
            <Icon
                icon={IconType.sui}
                beforeInjection={(svg) => {
                    const size = getSizeByVariant()
                    svg.classList.add('fill-sui')
                    svg.setAttribute('width', `${size}`)
                    svg.setAttribute('height', `${size}`)
                }}
                className={clsx('relative', 'top-0', 'my-auto', 'bottom-0')}
            />
        </Typography>
    )
}
