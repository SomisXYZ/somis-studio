import { Typography } from '../../components/Typography'
import { Logo } from '../../components/Logo'
import { SearchBar } from '../SearchBar'
import clsx from 'clsx'
import { Coin, Flex, IconType } from '~/components'
import { useBreakpoint } from '~/hooks'
import { useEffect, useRef, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { MobileMenu } from './MobileMenu'
import Link from 'next/link'
import authContext from '~/contexts/auth'
import { ConnectButton } from '~/components/Wallet'
import { useFormatCoin } from '~/hooks/useFormatCoin'
import { Features } from '~/utils/helpers'
import { FeatureWrapper } from '../FeatureWrapper'
import { DarkModeToggle } from '../DarkModeToggle'
import toast from 'react-hot-toast'
import walletKit from '~/components/Wallet/WalletKitContext'
import { ProfileImage } from '../ProfileImage'
import { AccountModal } from '~/components/Wallet/AccountModal'
import { MobileSearchPage } from './MobileSearchPage'

export const NavMenu: {
    feature?: Features
    href: string
    title: string
    icon: IconType
}[] = [
    {
        feature: 'studio',
        href: '/studio/launches',
        title: 'menu.title.studio',
        icon: IconType.collections,
    },
]

export function NavBar() {
    const headerRef = useRef<HTMLDivElement>(null)
    const { balance, user, refreshUser } = authContext.useAuthState()
    const { currentAccount } = walletKit.useWalletKit()
    const { fullAmount } = useFormatCoin(balance)
    const { breakpoint } = useBreakpoint()
    const [showAccountModal, setShowAccountModal] = useState(false)
    const { t } = useTranslation('common')

    const onStorageUpdate = (e: StorageEvent) => {
        const { key, newValue } = e
        if (key && ['discordConnected', 'twitterConnected'].includes(key) && newValue !== e.oldValue) {
            if (newValue === 'success') {
                toast(t(key))
                refreshUser()
            } else {
                console.log('failed', key, newValue)
                toast(t('discordConnectFailed'))
            }
            localStorage.removeItem(key)
        }
    }

    useEffect(() => {
        window.addEventListener('storage', onStorageUpdate)
        return () => {
            window.removeEventListener('storage', onStorageUpdate)
        }
    }, [])

    return (
        <>
            <div
                id="navbar"
                ref={headerRef}
                className={clsx(
                    'sticky',
                    'top-0',
                    'w-full',
                    'justify-center',
                    'max-xl:justify-start',
                    'items-center',
                    'backdrop-blur-2xl',
                    'backdrop-saturate-50',
                    'flex',
                    'flex-col',
                    'border-b',
                    'border-light-border',
                    'dark:border-b',
                    'dark:border-dark-border',
                    'z-50',
                    // 'max-sm:overflow-hidden',
                )}
            >
                <Flex
                    className={clsx(
                        'w-full',
                        ['xs', 'sm', 'md'].includes(breakpoint) ? 'py-4' : 'py-4',
                        'px-4',
                        'md:px-8',
                        'relative',
                        'color-opacity-background',
                        'max-sm:justify-between',
                    )}
                    gap={4}
                >
                    <div className="flex w-[195px] items-center justify-start">
                        <Link href="/" className="relative">
                            <Logo />
                        </Link>
                    </div>
                    {/* Desktop Menu */}
                    <Flex alignItems="center" justifyContent="between" className={clsx('flex-1', 'max-sm:hidden')}>
                        <div className="max-sm:hidden sm:w-11/12 md:w-5/6 lg:w-3/6">
                            <SearchBar />
                        </div>
                        <div className="grow"></div>
                        <div className="flex w-3/6 items-center justify-end max-xl:hidden lg:w-5/6">
                            {!user && !balance && (
                                <div className={clsx('relative top-[1px] right-[-5px]')}>
                                    <DarkModeToggle />
                                </div>
                            )}
                            {NavMenu.map((item, index) =>
                                item.feature ? (
                                    <FeatureWrapper key={index} feature={item.feature}>
                                        <Link className="mx-5" href={item.href} key={index}>
                                            <Typography variant="md" bold color="default" font="jbm" hover>
                                                {t(item.title)}
                                            </Typography>
                                        </Link>
                                    </FeatureWrapper>
                                ) : (
                                    <Link className="mx-5" href={item.href} key={index}>
                                        <Typography variant="md" bold color="default" font="jbm" hover>
                                            {t(item.title)}
                                        </Typography>
                                    </Link>
                                ),
                            )}

                            {currentAccount && balance ? (
                                <div className="relative row-auto mx-5 flex rounded border border-light-input-border bg-light-input-background">
                                    <div className="relative row-auto flex border-r border-light-input-border p-3">
                                        <Coin
                                            number={fullAmount}
                                            decimal={3}
                                            variant="md"
                                            font="jbm"
                                            color="secondary"
                                            bold
                                            hover
                                        />
                                    </div>
                                    <Flex
                                        className="cursor-pointer p-2"
                                        flexDirection="row"
                                        gap={2}
                                        alignItems="center"
                                        onClick={() => setShowAccountModal(true)}
                                    >
                                        {user ? (
                                            <>
                                                <ProfileImage className="h-6 w-6 rounded-full" user={user} />
                                                <Typography variant="md" bold color="secondary" font="jbm" hover>
                                                    {currentAccount?.address.slice(0, 7)}
                                                </Typography>
                                            </>
                                        ) : (
                                            <Flex className="w-12">
                                                <Typography
                                                    variant="md"
                                                    bold
                                                    color="secondary"
                                                    font="jbm"
                                                    hover
                                                    skeleton
                                                    skeletonLength={100}
                                                >
                                                    {currentAccount?.address.slice(0, 7)}
                                                </Typography>
                                            </Flex>
                                        )}
                                    </Flex>
                                </div>
                            ) : (
                                <div className="ml-5">
                                    <ConnectButton title={t('menu.title.connectWallet')} />
                                </div>
                            )}
                        </div>
                    </Flex>
                    {showAccountModal && (
                        <AccountModal open={showAccountModal} onClose={() => setShowAccountModal(false)} />
                    )}
                    {/* Mobile Menu */}
                    {['xs', 'sm', 'md', 'lg', 'xl'].includes(breakpoint) && <MobileMenu />}
                </Flex>
            </div>
            <MobileSearchPage />
        </>
    )
}
