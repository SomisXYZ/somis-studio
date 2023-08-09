import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import { Button, Flex, IconType, Link } from '~/components'
import { NumberColumn } from '~/components/NumberColumn'
import { formatAddress } from '~/utils/helpers'
import { explorerAddressLink } from '~/utils/sui'
import { useUserPageContext } from '../../context'
import { ProfileEditModal } from '../../ProfileEditModal'
import { UserName } from '../UserName'

interface Props {
    loading: boolean
    editable: boolean
}

export const UserDetail = ({ loading, editable }: Props) => {
    const { t } = useTranslation('user')
    const { user } = useUserPageContext()
    const [open, setOpen] = useState<boolean>(false)

    return (
        <Flex gap={4} flexDirection={'column'} className={clsx('lg:flex-row', 'w-full')}>
            <Flex flex={1} gap={4} flexDirection={'column'} className={clsx('max-lg:gap-5', 'w-full')}>
                <Flex gap={4} flexDirection={'column'} className={clsx('max-lg:gap-2', 'md:gap-3', 'max-lg:w-full')}>
                    <UserName user={user} loading={loading} />
                    {editable ? (
                        <Button
                            data-name="edit-profile-button"
                            title={'Edit Profile'}
                            variant="tertiary"
                            className={clsx('max-w-fit')}
                            icon={IconType.edit}
                            iconSize="small"
                            onClick={() => {
                                setOpen(true)
                            }}
                        />
                    ) : (
                        <Link
                            title={user?.address ? formatAddress(user?.address, 5, 3) : '--'}
                            url={explorerAddressLink(user?.address)}
                            skeleton={loading}
                            skeletonLength={10}
                        />
                    )}
                </Flex>
                <Flex gap={10} className={clsx()}>
                    <NumberColumn title={t('header.title.items')} skeleton={loading} number={user?.ownedItems} />
                    <NumberColumn title={t('header.title.listed')} skeleton={loading} number={user?.listed} />
                    <NumberColumn title={t('header.title.unlisted')} skeleton={loading} number={user?.unlisted} />
                    <NumberColumn title={t('header.title.estValue')} coin skeleton={loading} number={user?.estValue} />
                </Flex>
            </Flex>
            {/* <Flex flex={1} gap={4} flexDirection={'column'}>
                        <Flex gap={2} className={clsx('max-lg:hidden')}>
                            <LinkIcon icon={IconType.website} url={''} />
                            <LinkIcon icon={IconType.discord} url={''} />
                            <LinkIcon icon={IconType.twitter} url={''} />
                        </Flex>
                    </Flex> */}
            <ProfileEditModal show={open} onClose={() => setOpen(false)} />
        </Flex>
    )
}
