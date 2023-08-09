import { SuiTransactionBlockResponse, TransactionArgument, TransactionBlock, Transactions } from '@mysten/sui.js'
import { useEffect, useState } from 'react'
import { Collection, Nft, Order, OrderbookType } from '~/gql/generated/graphql'
import { EmitEventType, getNftByNftAddresses, getOwnedOriginbyteKiosk } from '~/services/blockChain'
import blockChainService from '~/services/blockChain/service'
import { convertSuiToMist, DEFAULT_MIN_GAS_BUDGET, EnableFixedGasPrice } from '~/utils/sui'
import { OriginBytesNft, SUI_TYPE } from '~/services/blockChain'
import appContext, { getConfig } from '~/contexts/app'
import walletKit from '~/components/Wallet/WalletKitContext'
import authContext from '~/contexts/auth'
import useAlert from '~/components/Alert/context'
import { add } from 'lodash'
import { calculateCommission } from '~/utils/helpers'
type TransactionResult = TransactionArgument & TransactionArgument[]
export interface UseNfts {
    loading: boolean
    nfts: OriginBytesNft[]
    error: string | undefined
    fetch: (focus?: boolean) => Promise<void>
}

const originalByteBuyNft = ({
    collection,
    nft,
    transaction,
    splitCoins,
    index,
    dappPackage,
    currentAccount,
}: {
    collection: Collection
    nft: SNft
    transaction: TransactionBlock
    splitCoins: TransactionResult
    index: number
    dappPackage: string
    currentAccount: string
}) => {
    const collectionOrderbook = collection.orderbook
    const transferPolicy = collection.transferPolicy
    const withdrawPolicy = collection.withdrawPolicy
    const bpsRoyaltyStrategy = collection.bpsRoyaltyStrategy
    const bigIntMinPrice = convertSuiToMist(Number(nft.order?.price))

    if (!collection || !nft.order || !collectionOrderbook || !transferPolicy || !withdrawPolicy || !collection.type) {
        throw new Error('Nft cannot be bought')
    }
    const kioskAddress = nft.kioskAddress ?? nft.order.sellerKiosk
    if (!kioskAddress) {
        throw new Error('Kiosk address is not set')
    }
    const orderId = nft.order.id

    if (!orderId) {
        throw new Error('Order id is not set')
    }

    const contract = 'SomisDapp'
    let entryPoint = 'buy_nft'
    const arguments_: Parameters<typeof Transactions['MoveCall']>[0]['arguments'] = [
        transaction.object(collectionOrderbook),
        transaction.object(transferPolicy),
    ]

    arguments_.push(transaction.object(withdrawPolicy))

    if (bpsRoyaltyStrategy) {
        entryPoint = 'buy_nft_with_bps_royalty_strategy'
        arguments_.push(transaction.object(bpsRoyaltyStrategy))
    }

    arguments_.push(
        transaction.pure(nft.address),
        transaction.pure(bigIntMinPrice.toString()),
        transaction.object(kioskAddress),
        splitCoins[index],
    )

    transaction.moveCall({
        target: `${dappPackage}::${contract}::${entryPoint}`,
        arguments: arguments_,
        typeArguments: [collection.type, SUI_TYPE],
    })
    transaction.transferObjects([splitCoins[index]], transaction.pure(currentAccount))

    return transaction
}

