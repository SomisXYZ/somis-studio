import { useCallback, useEffect } from 'react'
import { QueryClient } from '@tanstack/react-query'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { isExpired } from 'react-jwt'
import {
    useMeQuery,
    User,
    useRequestLoginChallengeMutation,
    useSubmitLoginChallengeMutation,
} from '~/gql/generated/graphql'
import { debounce } from 'lodash'
import { getBalanceByWalletAddress } from '~/services/blockChain'
import walletKitContext from '~/components/Wallet/WalletKitContext'

export interface AuthState {
    walletAddress: string | null | undefined
    balance: string | null | undefined
    jwt: string | null | undefined
    walletName: string | null | undefined
    user: User | null
    login: (walletAddress: string, jwt: string, walletName: string) => void
    logout: () => void
    refreshUser: () => Promise<void>
    getBalance: () => bigint
    refreshBalance: (address?: string) => Promise<void>
    validateJwt: () => void
}

const initAuthState = {
    walletAddress: null,
    jwt: null,
    user: null,
    balance: null,
    walletName: null,
}

export const useAuthState = create(
    persist<AuthState>(
        (set, get) => {
            return {
                ...initAuthState,
                walletAddress: get()?.walletAddress ?? null,
                jwt: get()?.jwt ?? null,
                user: get()?.user ?? null,
                balance: get()?.balance ?? null,
                walletName: get()?.walletName ?? null,
                login: (walletAddress: string, jwt: string, walletName: string) => {
                    set(() => ({
                        walletAddress,
                        jwt,
                        walletName,
                    }))
                    get()?.refreshUser()
                },
                logout: () => {
                    set(() => ({
                        ...initAuthState,
                    }))
                },
                refreshUser: async () => {
                    get().validateJwt()
                    try {
                        const queryClient = new QueryClient()
                        const user = (await queryClient.fetchQuery(useMeQuery.getKey(), useMeQuery.fetcher())).me
                        set(() => ({
                            user,
                        }))
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (error: any) {
                        console.log('Error refreshing user')
                        console.error(error)
                        if (window && error.response?.erroers?.[0]?.extensions?.code === 'AUTH_UNAUTHORIZED') {
                            console.log('AUTH_UNAUTHORIZED')
                            get().logout()
                        }
                    }
                },
                getBalance: () => {
                    const balance = get().balance
                    if (balance) {
                        return BigInt(balance)
                    }
                    return BigInt(0)
                },
                refreshBalance: async (address?: string) => {
                    get().validateJwt()
                    const walletAddress = address ?? get().walletAddress
                    if (walletAddress) {
                        try {
                            const { balance } = await getBalanceByWalletAddress(walletAddress)
                            set(() => ({
                                balance: balance.toString(),
                            }))
                        } catch (error) {
                            console.log(`Error refreshing balance for ${walletAddress}`)
                            console.error(error)
                        }
                    }
                },
                validateJwt: () => {
                    const jwt = get().jwt
                    if (jwt && isExpired(jwt)) {
                        console.log('jwt expired')
                        get().logout()
                        return
                    }
                },
            }
        },
        {
            name: 'somis-storage', // name of item in the storage (must be unique)
            getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
        },
    ),
)

export const AuthProvider = ({ children }: React.HTMLAttributes<HTMLDivElement>) => {
    const wallet = walletKitContext.useWalletKit()

    const authState = useAuthState()
    const { walletAddress, walletName, user, login, logout, refreshBalance, jwt: authJwt } = authState
    const requestLogin = useRequestLoginChallengeMutation()
    const submitLogin = useSubmitLoginChallengeMutation()

    const loginHandler = useCallback(
        // debounce the wallet adapter state change
        debounce((wallet, walletAddress, walletName?: string | null) => {
            ;(async () => {
                if (wallet.isConnecting) {
                    return
                }
                if (!wallet.currentWallet && walletAddress) {
                    try {
                        wallet.connect(walletName)
                        return
                    } catch (error) {
                        console.log(error)
                        logout()
                    }
                }
                const isConnected = wallet.isConnected
                // Connected wallet, check login status
                if (isConnected) {
                    const [connectedWallet] = (await wallet.currentWallet?.getAccounts()) ?? []
                    const account = connectedWallet?.address
                    refreshBalance(account)
                    if (walletAddress === account && user && authJwt && !isExpired(authJwt)) {
                        return
                    }
                    if (walletAddress && walletAddress !== account) {
                        // logout old account
                        logout()
                    }
                    const data = (await requestLogin.mutateAsync({ publicKey: account })).requestLoginChallenge
                    const { jwt, signData } = data
                    try {
                        const result = await wallet.signMessage({
                            message: new TextEncoder().encode(signData),
                        })
                        if (!result || !result.signature) {
                            logout()
                        }
                        const finalJwt = (
                            await submitLogin.mutateAsync({
                                jwt,
                                signature: result.signature,
                            })
                        ).submitLoginChallenge
                        login(account, finalJwt, wallet.currentWallet?.name ?? 'Sui Wallet')
                    } catch (error) {
                        wallet.disconnect()
                    }
                } else {
                    logout()
                }
            })()
        }, 100),
        [],
    )

    useEffect(() => {
        if (!user && wallet && wallet.isConnected) {
            const { disconnect } = wallet
            disconnect()
        }
    }, [user])

    useEffect(() => {
        loginHandler(wallet, walletAddress, walletName)
    }, [wallet])

    useEffect(() => {
        if (walletAddress) {
            // refresh balance every 60 seconds
            const interval = setInterval(() => {
                refreshBalance(walletAddress)
            }, 1000 * 60)
            return () => {
                clearInterval(interval)
            }
        }
    }, [walletAddress])

    return <>{children}</>
}

export default {
    useAuthState,
    AuthProvider,
}
