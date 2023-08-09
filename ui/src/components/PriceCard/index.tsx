import { Card, Flex, Icon, IconType, Typography } from '~/components'
import { formatNumber } from '~/utils/helpers'

export interface Price {
    amount: string
    currency: string
    rate: number | null
    type: 'sui' | 'somis'
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    price: Price
}

export const PriceCard = ({ price }: Props) => {
    const getIcon = (): IconType => {
        switch (price.type) {
            case 'sui':
                return IconType.sui
            case 'somis':
                return IconType.somis
        }
    }
    const numberAmount = Number(price.amount) || 0
    return (
        <Card justifyContent="between" alignContent="center" alignItems="center" className="w-full">
            <Icon icon={getIcon()} />
            <Flex flexDirection="column" justifyContent="end" alignItems="end" gap={1}>
                <Typography variant="md" color="default" font="jbm">
                    {`${formatNumber(numberAmount, 9)} ${price.currency}`}
                </Typography>
                <Typography variant="sm" color="secondary" font="jbm">
                    {`$${price.rate ? formatNumber(numberAmount * price.rate, 2) : '--'}`}
                </Typography>
            </Flex>
        </Card>
    )
}