const originalByteV1BuyNft = ({
    collection,
    nft,
    transaction,
    splitCoins,
    index,
    requestPackage,
    currentAccount,
    nftProtocolPackage,
    buyerKiosk,
}: // packageAddress,
{
    collection: Collection
    nft: SNft
    transaction: TransactionBlock
    splitCoins: TransactionResult
    index: number
    requestPackage: string
    currentAccount: string
    nftProtocolPackage: string | null
    buyerKiosk:
        | string
        | { kind: 'Input'; index: number; type?: 'object' | 'pure' | undefined; value?: any }
        | { kind: 'GasCoin' }
        | { kind: 'Result'; index: number }
        | { kind: 'NestedResult'; index: number; resultIndex: number }
    // packageAddress: string | null
}) => {
    const collectionOrderbook = collection.orderbook
    const transferPolicy = collection.transferPolicy
    const bpsRoyaltyStrategy = collection.bpsRoyaltyStrategy
    const bigIntMinPrice = convertSuiToMist(Number(nft.order?.price))
    const packageAddress = getConfig().liquidityLayerV1Package

    if (!bpsRoyaltyStrategy) {
        throw new Error('Bps royalty strategy is not set')
    }
    if (!buyerKiosk) {
        throw new Error('Buyer kiosk is not set')
    }
    if (!collection || !nft.order || !collectionOrderbook || !transferPolicy || !collection.type) {
        throw new Error('Nft cannot be bought')
    }
    const sellerKiosk = nft.kioskAddress ?? nft.order.sellerKiosk
    if (!sellerKiosk) {
        throw new Error('Kiosk address is not set')
    }
    const orderId = nft.order.id

    if (!orderId) {
        throw new Error('Order id is not set')
    }

    const transferAllowlist = collection.transferAllowlist
    if (!transferAllowlist) {
        throw new Error('Transfer allowlist is not set')
    }

    const buyNftResult = transaction.moveCall({
        target: `${packageAddress}::orderbook::buy_nft`,
        arguments: [
            transaction.object(collectionOrderbook),
            transaction.object(sellerKiosk),
            typeof buyerKiosk === 'string' ? transaction.pure(buyerKiosk) : buyerKiosk,
            transaction.pure(nft.address),
            transaction.pure(bigIntMinPrice.toString()),
            splitCoins[index],
        ],
        typeArguments: [collection.type, SUI_TYPE],
    })
    transaction.moveCall({
        target: `${nftProtocolPackage}::transfer_allowlist::confirm_transfer`,
        arguments: [transaction.pure(transferAllowlist), buyNftResult],
        typeArguments: [collection.type],
    })
    transaction.moveCall({
        target: `${nftProtocolPackage}::royalty_strategy_bps::confirm_transfer`,
        arguments: [transaction.pure(bpsRoyaltyStrategy), buyNftResult],
        typeArguments: [collection.type, SUI_TYPE],
    })
    transaction.moveCall({
        target: `${requestPackage}::transfer_request::confirm`,
        arguments: [buyNftResult, transaction.pure(transferPolicy)],
        typeArguments: [collection.type, SUI_TYPE],
    })

    transaction.transferObjects([splitCoins[index]], transaction.pure(currentAccount))
    return transaction
}

const somisBuyNft = ({
    collection,
    nft,
    transaction,
    splitCoins,
    index,
    dappPackage,
}: {
    collection: Collection
    nft: SNft
    transaction: TransactionBlock
    splitCoins: TransactionResult
    index: number
    dappPackage: string
}) => {
    const collectionOrderbook = collection.somisOrderbook
    if (!collection || !nft.order || !collectionOrderbook || !collection.type) {
        throw new Error('Nft cannot be bought')
    }

    const orderId = nft.order.id

    if (!orderId) {
        throw new Error('Order id is not set')
    }
    transaction.moveCall({
        target: `${dappPackage}::marketplace::buy_nft`,
        arguments: [transaction.object(collectionOrderbook), transaction.pure(nft.address), splitCoins[index]],
        typeArguments: [collection.type, SUI_TYPE],
    })
    // transaction.transferObjects([splitCoins[index]], transaction.pure(currentAccount))

    return transaction
}

