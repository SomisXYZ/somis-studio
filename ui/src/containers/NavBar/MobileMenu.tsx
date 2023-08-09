import clsx from 'clsx'
import { useTheme } from 'next-themes'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { Flex, Typography, IconType, LinkIcon, Button } from '~/components'
import { useWindowSize } from '~/hooks'
import { DarkModeToggle } from '../DarkModeToggle'
import { PriceCard } from '../../components/PriceCard'
import { ProfileCard } from '../ProfileCard'
import { atom, useAtom } from 'jotai'
import styles from './NavBar.module.scss'
import { NavLinkButton } from './NavLinkButton'
import { useAuthState } from '~/contexts/auth'
import { useFormatCoin } from '~/hooks/useFormatCoin'
import { ConnectButton } from '~/components/Wallet'
import { FeatureWrapper } from '../FeatureWrapper'
import { NavMenu } from '.'

export const MobileSearchPageAtom = atom(false)

// const somisPrice: Price = {
//     type: 'somis',
//     amount: 233244.32,
//     rate: 0.12704704,
//     currency: 'SOMIS',
// }

export const MobileMenu = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const { theme } = useTheme()
    const { user, logout } = useAuthState()
    const menuRef = useRef<HTMLDivElement>(null)
    const { height } = useWindowSize()
    const { t } = useTranslation('common')
    const [, setShowSearch] = useAtom(MobileSearchPageAtom)

    const { balance } = useAuthState()
    const { fullAmount } = useFormatCoin(balance || 0)

    useEffect(() => {
        if (menuOpen) {
            document.body.classList.add('no-scroll')
            document.getElementById('global-banner')?.classList.add('hidden')
        } else {
            setTimeout(() => {
                document.getElementById('global-banner')?.classList.remove('hidden')
            }, 300)
        }
        return () => {
            document.body.classList.remove('no-scroll')
        }
    }, [menuOpen])

    return (
        <>
            <Flex justifyContent="end" gap={3} className={clsx('xl:hidden', 'relative')} alignItems="center">
                <LinkIcon
                    icon={IconType.search}
                    className={clsx('sm:hidden')}
                    onClick={() => {
                        setShowSearch(true)
                    }}
                />
                {/* <LinkIcon icon={IconType.wallet} /> */}
                <div
                    className="p-2"
                    onClick={() => {
                        setMenuOpen(!menuOpen)
                    }}
                >
                    <div id="menu-icon" className={clsx(styles['menu-icon'], menuOpen && styles['open'])}>
                        <span className={clsx('bg-light dark:bg-dark')}></span>
                        <span className={clsx('bg-light dark:bg-dark')}></span>
                        <span className={clsx('bg-light dark:bg-dark')}></span>
                        <span className={clsx('bg-light dark:bg-dark')}></span>
                    </div>
                </div>
                <CSSTransition
                    in={menuOpen}
                    timeout={300}
                    classNames={{
                        enterActive: styles['slide-enter-active'],
                        enterDone: styles['slide-enter-done'],
                        exitActive: styles['slide-exit-done'],
                        exitDone: styles['slide-exit-done'],
                    }}
                    unmountOnExit
                >
                    <Flex
                        ref={menuRef}
                        flexDirection="column"
                        justifyContent="between"
                        // gap={4}
                        style={{ height: height ? height + 16 : '100vh' }}
                        className={clsx(
                            styles['mobile-nav'],
                            'bg-light-background',
                            'dark:bg-dark-background',
                            'w-full',
                            'z-10',
                        )}
                    >
                        <Flex
                            justifyContent="center"
                            flexDirection="column"
                            gap={4}
                            className={clsx('bg-light-background', 'dark:bg-dark-background')}
                        >
                            <ProfileCard
                                onClick={() => {
                                    setMenuOpen(!menuOpen)
                                }}
                            />
                            {NavMenu.map((item, key) =>
                                item.feature ? (
                                    <FeatureWrapper key={key} feature={item.feature}>
                                        <NavLinkButton
                                            to={item.href}
                                            name={t(item.title)}
                                            icon={item.icon}
                                            onClick={() => {
                                                setMenuOpen(false)
                                            }}
                                        />
                                    </FeatureWrapper>
                                ) : (
                                    <NavLinkButton
                                        key={key}
                                        to={item.href}
                                        name={t(item.title)}
                                        icon={item.icon}
                                        onClick={() => {
                                            setMenuOpen(false)
                                        }}
                                    />
                                ),
                            )}
                        </Flex>
                        <div className={clsx('bg-light-background', 'dark:bg-dark-background', 'grow')}></div>
                        <Flex
                            gap={4}
                            flexDirection="column"
                            className={clsx('bg-light-background', 'dark:bg-dark-background')}
                        >
                            {user ? (
                                <>
                                    <PriceCard
                                        price={{
                                            type: 'sui',
                                            amount: fullAmount,
                                            rate: null,
                                            currency: 'SUI',
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    <ConnectButton className={clsx('py-5')} title={t('menu.title.connectWallet')} />
                                </>
                            )}
                            {/* <PriceCard price={somisPrice} /> */}
                            <Flex justifyContent="between" className={clsx('py-10')}>
                                <Flex className={clsx('basis-1/2')} gap={8}>
                                    <LinkIcon
                                        icon={IconType.twitter}
                                        url="https://twitter.com/Somisxyz"
                                        target="_blank"
                                    />
                                    <LinkIcon
                                        icon={IconType.discord}
                                        url="https://discord.gg/9UqQDZhtXw"
                                        target="_blank"
                                    />
                                </Flex>

                                <Flex gap={3} alignContent="center" alignItems="center">
                                    <div className={clsx('transition-colors', 'duration-300')}>
                                        <Typography variant="sm" color="secondary" font="jbm" bold>
                                            {theme === 'dark' ? t('menu.mode.dark') : t('menu.mode.light')}
                                        </Typography>
                                    </div>
                                    <div>
                                        <DarkModeToggle />
                                    </div>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </CSSTransition>
            </Flex>
        </>
    )
}
