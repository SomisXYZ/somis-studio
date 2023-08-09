import { Flex, Typography } from '~/components'
import clsx from 'clsx'
import { formatAddress } from '~/utils/helpers'
import { Card } from '~/components/Card'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { useAuthState } from '~/contexts/auth'
import { ProfileImage } from '../ProfileImage'

export const ProfileCard = ({ onClick }: { onClick?: () => void }) => {
    const { t } = useTranslation('common')
    const { user } = useAuthState()
    return (
        user && (
            <Link href="/profile" className={clsx('group')} onClick={onClick}>
                <Card>
                    <ProfileImage user={user} />
                    <Flex flexDirection="column" gap={1}>
                        <Typography variant="b4" color="default" font="jbm" bold>
                            {formatAddress(user.address, 7, 3)}
                        </Typography>
                        <Typography bold variant="sm" hover color="primary">
                            {t('profileCard.button.viewProfile')}
                        </Typography>
                    </Flex>
                </Card>
            </Link>
        )
    )
}