const buyNfts = async (
    inputs: {
        nft: SNft
        dappPackage: string
        collection: Collection
        allowlist: string
    }[],
    requestPackage: string,
    nftProtocolPackage: string,
    currentAccount: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signAndExecuteTransactionBlock: (transactionInput: any) => Promise<SuiTransactionBlockResponse>,
) => {
    if (currentAccount == null) {
        throw new Error('currentAccount cannot be null')
    }
    let transaction = new TransactionBlock()

    const { coins } = await blockChainService.getBalanceByWalletAddress(currentAccount)
    const totalBalance = coins.reduce((acc, coin) => add(acc, Number(coin.balance)), 0)
    const nftTotal = inputs.reduce((acc, { nft }) => add(acc, nft.order?.price), 0)

    if (totalBalance < nftTotal) {
        throw new Error('Insufficient balance')
    }
    const splitCoins = transaction.splitCoins(
        transaction.gas,
        inputs.map(({ nft }) => transaction.pure(convertSuiToMist(Number(nft.order?.price)))),
    )
    for (const index in inputs) {
        const { nft, dappPackage, collection } = inputs[index]
        const type = nft.order?.orderbookType ?? nft.collection?.orderbookType ?? OrderbookType.Somis
        if (!collection.type) {
            throw new Error('Collection type is not set')
        }
        if (type === OrderbookType.Ob) {
            transaction = originalByteBuyNft({
                collection,
                nft,
                transaction,
                splitCoins,
                index: Number(index),
                dappPackage,
                currentAccount,
            })
        } else if (type === OrderbookType.ObV1) {
            const createNewKiosk = () => {
                const { koiskPackage } = appContext.getConfig()
                const [newKiosk] = transaction.moveCall({
                    target: `${koiskPackage}::ob_kiosk::new`,
                })
                return newKiosk
            }
            const existBuyerKiosk = await blockChainService.getOwnedOriginbyteKiosk(currentAccount)
            const buyerKiosk = existBuyerKiosk ?? createNewKiosk()
            if (!collection?.orderbook) {
                throw new Error('Collection orderbook is not set')
            }

            // const packageAddress = await getOrderbookPackage(collection?.orderbook)
            transaction = originalByteV1BuyNft({
                collection,
                nft,
                transaction,
                splitCoins,
                index: Number(index),
                requestPackage,
                currentAccount,
                nftProtocolPackage,
                buyerKiosk: buyerKiosk,
                // packageAddress,
            })
            if (!existBuyerKiosk) {
                transaction.moveCall({
                    target: `0x0000000000000000000000000000000000000000000000000000000000000002::transfer::public_share_object`,
                    arguments: [buyerKiosk as TransactionResult],
                    typeArguments: ['0x2::kiosk::Kiosk'],
                })
            }
        } else {
            transaction = somisBuyNft({
                collection,
                nft,
                transaction,
                splitCoins,
                index: Number(index),
                dappPackage,
            })
        }

        transaction.moveCall({
            target: `${dappPackage}::common_event::emit_somis_trade_event`,
            arguments: [
                transaction.pure(EmitEventType.Buy),
                transaction.pure(nft.address),
                transaction.pure(convertSuiToMist(Number(nft.order?.price))),
            ],
            typeArguments: [collection.type, SUI_TYPE],
        })
    }

    if (EnableFixedGasPrice) {
        transaction.setGasBudget((DEFAULT_MIN_GAS_BUDGET * inputs.length) / 2)
    }

    const result = await signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        options: {
            showEvents: true,
            showEffects: true,
            showObjectChanges: true,
        },
    })

    if (!result.effects) {
        throw new Error('Transaction failed')
    }

    if (result.effects.status.status === 'failure') {
        const error = result.effects.status.error
        if (!error) {
            throw new Error('Transaction failed')
        }
        if (error.includes('InsufficientCoinBalance') || error.includes('InsufficientGas')) {
            throw new Error('Insufficient Gas Fee to execute transaction')
        }
        console.log('buy nft err', error)
        throw new Error('Transaction failed, please try again')
    }

    return true
}

/**
 * Get NFTs by their addresses from the SUI protocol
 * @param addresses
 * @returns {UseNfts}
 */
export const useNfts = (addresses: string[]): UseNfts => {
    const [loading, setLoading] = useState(true)
    const [nfts, setNfts] = useState<OriginBytesNft[]>([])
    const [error, setError] = useState<string | undefined>(undefined)

    const fetch = async (focus = false) => {
        setLoading(true)
        setError(undefined)
        try {
            const nfts = await getNftByNftAddresses(addresses, focus)
            setNfts(nfts)
            setLoading(false)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setError(error.message)
            setLoading(false)
        }
    }

    return { loading, nfts, error, fetch }
}

/**
 * List NFT by address
 * @param address
 */
