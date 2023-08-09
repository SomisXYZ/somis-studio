import '~/styles/index.scss'
import type { AppProps } from 'next/app'
import { ThemeProvider, useTheme } from 'next-themes'

import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import Head from 'next/head'
import { RouterProgress } from '~/components/RouterProgress'
import { useAppState } from '~/contexts/app'
import { WalletKitProvider } from '~/components/Wallet'
import { useAuthState } from '~/contexts/auth'
import { setCookie } from 'cookies-next'
import dynamic from 'next/dynamic'
import { Seo } from '~/components/Seo'
import Script from 'next/script'

export default function App(props: AppProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 300 * 1000,
                    },
                    mutations: {
                        cacheTime: 5000,
                    },
                },
            }),
    )

    const { fetchConfig, config } = useAppState()
    const { refreshUser, walletAddress } = useAuthState()
    const [init, setInit] = useState(false)
    useEffect(() => {
        const init = async () => {
            await fetchConfig()
            if (walletAddress) {
                refreshUser()
            }
        }
        init()
    }, [])

    useEffect(() => {
        if (config) {
            setInit(true)
            setCookie('config', JSON.stringify(config))
        }
    }, [config])

    const { pageProps } = props
    const { seo } = pageProps
    if (!init) {
        return (
            <>
                <Seo seo={seo} />
            </>
        )
    }
    return (
        <>
            <Seo seo={seo} />
            <QueryClientProvider client={queryClient}>
                <Hydrate state={props.pageProps.dehydratedState}>
                    <WalletKitProvider>
                        <AppMain {...props} />
                    </WalletKitProvider>
                </Hydrate>
            </QueryClientProvider>
        </>
    )
}
const DynamicLayout = dynamic(() => import('../containers/ClientSideLayout'))
const AppMain = ({ Component, pageProps }: AppProps) => {
    const { theme } = useTheme()
    useEffect(() => {
        //update theme-color by theme
        const themeColor = document.querySelector('meta[name="theme-color"]')
        if (themeColor) {
            themeColor.setAttribute('content', theme === 'dark' ? '#131525' : '#ffffff')
        }
    }, [theme])
    return (
        <>
            <Head>
                <title>Somis - The Fastest NFT Marketplace on Sui</title>
                <meta name="description" content="The Fastest NFT Marketplace on Sui" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </Head>
            <Script strategy="afterInteractive">
                {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KG63KWR');
`}
            </Script>
            <Script
                async
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=G-VYGFLZSFPG"
            ></Script>
            <Script strategy="afterInteractive">
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-VYGFLZSFPG');
              `}
            </Script>
            <noscript>
                <iframe
                    src="https://www.googletagmanager.com/ns.html?id=GTM-KG63KWR"
                    height="0"
                    width="0"
                    style={{ display: 'none', visibility: 'hidden' }}
                ></iframe>
            </noscript>
            <ThemeProvider attribute="class" defaultTheme="dark">
                <div
                    className={clsx(
                        'color-text-default',
                        'bg-light-content-background',
                        'dark:bg-dark-content-background',
                    )}
                >
                    <RouterProgress />
                    {pageProps.hiddenLayout ? (
                        <Component {...pageProps} />
                    ) : (
                        <DynamicLayout>
                            <Component {...pageProps} />
                        </DynamicLayout>
                    )}

                    {/* <div className="footer h-48"></div> */}
                </div>
            </ThemeProvider>
        </>
    )
}
