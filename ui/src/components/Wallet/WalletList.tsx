// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import clsx from 'clsx'
import { Flex } from '../Flex'
import { Icon, IconType } from '../Icon'
import { Typography } from '../Typography'
import { styled } from './stitches'
import { SuiIcon } from './utils/icons'
import { Panel } from './utils/ui'
import { useWalletKit } from './WalletKitContext'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import useTranslation from 'next-translate/useTranslation'

const Container = styled(Panel, {
    background: '$background',
    height: '100%',
})

const ListContainer = styled('div', {
    marginTop: '$1',
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
})

const WalletItem = styled('button', {
    background: 'none',
    display: 'flex',
    padding: '$2',
    gap: '$2',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#141414',
    border: 'none',
    fontWeight: '$button',
    fontSize: '$md',
    borderRadius: '$wallet',
    backgroundColor: '#ffffff',
    paddingLeft: '$3',
    variants: {
        selected: {
            true: {
                background: '$background',
                boxShadow: '$wallet',
                backgroundColor: '#ffffff',
            },
        },
    },
})

const WalletIcon = styled('img', {
    flexShrink: 0,
    background: 'white',
    width: 28,
    height: 28,
    borderRadius: 6,
    objectFit: 'cover',
    paddingLeft: 2,
})

interface Props {
    selected: string | null
    onChange(selected: string): void
}

export function WalletList({ selected, onChange }: Props) {
    const { wallets } = useWalletKit()
    const { theme } = useTheme()
    const { t } = useTranslation('common')

    function isDark() {
        if (theme == 'dark') {
            return true
        } else {
            return false
        }
    }

    return (
        <Container style={!isDark() ? { backgroundColor: 'white' } : {}}>
            <Flex fullWidth justifyContent="start" className={clsx('border-b', 'pb-3', 'color-border')}>
                <Icon
                    className={clsx('scale-90')}
                    icon={IconType.wallet}
                    colorClass={clsx('fill-light-secondary', 'pr-3')}
                />
                <Typography
                    variant="b4"
                    font="jbm"
                    bold
                    transform="uppercase"
                    className={clsx('pt-0.5', 'color-border')}
                >
                    {t('menu.title.connectWallet')}
                </Typography>
            </Flex>
            <Typography className={clsx('py-4', 'color-border')} variant="sm" font="jbm" bold transform="uppercase">
                {t('menu.title.chooseWallet')}
            </Typography>
            <ListContainer>
                {wallets.length === 0 ? (
                    <WalletItem
                        onClick={() =>
                            window.open(
                                'https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
                                '_blank',
                                'noreferrer',
                            )
                        }
                        style={{
                            backgroundColor: isDark() ? 'white' : '#ebebeb',
                        }}
                    >
                        <SuiIcon />
                        <Typography transform="uppercase" color="dark" className={clsx('pt-0.5')}>
                            {t('menu.title.downloadSuiWallet')}
                        </Typography>
                    </WalletItem>
                ) : (
                    wallets.map((wallet) => (
                        <WalletItem
                            key={wallet.name}
                            selected={wallet.name === selected}
                            onClick={() => {
                                onChange(wallet.name)
                            }}
                            style={{
                                backgroundColor: isDark() ? 'white' : '#ebebeb',
                            }}
                        >
                            <WalletIcon src={wallet.icon} />
                            <Typography transform="uppercase" color="dark" className={clsx('pt-0.5')}>
                                {wallet.name}
                            </Typography>
                        </WalletItem>
                    ))
                )}
            </ListContainer>
            <Typography color="secondary" className={clsx('flex flex-wrap pt-14')} variant="md">
                {t('menu.title.notSureWallet')}&nbsp;
                <Link
                    style={isDark() ? { color: 'white' } : { color: 'black' }}
                    href={`https://docs.sui.io/explore/wallet-browser`}
                >
                    {t('menu.title.clickHere')}&nbsp;
                </Link>
                {t('menu.title.toLearnMore')}
            </Typography>
        </Container>
    )
}