export const useListNft = (nft: Nft) => {
    const { signAndExecuteTransactionBlock, currentAccount } = walletKit.useWalletKit()
    const { refreshBalance } = authContext.useAuthState()
    const owner = nft?.owner
    const orderbookType = nft?.collection?.orderbookType ?? OrderbookType.Somis
    const canList = owner?.address && currentAccount && currentAccount?.address === owner?.address
    const [error, setError] = useState<string | null>(null)
    const [isListing, setIsListing] = useState(false)

    return {
        isListing,
        canList,
        error,
        list: async (price: number, kiosk: string | null) => {
            setError(null)
            if (currentAccount == null) {
                setError('Please connect your wallet')
                throw new Error('currentAccount cannot be null')
            }
            if (!nft?.collection) {
                setError('Collection is not set')
                throw new Error('Collection is not set')
            }

            setIsListing(true)
            try {
                const mistPrice = convertSuiToMist(price.toString())
                const nftType = nft.type
                const { dappPackage, commissionAddress, commissionBps } = appContext.getConfig()

                if (!nftType) {
                    throw new Error('Nft type is not set')
                }
                if (!nft?.collection?.somisOrderbook && !nft?.collection?.orderbook) {
                    throw new Error('Collection orderbook is not set')
                }
                const transaction = new TransactionBlock()

                // Our Orderbook
                if (orderbookType === OrderbookType.Somis) {
                    const orderbook = nft?.collection?.somisOrderbook
                    transaction.add({
                        kind: 'MoveCall',
                        target: `${dappPackage}::marketplace::create_ask`,
                        arguments: [
                            transaction.pure(orderbook),
                            transaction.pure(nft.address),
                            transaction.pure(mistPrice.toString()),
                        ],
                        typeArguments: [nftType, SUI_TYPE],
                    })
                    // original byte orderbook, OB and V1 is same
                } else {
                    const orderbook = nft?.collection?.orderbook

                    if (!orderbook) {
                        throw new Error('Orderbook is not set')
                    }

                    // const package_ = await getOrderbookPackage(orderbook)
                    const package_ = getConfig().liquidityLayerV1Package

                    if (!package_ || !orderbook) {
                        throw new Error('Package is not set')
                    }
                    const syncKiosk = kiosk ?? (await getOwnedOriginbyteKiosk(currentAccount.address))
                    if (!syncKiosk) {
                        throw new Error('Kiosk is not set')
                    }

                    const commission = calculateCommission(price, Number(commissionBps))
                    const mistPlatformFee = convertSuiToMist(commission.toString())

                    transaction.add({
                        kind: 'MoveCall',
                        target: `${package_}::orderbook::create_ask_with_commission`,
                        arguments: [
                            transaction.object(orderbook),
                            transaction.object(syncKiosk),
                            transaction.pure(mistPrice.toString()),
                            transaction.pure(nft.address),
                            transaction.pure(commissionAddress),
                            transaction.pure(mistPlatformFee),
                        ],
                        typeArguments: [nftType, SUI_TYPE],
                    })
                }

                transaction.moveCall({
                    target: `${dappPackage}::common_event::emit_somis_trade_event`,
                    arguments: [
                        transaction.pure(EmitEventType.List),
                        transaction.pure(nft.address),
                        transaction.pure(mistPrice.toString()),
                    ],
                    typeArguments: [nftType, SUI_TYPE],
                })

                if (EnableFixedGasPrice) {
                    transaction.setGasBudget(DEFAULT_MIN_GAS_BUDGET)
                }
                const result = await signAndExecuteTransactionBlock({
                    transactionBlock: transaction,
                    options: {
                        showEvents: true,
                        showEffects: true,
                        showObjectChanges: true,
                    },
                })
                if (!result.effects) {
                    throw new Error('Transaction failed')
                }

                if (result.effects.status.status === 'failure') {
                    console.log('list nft err', result)
                    const error = result.effects.status.error
                    if (!error) {
                        throw new Error('Transaction failed')
                    }
                    if (error.includes('InsufficientCoinBalance') || error.includes('InsufficientGas')) {
                        throw new Error('Insufficient Gas Fee to execute transaction')
                    }
                    throw new Error('Transaction failed, please try again')
                }

                setIsListing(false)
                refreshBalance()
                return true // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.log('list nft err throw', error)
                setIsListing(false)
                setError(error.message)
                throw error
            }
        },
    }
}

/**
 * Cancel NFT listing
 * @param nft
 */
