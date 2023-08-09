import useTranslation from 'next-translate/useTranslation'
import { Card, Typography } from '~/components'
import { formatAddress } from '~/utils/helpers'

export const AddressCard = ({ type, address }: { type: 'from' | 'to'; address: string }) => {
    const { t } = useTranslation('common')
    return (
        <Card
            flexDirection="column"
            className="min-w-[157px] rounded-[0.25rem] py-3 px-2"
            padding={false}
            gap={1}
            variant="secondary"
            hover
        >
            <Typography variant="sm" font="jbm" color="secondary" regular transform="uppercase">
                {t(`${type}`)}
            </Typography>
            <Typography variant="sm" font="jbm" regular transform="uppercase">
                {formatAddress(address, 5, 3)}
            </Typography>
        </Card>
    )
}
