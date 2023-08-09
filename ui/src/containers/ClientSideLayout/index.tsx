import { useWalletKit } from '@mysten/wallet-kit'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Alert } from '~/components/Alert'
import PageTransition from '~/components/PageTransition'
import { Seo, SeoProps } from '~/components/Seo'
import { AuthProvider } from '~/contexts/auth'
import { NavBar } from '../NavBar'
import { Banner } from '~/components/Banner'
import { toast, Toaster, ToastBar } from 'react-hot-toast'
import { JetBrainsMono } from '~/components/Typography/fonts'
import { Flex, Typography } from '~/components'
import { useAppState } from '~/contexts/app'
import { Footer } from '../Footer'
export type Wallet = ReturnType<typeof useWalletKit>

interface ClientSideLayoutProps {
    children: React.ReactNode
    seo?: SeoProps
}

export const ClientSideLayout = ({ children, seo }: ClientSideLayoutProps) => {
    const [mounted, setMounted] = React.useState(false)
    const { config } = useAppState()
    const router = useRouter()

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <></>
    }

    return (
        <>
            {seo && <Seo seo={seo} />}
            <AuthProvider>
                {config && config.network !== 'mainnet' && (
                    <Banner
                        text={`Somis is currently on the Sui ${config.network?.toUpperCase()}. Please note that the network may reset periodically.`}
                    />
                )}
                <NavBar />
                <PageTransition location={router.pathname}>
                    <main
                        className={clsx(
                            'flex',
                            'w-full',
                            'min-h-[calc(100vh-80px)]',
                            'items-center',
                            'flex-col',
                            'z-0',
                            // 'overflow-hidden',
                            // 'bg-light-content-background',
                            // 'dark:bg-dark-content-background',
                        )}
                    >
                        {children}
                        <div className="grow"></div>
                        <Footer />
                    </main>
                </PageTransition>
                <Alert />
                <Toaster
                    position="top-right"
                    reverseOrder
                    toastOptions={{
                        className: clsx(
                            'bg-light-background',
                            'dark:bg-dark-background',
                            'text-light',
                            'text-body-md',
                            'dark:text-dark',
                            JetBrainsMono.className,
                            'border',
                            'border-light-card-border',
                        ),
                        style: {
                            borderRadius: '0.25rem',
                            minWidth: 300,
                        },
                    }}
                >
                    {(t) => (
                        <ToastBar toast={t}>
                            {({ icon, message }) => (
                                <Flex gap={2} fullWidth>
                                    {icon}
                                    <div>{message}</div>
                                    <div className="grow"></div>
                                    {t.type !== 'loading' && (
                                        <Flex
                                            alignItems="center"
                                            onClick={() => {
                                                toast.dismiss(t.id)
                                            }}
                                            className="text-body-md mr-2 cursor-pointer hover:opacity-80"
                                        >
                                            <Typography font="ppm">X</Typography>
                                        </Flex>
                                    )}
                                </Flex>
                            )}
                        </ToastBar>
                    )}
                </Toaster>
            </AuthProvider>
        </>
    )
}

export default ClientSideLayout