export const useCancelNft = (nft: SNft, options: { onSuccess?: () => void }) => {
    const { signAndExecuteTransactionBlock, currentAccount } = walletKit.useWalletKit()
    const { refreshBalance } = authContext.useAuthState()
    const [isCanceling, setIsCanceling] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sellerKiosk, setSellerKiosk] = useState<string | null>(nft?.kioskAddress ?? null)

    useEffect(() => {
        setSellerKiosk(nft?.kioskAddress ?? nft?.order?.sellerKiosk ?? null)
    }, [nft])

    const cancelAsk = async ({
        dappPackage,
        collectionType,
        collectionOrderbook,
        kiosk,
        price,
        orderId,
    }: {
        dappPackage: string
        collectionType: string
        collectionOrderbook: string
        kiosk: string
        price: string | null
        orderId: string | null
    }) => {
        if (!price) {
            throw new Error('Price is not set')
        }
        if (!orderId) {
            throw new Error('Order id is not set')
        }
        const bigIntMinPrice = convertSuiToMist(price)
        const transaction = new TransactionBlock()
        // const package_ = await getOrderbookPackage(collectionOrderbook)
        const package_ = getConfig().liquidityLayerV1Package

        transaction.moveCall({
            target: `${package_}::orderbook::cancel_ask`,
            arguments: [
                transaction.object(collectionOrderbook),
                transaction.object(kiosk),
                transaction.pure(bigIntMinPrice.toString()),
                transaction.pure(nft.address),
            ],
            typeArguments: [collectionType, SUI_TYPE],
        })

        transaction.moveCall({
            target: `${dappPackage}::common_event::emit_somis_trade_event`,
            arguments: [
                transaction.pure(EmitEventType.Cancel),
                transaction.pure(nft.address),
                transaction.pure(bigIntMinPrice.toString()),
            ],
            typeArguments: [collectionType, SUI_TYPE],
        })

        if (EnableFixedGasPrice) {
            transaction.setGasBudget(DEFAULT_MIN_GAS_BUDGET)
        }

        const result = await signAndExecuteTransactionBlock({
            transactionBlock: transaction,
            options: {
                showEvents: true,
                showEffects: true,
                showObjectChanges: true,
            },
        })

        if (!result.effects) {
            throw new Error('Transaction failed')
        }

        if (result.effects.status.status === 'failure') {
            const error = result.effects.status.error
            if (!error) {
                throw new Error('Transaction failed')
            }
            if (error.includes('InsufficientCoinBalance') || error.includes('InsufficientGas')) {
                throw new Error('Insufficient Gas Fee to execute transaction')
            }
            throw new Error('Transaction failed, please try again')
        }
    }

    const somisCancelAsk = async ({
        dappPackage,
        collectionType,
        collectionOrderbook,
        price,
        orderId,
    }: {
        dappPackage: string
        collectionType: string
        collectionOrderbook: string
        price: string | null
        orderId: string | null
    }) => {
        if (!price) {
            throw new Error('Price is not set')
        }
        if (!orderId) {
            throw new Error('Order id is not set')
        }
        const bigIntMinPrice = convertSuiToMist(price)
        const transaction = new TransactionBlock()

        transaction.moveCall({
            target: `${dappPackage}::marketplace::cancel_ask`,
            arguments: [
                transaction.object(collectionOrderbook),
                transaction.pure(nft.address),
                transaction.pure(bigIntMinPrice.toString()),
            ],
            typeArguments: [collectionType, SUI_TYPE],
        })

        transaction.moveCall({
            target: `${dappPackage}::common_event::emit_somis_trade_event`,
            arguments: [
                transaction.pure(EmitEventType.Cancel),
                transaction.pure(nft.address),
                transaction.pure(bigIntMinPrice.toString()),
            ],
            typeArguments: [collectionType, SUI_TYPE],
        })

        if (EnableFixedGasPrice) {
            transaction.setGasBudget(DEFAULT_MIN_GAS_BUDGET)
        }

        const result = await signAndExecuteTransactionBlock({
            transactionBlock: transaction,
            options: {
                showEvents: true,
                showEffects: true,
                showObjectChanges: true,
            },
        })

        if (!result.effects) {
            throw new Error('Transaction failed')
        }

        if (result.effects.status.status === 'failure') {
            const error = result.effects.status.error
            if (!error) {
                throw new Error('Transaction failed')
            }
            if (error.includes('InsufficientCoinBalance') || error.includes('InsufficientGas')) {
                throw new Error('Insufficient Gas Fee to execute transaction')
            }
            throw new Error('Transaction failed, please try again')
        }
    }

    return {
        isCanceling,
        error,
        cancel: async (price?: number) => {
            setError(null)
            setIsCanceling(true)
            try {
                if (currentAccount == null) {
                    throw new Error('currentAccount cannot be null')
                }
                const safe = sellerKiosk
                const orderId = nft?.order?.id
                const { dappPackage } = appContext.getConfig()
                const type = nft.order?.orderbookType ?? nft?.collection?.orderbookType ?? OrderbookType.Somis
                if (type !== OrderbookType.Somis) {
                    if (!nft.collection || !nft.collection?.orderbook || !safe || !nft.collection?.type) {
                        throw new Error(`Nft cannot be canceled`)
                    }

                    const collectionOrderbook = nft.collection.orderbook
                    const collectionWithdrawPolicy = nft.collection.withdrawPolicy

                    try {
                        await cancelAsk({
                            dappPackage,
                            collectionType: nft.collection.type,
                            collectionOrderbook,
                            kiosk: safe,
                            price: price ?? nft.order?.price ?? null,
                            orderId: orderId ?? null,
                        })

                        options?.onSuccess?.()
                        refreshBalance()
                        return true
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (err: any) {
                        console.error(err)
                        setError(err.message)
                        throw err
                    }
                } else {
                    if (!nft.collection || !nft.collection?.somisOrderbook || !nft.collection?.type) {
                        throw new Error(`Nft cannot be canceled`)
                    }
                    const collectionOrderbook = nft.collection.somisOrderbook

                    try {
                        await somisCancelAsk({
                            dappPackage,
                            collectionType: nft.collection?.type,
                            collectionOrderbook,
                            price: price ?? nft.order?.price ?? null,
                            orderId: orderId ?? null,
                        })

                        options?.onSuccess?.()
                        refreshBalance()
                        return true
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (err: any) {
                        console.error(err)
                        setError(err.message)
                        throw err
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                setError(error.message)
                throw error
            } finally {
                setIsCanceling(false)
            }
        },
    }
}

interface SNft extends Nft {
    kioskAddress?: string
}

/**
 * Batch buy NFTs
 */
export const useBatchBuyNfts = (nfts: SNft[], collection: Collection) => {
    const { signAndExecuteTransactionBlock, currentAccount } = walletKit.useWalletKit()
    const { balance, getBalance, refreshBalance } = authContext.useAuthState()
    const [error, setError] = useState<string | null>(null)
    const [isBuying, setIsBuying] = useState(false)
    const [canBuy, setCanBuy] = useState(false)
    const { setChildren, open } = useAlert()

    const totalPrice = nfts.reduce((acc, nft) => {
        return acc + convertSuiToMist(nft.order?.price ?? 0)
    }, BigInt(0))

    const totalSuiPrice = nfts.reduce((acc, nft) => {
        return acc + (Number(nft.order?.price) ?? 0)
    }, 0)

    useEffect(() => {
        const canBuy =
            nfts.every(
                (nft) => nft.owner?.address && currentAccount?.address && currentAccount.address !== nft.owner?.address,
            ) && getBalance() >= totalPrice

        setCanBuy(canBuy)
    }, [nfts, balance])

    return {
        isBuying,
        error,
        buy: async () => {
            setError(null)
            setIsBuying(true)
            try {
                if (currentAccount == null) {
                    throw new Error('currentAccount cannot be null')
                }
                if (!canBuy) {
                    throw new Error('Nfts cannot be bought')
                }

                const orders = nfts
                    .map((nft) => nft.order)
                    .filter((order) => order !== null || order !== undefined) as Order[]

                if (orders.length !== nfts.length) {
                    throw new Error('Orders cannot be null')
                }

                // const sellerSafes = orders
                //     .map((order) => order.sellerSafe)
                //     .filter((sellerSafe) => typeof sellerSafe === 'string') as string[]

                // if (sellerSafes.length !== nfts.length) {
                //     throw new Error('Seller safes cannot be null')
                // }

                const { dappPackage, allowlist, nftProtocolPackage, requestPackage } = appContext.getConfig()

                try {
                    await buyNfts(
                        nfts.map((nft) => ({
                            nft,
                            dappPackage,
                            collection,
                            allowlist,
                        })),
                        requestPackage,
                        nftProtocolPackage,
                        currentAccount.address,
                        signAndExecuteTransactionBlock,
                    )
                    setChildren(
                        `Successfully bought ${nfts.length} NFT${nfts.length > 1 ? 's' : ''} for ${totalSuiPrice} SUI`,
                    )
                } catch (error) {
                    console.error(`Error while buying nfts`, error)
                    setChildren(`Failed buying ${nfts.length} NFT${nfts.length > 1 ? 's' : ''}`)

                    open()
                    refreshBalance()
                    return false
                }

                open()
                refreshBalance()
                return true
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                setIsBuying(false)
                setError(error.message)
                throw error
            }
        },
    }
}
