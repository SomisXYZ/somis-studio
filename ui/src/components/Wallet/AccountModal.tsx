// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Dialog } from '@headlessui/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import authContext from '~/contexts/auth'
import { Icon, IconType } from '../Icon'
import { Typography } from '../Typography'
import { styled } from './stitches'
import { Content, Body, CloseButton } from './utils/LoginDropDownDialog'
import walletKit from './WalletKitContext'
import { Flex } from '~/components'
import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { DarkModeToggle } from '~/containers/DarkModeToggle'
import { ProfileImage } from '~/containers/ProfileImage'
import { useOnScroll } from '~/hooks'
interface AccountModalProps {
    open: boolean
    onClose(): void
}

const Account = styled('div', {
    fontSize: '$md',
    color: '$fff',
    fontWeight: '$title',
    paddingTop: '7px',
    paddingBottom: '12px',
    font: 'jbm',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    '&:focus-visible': {
        outline: 'none',
    },
})

const ButtonGroup = styled('div', {
    display: 'flex',
    gap: 15,
    width: '100%',
    flexDirection: 'column',
})

export function AccountModal({ open, onClose }: AccountModalProps) {
    const { currentAccount } = walletKit.useWalletKit()
    const { logout, balance, user } = authContext.useAuthState()
    const [showProfileButton, setShowProfileButton] = useState(false)
    const [bannerVisible, setBannerVisible] = useState(true)
    const account = currentAccount?.address || ''
    const { t } = useTranslation('common')
    const { scrollTop } = useOnScroll()

    const { theme } = useTheme()

    function isDark() {
        if (theme == 'dark') {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        setShowProfileButton(user?.address !== null)
    }, [user])

    useEffect(() => {
        const position = window.pageYOffset
        //Extra padding for dropdown menu
        // setBannerVisible(position > 32)
    }, [scrollTop])

    if (!user) {
        return <></>
    }

    return (
        <Dialog as="div" open={open} onClose={onClose} className="max-xl:hidden">
            <Content css={bannerVisible ? { paddingTop: 68 } : { paddingTop: 100 }}>
                <Body
                    css={{
                        padding: '$4',
                        minWidth: '250px',
                        background: isDark() ? '#141414' : 'white',
                        border: isDark() ? '1px solid #303030' : '1px solid none',
                    }}
                >
                    <Link
                        href="/profile"
                        onClick={() => {
                            onClose()
                        }}
                        className="outline-none"
                    >
                        <Account title={account} className={clsx('color-border', 'border-b')}>
                            <ProfileImage user={user} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography>
                                    {account.slice(0, 4)}...{account.slice(-4)}
                                </Typography>
                                <Typography color="secondary">
                                    {(user?.name?.length ?? 0) > 14
                                        ? user?.name?.slice(0, 5) + '...' + user?.name?.slice(-5)
                                        : user?.name}
                                </Typography>
                            </div>
                        </Account>
                    </Link>
                    <Flex className="mb-5 mt-5" flexDirection="column" gap={4}>
                        <div className="row-auto flex items-center">
                            <div className="mr-3 h-12 w-1 bg-purple-500 dark:bg-pink-400"></div>
                            <Icon
                                colorClass={'fill-white'}
                                beforeInjection={(svg) => {
                                    svg.classList.add('fill-blue')
                                }}
                                icon={IconType.sui}
                                className={'flex h-6'}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'baseline',
                                    paddingLeft: 5,
                                }}
                            >
                                <Typography
                                    className="mt-1 ml-2 flex items-center justify-end align-bottom"
                                    variant="md"
                                    font="jbm"
                                    hover
                                >
                                    {balance !== null && balance !== undefined
                                        ? (Number(balance) / 1e9).toFixed(7)
                                        : '--'}
                                </Typography>
                                <Typography variant="sm" color="secondary">
                                    {t('menu.title.walletbalance')}
                                </Typography>
                            </div>
                        </div>
                    </Flex>
                    <ButtonGroup>
                        {showProfileButton && (
                            <Link
                                style={{
                                    cursor: 'pointer',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 11,
                                }}
                                href="/profile"
                                onClick={() => {
                                    onClose()
                                }}
                            >
                                <Icon width={19} height={19} icon={IconType.userProfile} className={'flex'} />
                                <Typography
                                    className="my-2 flex items-center justify-start align-bottom"
                                    variant="md"
                                    font="jbm"
                                    hover
                                >
                                    {t('menu.title.profile')}
                                </Typography>
                            </Link>
                        )}
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                            onClick={() => {
                                // disconnect()
                                logout()
                                onClose()
                            }}
                        >
                            <Icon
                                beforeInjection={(svg) => {
                                    svg.classList.add('fill-gray-700', 'dark:fill-white')
                                    svg.setAttribute('width', '18')
                                    svg.setAttribute('height', '18')
                                }}
                                icon={IconType.powerOff}
                                className={'flex'}
                            />
                            <Typography
                                className="my-2 flex items-center justify-start align-bottom"
                                variant="md"
                                font="jbm"
                                hover
                            >
                                {t('menu.title.logout')}
                            </Typography>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                            <Icon
                                beforeInjection={(svg) => {
                                    svg.classList.add('fill-gray-700', 'dark:fill-white')
                                    svg.setAttribute('width', '18')
                                    svg.setAttribute('height', '18')
                                }}
                                icon={IconType.nightmode}
                                className={'flex'}
                            />
                            <Typography
                                className="pl my-2 flex items-center justify-start align-bottom"
                                variant="md"
                                font="jbm"
                                hover
                            >
                                {t('menu.title.nightMode')}
                            </Typography>
                            <div className="pl-1 pb-1">
                                <DarkModeToggle />
                            </div>
                        </div>
                    </ButtonGroup>
                    <CloseButton onClick={onClose} />
                </Body>
            </Content>
        </Dialog>
    )
}
