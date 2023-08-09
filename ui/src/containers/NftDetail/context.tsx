import { createContext, useContext, useEffect, useState } from 'react'
import authContext from '~/contexts/auth'
import {
    Nft,
    NftEventType,
    OrderbookType,
    SubscribeNftEventDocument,
    SubscribeNftEventSubscription,
    useQueryNftQuery,
} from '~/gql/generated/graphql'
import { NftStatus, isNftCompleted, getNftStatus, syncNftByBlockChain, getNftStatusByEvent } from '~/utils/nft'
import { useSubscription } from '~/hooks/useSubscription'
import { debounce } from 'lodash'
import { OriginBytesCommissionFields, getOwnedKioskNftAddresses, getOwnedOriginbyteKiosk } from '~/services/blockChain'

const NftDetailPageContext = createContext<NftDetailPageContextType | null>(null)

export interface NftDetailPageContextType {
    nft: Nft
    isLoading: boolean
    status: NftStatus | null
    isOwner: boolean
    isRefetching: boolean
    canCancel: boolean
    subscriptionEvent: SubscribeNftEventSubscription | null
    price: number | null
    isKioskNft: boolean
    kiosk: string | null
    orderCommission: OriginBytesCommissionFields | null
    onBuySuccess: () => Promise<void>
    onListSuccess: (listedPrice: number) => Promise<void>
    onCancelListSuccess: () => Promise<void>
    refetch: () => Promise<void>
}

export const useNftDetailPageContext = () => {
    const context = useContext(NftDetailPageContext)
    if (!context) {
        throw new Error('useNftDetailPageContext must be used within NftDetailPageContextProvider')
    }
    return context
}

export const NftDetailPageContextProvider = ({
    originalNft,
    children,
}: {
    originalNft: Nft
    children: React.ReactNode
}) => {
    const { walletAddress } = authContext.useAuthState()
    const [isLoading, setIsLoading] = useState(false)
    const [isRefetching, setIsRefetching] = useState(true)
    const [nft, setNft] = useState(originalNft)
    const [isOwner, setIsOwner] = useState(false)
    const [status, setStatus] = useState<NftStatus | null>(null)
    const [subscriptionEvent, setSubscriptionEvent] = useState<SubscribeNftEventSubscription | null>(null)
    const [price, setPrice] = useState<number | null>(originalNft?.order?.price ?? 0)
    const [checkType, setCheckType] = useState<NftEventType | null>(null)
    const [canCancel, setCanCancel] = useState(false)
    const [isKioskNft, setIsKioskNft] = useState(false)
    const [kiosk, setKiosk] = useState<string | null>(null)
    const [orderCommission, setOrderCommission] = useState<OriginBytesCommissionFields | null>(null)

    const { refetch: queryRefetch } = useQueryNftQuery({
        address: originalNft?.address ?? '',
    })

    /* Functions */
    const refetch = async (updateStatus = true, slient = false) => {
        try {
            if (!slient) {
                setIsRefetching(true)
            }

            const data = await queryRefetch()
            const kioskNftAddresses = walletAddress ? await getOwnedKioskNftAddresses(walletAddress) : []
            const newServerNft = data.data?.nft as Nft | null | undefined
            if (newServerNft) {
                const nft = await syncNftByBlockChain(newServerNft, undefined)
                const orderCommission = nft?.orderCommission ?? null
                setOrderCommission(orderCommission)
                setNft(nft)
                if (updateStatus) {
                    const owner = nft?.owner
                    const isOwner = !!(owner?.address && walletAddress && walletAddress === owner?.address)
                    setIsOwner(isOwner)
                    const newStatus = await getNftStatus(nft, isOwner)
                    setStatus(newStatus)
                    setIsKioskNft(!!kioskNftAddresses.find((kN) => nft.address === kN.nftAddress))

                    const kiosk = kioskNftAddresses.find((kN) => nft.address === kN.nftAddress)?.kioskAddress
                    if (walletAddress) {
                        setKiosk(kiosk ?? (await getOwnedOriginbyteKiosk(walletAddress)))
                    } else {
                        setKiosk(null)
                    }
                    if (newStatus === NftStatus.NotListed) {
                        setPrice(0)
                    } else {
                        setPrice(nft?.order?.price ? Number(nft?.order?.price) : null)
                    }
                }
                setCanCancel(true)
            }

            setIsRefetching(false)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error)
            setIsRefetching(false)
        }
    }

    const onBuySuccess = async () => {
        setIsRefetching(true)
        setIsOwner(true)
        setStatus(NftStatus.NotListed)
        setPrice(0)
        setIsRefetching(false)
        setCheckType(NftEventType.Buy)
    }

    const onListSuccess = async (listedPrice: number) => {
        setIsRefetching(true)
        setIsOwner(true)
        setStatus(NftStatus.Listed)
        setPrice(listedPrice)
        setIsRefetching(false)
        setCheckType(NftEventType.List)
        // Because sometime have network delay, we disable cnacel first
        setCanCancel(false)
    }

    const onCancelListSuccess = async () => {
        setIsRefetching(true)
        setIsOwner(true)
        setStatus(NftStatus.NotListed)
        setPrice(0)
        setIsRefetching(false)
        setCheckType(NftEventType.CancelOrder)
    }

    /* Hooks */
    useEffect(() => {
        const update = async () => {
            const owner = nft?.owner
            const isOwner = !!(owner?.address && walletAddress && walletAddress === owner?.address)

            setIsOwner(isOwner)
            const newStatus = await getNftStatus(nft, isOwner)
            setStatus(newStatus)
        }
        update()
    }, [walletAddress])

    useEffect(() => {
        debounce(async () => {
            if (checkType !== null) {
                if (!subscriptionEvent || subscriptionEvent?.subscribeNftEvent?.type !== checkType) {
                    console.log('web socket event not received, refetching')
                    refetch(false, true)
                } else {
                    console.log('web socket event received')
                }
                setCheckType(null)
            }
        }, 5000)()
    }, [checkType, subscriptionEvent])

    // If the nft is not completed, refetch it when the page is loaded
    useEffect(() => {
        const init = async () => {
            if (!isNftCompleted(nft)) {
                setIsLoading(true)
            }
            await refetch()
            setIsLoading(false)
        }
        init()
    }, [])

    useSubscription<SubscribeNftEventSubscription>({
        query: SubscribeNftEventDocument,
        params: {
            address: nft.address,
        },
        handler: async (data) => {
            setSubscriptionEvent(data)
            const event = data?.subscribeNftEvent
            const newOwnerAddress = event?.newOwner?.address
            const isOwner = !!(newOwnerAddress && walletAddress && walletAddress === newOwnerAddress)
            setIsOwner(isOwner)
            const newStatus = getNftStatusByEvent(event.type, isOwner)
            setStatus(newStatus)
            if (newStatus === NftStatus.NotListed || newStatus === NftStatus.CanOffer) {
                setPrice(0)
            } else {
                setPrice(event?.price ? Number(event?.price) : null)
            }
            await refetch(false, true)
        },
    })

    return (
        <NftDetailPageContext.Provider
            value={{
                nft,
                isLoading,
                onBuySuccess,
                onListSuccess,
                onCancelListSuccess,
                status,
                isOwner,
                isRefetching,
                subscriptionEvent,
                price,
                canCancel,
                kiosk,
                isKioskNft,
                orderCommission,
                refetch: async () => {
                    setIsRefetching(true)
                    await refetch()
                    setIsRefetching(false)
                },
            }}
        >
            {children}
        </NftDetailPageContext.Provider>
    )
}
