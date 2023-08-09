import clsx from 'clsx'
import { Card, Coin, Flex, Typography } from '~/components'
import { NftAttribute } from '~/gql/generated/graphql'
import { formatNumber } from '~/utils/helpers'

export const AttributeCard = ({ attribute }: { attribute: NftAttribute }) => {
    return (
        <Card
            justifyContent="between"
            flexDirection="column"
            gap={4}
            flex="auto"
            hover
            name="attribute"
            variant="secondary"
        >
            <Flex flexDirection="column" gap={1} className={clsx('overflow-hidden')}>
                <Typography variant="sm" font="jbm" color="default" regular transform="uppercase">
                    {attribute?.name}
                </Typography>
                <Typography variant="md" bold font="sg" color="default">
                    {attribute?.value}
                </Typography>
            </Flex>
            <Flex justifyContent="between">
                <Typography variant="sm" color="secondary" regular font="jbm">
                    {attribute?.percentage ? `${formatNumber(attribute.percentage * 100, 2)}%` : '--%'}
                </Typography>
                {attribute.floor && attribute.floor !== '0' && (
                    <Coin variant="sm" bold font="jbm" number={attribute.floor ?? 0} />
                )}
            </Flex>
        </Card>
    )
}
