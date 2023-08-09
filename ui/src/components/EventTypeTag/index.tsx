import clsx from 'clsx'
import { NftEventType } from '~/gql/generated/graphql'
import { enumFromStringValue } from '~/utils/helpers'
import { Flex } from '../Flex'
import { Icon, IconType } from '../Icon'
import { Typography } from '../Typography'
import useTranslation from 'next-translate/useTranslation'

export const EventTypeTag = ({ type }: { type: string | NftEventType }) => {
    if (enumFromStringValue(NftEventType, type) === undefined) return <></>

    const { t } = useTranslation('common')

    const icon = (eventType: NftEventType) => {
        switch (eventType) {
            case NftEventType.Buy:
            case NftEventType.List:
                return IconType.circlePlus
            case NftEventType.Offer:
            case NftEventType.AcceptOffer:
                return IconType.offer
            case NftEventType.CancelOffer:
            case NftEventType.CancelOrder:
                return IconType.circleCross
            case NftEventType.Mint:
                return IconType.star
            case NftEventType.Burn:
            case NftEventType.Transfer:
            default:
                return IconType.transfer
        }
    }

    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            gap={2}
            className={clsx('rounded-[0.25rem]', 'pr-3', 'max-h-[2rem]')}
        >
            <Icon
                icon={icon(enumFromStringValue(NftEventType, type) as NftEventType)}
                colorClass="fill-light-secondary"
            />
            <Typography variant="sm" bold font="jbm" color="secondary" transform="uppercase">
                {t(`nftEvent.${type}`)}
            </Typography>
        </Flex>
    )
}
