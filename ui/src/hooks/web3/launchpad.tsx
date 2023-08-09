import { CoinStruct, SUI_CLOCK_OBJECT_ID, TransactionBlock } from '@mysten/sui.js'
import { useEffect, useState } from 'react'
import walletKit from '~/components/Wallet/WalletKitContext'
import appContext from '~/contexts/app'
import { Launchpad, Venue, useUpdateLaunchpadMutation } from '~/gql/generated/graphql'
import {
    getCreatedObjectByType,
    OriginBytesNft,
    selectCoinsWithBalanceGreaterThanOrEqual,
    SUI_TYPE,
} from '~/services/blockChain'
import { convertSuiToMist, DEFAULT_GAS_BUDGET, EnableFixedGasPrice } from '~/utils/sui'
import blockchainService from '~/services/blockChain/service'
import { DateTime } from 'luxon'
import { debounce } from 'lodash'
import { toast } from 'react-hot-toast'

export function useMintLaunchpad(launchpad: Launchpad) {
    const { signAndExecuteTransactionBlock, currentAccount } = walletKit.useWalletKit()
    const [isMinting, setIsMinting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isMinted, setIsMinted] = useState(false)
    const [nftAddresses, setNftAddresses] = useState<string[] | null>(null)
    const [isLaunchpadStarted, setIsLaunchpadStarted] = useState(false)

    useEffect(() => {
        if (launchpad.launchDate) {
            const launchpadDate = new Date(launchpad.launchDate).getTime()
            const interval = setInterval(() => {
                const now = new Date().getTime()
                if (now >= launchpadDate) {
                    setIsLaunchpadStarted(true)
                    clearInterval(interval)
                }
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [])
    return {
        isMinting,
        readyToMint: !!(
            launchpad.collection &&
            launchpad.listing &&
            launchpad.warehouse &&
            launchpad.market &&
            isLaunchpadStarted
        ),
        isMinted,
        mint: async (mintCount = 1, nftType: string, venue: Venue, certAddresses?: string[]) => {
            console.log('launchpad.warehouse', launchpad.warehouse)
            setError(null)
            if (currentAccount == null) {
                setError('Please connect your wallet')
                throw new Error('currentAccount cannot be null')
            }

            if (!launchpad.collection) {
                setError('Collection is not defined')
                throw new Error('Collection is not defined')
            }

            const { launchpadPackage, koiskPackage } = appContext.getConfig()
            if (!launchpadPackage) {
                setError('Launchpad package is not defined')
                throw new Error('Launchpad package is not defined')
            }
            if (!venue.isPublicSale && mintCount !== certAddresses?.length) {
                setError('Your whitelist is not match with mint count')
                throw new Error('Your whitelist is not match with mint count')
            }
            setIsMinting(true)
            const { coins } = await blockchainService.getBalanceByWalletAddress(currentAccount.address)
            const bigIntMinPrice = convertSuiToMist(Number(venue.price) * mintCount)
            const selectedCoins = selectCoinsWithBalanceGreaterThanOrEqual(coins, bigIntMinPrice) as
                | CoinStruct[]
                | undefined
            if (selectedCoins) {
                try {
                    const transaction = new TransactionBlock()
                    const createNewKiosk = () => {
                        const [newKiosk] = transaction.moveCall({
                            target: `${koiskPackage}::ob_kiosk::new`,
                        })
                        return newKiosk
                    }
                    const existBuyerKiosk = await blockchainService.getOwnedOriginbyteKiosk(currentAccount.address)
                    const buyerKiosk = existBuyerKiosk ?? createNewKiosk()
                    const coins = transaction.splitCoins(
                        transaction.gas,
                        Array.from({ length: mintCount }).map(() =>
                            transaction.pure(convertSuiToMist(Number(venue.price))),
                        ),
                    )
                    const module_ = venue.maxMintPerWallet === -1 ? 'fixed_price' : 'limited_fixed_price'
                    const function_ = venue.isPublicSale ? 'buy_nft_into_kiosk' : 'buy_whitelisted_nft_into_kiosk'

                    for (let i = 0; i < mintCount; i++) {
                        // console.log({
                        //     target: `${launchpadPackage}::${module_}::${function_}`,
                        //     arguments: [
                        //         launchpad.listing,
                        //         venue.address,
                        //         coins[i],
                        //         buyerKiosk,
                        //     ],
                        // })
                        transaction.moveCall({
                            target: `${launchpadPackage}::${module_}::${function_}`,
                            arguments: venue.isPublicSale
                                ? [
                                      transaction.object(launchpad.listing as string),
                                      transaction.object(venue.address as string),
                                      coins[i],
                                      typeof buyerKiosk === 'string' ? transaction.pure(buyerKiosk) : buyerKiosk,
                                  ]
                                : [
                                      transaction.object(launchpad.listing as string),
                                      transaction.object(venue.address as string),
                                      coins[i],
                                      typeof buyerKiosk === 'string' ? transaction.pure(buyerKiosk) : buyerKiosk,
                                      transaction.object(certAddresses?.[i] as string),
                                  ],
                            typeArguments: [nftType, SUI_TYPE],
                        })
                        transaction.transferObjects([coins[i]], transaction.pure(currentAccount.address))
                    }

                    if (!existBuyerKiosk) {
                        transaction.moveCall({
                            target: `0x0000000000000000000000000000000000000000000000000000000000000002::transfer::public_share_object`,
                            arguments: [buyerKiosk as any],
                            typeArguments: ['0x2::kiosk::Kiosk'],
                        })
                    }

                    if (EnableFixedGasPrice) {
                        transaction.setGasBudget(DEFAULT_GAS_BUDGET * (mintCount * 0.25))
                    }

                    const result = await signAndExecuteTransactionBlock({
                        transactionBlock: transaction,
                        options: {
                            showEffects: true,
                            showEvents: true,
                            showObjectChanges: true,
                        },
                    })
                    if (!result.effects) {
                        throw new Error('Transaction failed')
                    }

                    if (result.effects.status.status === 'failure') {
                        console.log('err: ', result.effects.status.error)
                        const error = result.effects.status.error
                        if (!error) {
                            throw new Error('Transaction failed, please try again')
                        }
                        if (error.includes('InsufficientCoinBalance') || error.includes('InsufficientGas')) {
                            throw new Error('Insufficient Gas Fee to execute transaction')
                        }
                        if (/assert_is_live/i.test(error)) {
                            throw new Error('Mining is not started yet')
                        }
                        throw new Error('Transaction failed, please try again')
                    }
                    const objectChange = result?.objectChanges?.filter(
                        (change) => 'objectType' in change && change?.objectType === nftType,
                    ) as
                        | {
                              objectType: string
                              objectId: string
                          }[]
                        | undefined
                    const addresses = objectChange?.map((change) => change.objectId) ?? []
                    setNftAddresses(addresses)
                    setIsMinted(true)
                    return { nftAddresses: addresses, txId: result?.effects?.transactionDigest }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (err: any) {
                    console.log('catch err', err)
                    setError(err.message)
                    throw err
                } finally {
                    setIsMinting(false)
                }
            } else {
                setIsMinting(false)
                setError('Insufficient balance')
                throw new Error('Fail no coin has enough balance')
            }
        },
        error,
        nftAddresses,
    }
}

export function useLaunchpadList(launchpad: Launchpad) {
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(true)
    const [total, setTotal] = useState<number | null>(null)
    const [minted, setMinted] = useState<number | null>(null)
    const [nftType, setNftType] = useState<string | null>(null)
    const [process, setProcess] = useState(0)
    const [canMint, setCanMint] = useState(false)

    const fetch = async () => {
        try {
            setRefresh(false)
            setLoading(true)
            const res = await blockchainService.getLaunchpadInfo(launchpad)
            const { total, sold, remain, nftType } = res
            setTotal(total)
            setMinted(sold)
            setNftType(nftType)
            setProcess((sold / total) * 100)
            setCanMint(remain > 0)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        if (launchpad.listing && launchpad.warehouse && refresh) {
            fetch()
        }
    }, [launchpad, refresh])

    return {
        loading,
        total,
        minted,
        nftType,
        process,
        canMint,
        refresh: () => setRefresh(true),
    }
}

export function useCreateMetadataStore() {
    const { currentAccount, signAndExecuteTransactionBlock } = walletKit.useWalletKit()
    const [isCreating, setIsCreating] = useState(false)

    const { mutateAsync: updateLaunchpad } = useUpdateLaunchpadMutation()

    return {
        isCreating,
        readyToCreate: !!currentAccount,
        create: async (
            launchpad: Launchpad,
            mintInfo: {
                remain: number
                sold: number
                total: number
                launchpad: Launchpad
            } | null,
        ) => {
            if (!currentAccount) {
                throw new Error('Please connect your wallet')
            }

            const total = mintInfo?.total ?? 0
            const metadataTotal = launchpad.hatchMetadata?.length ?? 0
            if (total !== metadataTotal || total === 0) {
                throw new Error('Metadata is not match with mint count')
            }
            if (launchpad.metadataStore) {
                throw new Error('Metadata store is already created')
            }
            setIsCreating(true)
            try {
                const publisher = launchpad.publisher
                if (!publisher) {
                    throw new Error('Publisher not found')
                }
                const [package_, module_] = launchpad.collection?.type?.split('::') || []
                const transactionBlock = new TransactionBlock()
                const metadataStoreChain = transactionBlock.moveCall({
                    target: `${package_}::${module_}::create_metadata_store`,
                    typeArguments: [],
                    arguments: [
                        transactionBlock.object(publisher),
                        transactionBlock.pure(DateTime.fromISO(launchpad.hatchDate ?? '').toMillis()),
                    ],
                })
                launchpad.hatchMetadata?.forEach((item) => {
                    transactionBlock.moveCall({
                        target: `${package_}::${module_}::insert_nft_metadata`,
                        typeArguments: [],
                        arguments: [
                            transactionBlock.object(publisher),
                            metadataStoreChain,
                            transactionBlock.pure(item.name),
                            transactionBlock.pure(item.description),
                            transactionBlock.pure(item.imageUrl),
                            transactionBlock.pure(item.attributes?.map((attr) => attr.name) ?? []),
                            transactionBlock.pure(item.attributes?.map((attr) => attr.value) ?? []),
                        ],
                    })
                })

                transactionBlock.moveCall({
                    target: `0x0000000000000000000000000000000000000000000000000000000000000002::transfer::public_share_object`,
                    arguments: [metadataStoreChain as any],
                    typeArguments: [`${package_}::${module_}::MetadataStore`],
                })
                const res = await signAndExecuteTransactionBlock({
                    transactionBlock,
                    options: {
                        showInput: true,
                        showEffects: true,
                        showEvents: true,
                        showObjectChanges: true,
                    },
                })
                const metadataStore = getCreatedObjectByType(res, /MetadataStore/)
                if (!metadataStore) {
                    throw new Error('Transaction failed, please try again (MetadataStore not found)')
                }
                if (res?.effects?.status.status === 'failure') {
                    const error = res.effects.status.error
                    if (!error) {
                        throw new Error('Transaction failed')
                    }
                    if (error.includes('InsufficientCoinBalance') || error.includes('InsufficientGas')) {
                        throw new Error('Insufficient Gas Fee to execute transaction')
                    }
                    throw new Error('Transaction failed, please try again')
                }

                await updateLaunchpad({
                    id: launchpad.id,
                    input: { metadataStore },
                })
            } catch (error: any) {
                throw new Error(error.message)
            } finally {
                setIsCreating(false)
            }
        },
    }
}

export function useHatchLaunchpad(launchpad: Launchpad) {
    const { currentAccount, signAndExecuteTransactionBlock } = walletKit.useWalletKit()

    const [canHatch, setCanHatch] = useState(false)
    const [isHatching, setIsHatching] = useState(false)
    const [noAttributeNfts, setNoAttributeNfts] = useState<OriginBytesNft[]>([])
    const [refresh, setRefresh] = useState<Date | null>(null)

    useEffect(() => {
        const check = debounce(async () => {
            if (!currentAccount || !launchpad) {
                setCanHatch(false)
                return
            }
            try {
                const noAttributeNfts = await blockchainService.getNoAttributesNftsByType(
                    currentAccount?.address ?? '',
                    launchpad.collection?.type ?? '',
                )
                setNoAttributeNfts(noAttributeNfts)
                const hatchDate = DateTime.fromISO(launchpad.hatchDate ?? '')

                setCanHatch(noAttributeNfts.length > 0 && hatchDate < DateTime.now())
            } catch (error) {
                console.log(error)
            }
        }, 1000)
        check()
    }, [currentAccount, launchpad, refresh])

    return {
        canHatch,
        isHatching,
        noAttributeNfts,
        hatch: async () => {
            setIsHatching(true)
            try {
                const [package_, module_] = launchpad.collection?.type?.split('::') || []
                const userAddress = currentAccount?.address
                if (!userAddress) {
                    throw new Error('Please connect your wallet')
                }
                const metadataStore = launchpad.metadataStore
                const borrowPolicy = launchpad.borrowPolicy
                const buyerKiosk = await blockchainService.getOwnedOriginbyteKiosk(userAddress)
                if (!metadataStore || !borrowPolicy || !buyerKiosk) {
                    throw new Error('Metadata store or borrow policy not found')
                }

                const transactionBlock = new TransactionBlock()
                noAttributeNfts.forEach((nft) => {
                    transactionBlock.moveCall({
                        target: `${package_}::${module_}::reveal_nft`,
                        arguments: [
                            transactionBlock.object(buyerKiosk),
                            transactionBlock.pure(nft.address),
                            transactionBlock.object(metadataStore),
                            transactionBlock.object(borrowPolicy),
                            transactionBlock.object(SUI_CLOCK_OBJECT_ID),
                        ],
                    })
                })

                const res = await signAndExecuteTransactionBlock({
                    transactionBlock,
                    options: {
                        showEvents: true,
                        showEffects: true,
                        showObjectChanges: true,
                    },
                })

                if (res.effects?.status.status === 'failure') {
                    const error = res.effects.status.error
                    console.error(error)
                    if (!error) {
                        throw new Error('Transaction failed')
                    }
                    if (error.includes('InsufficientCoinBalance') || error.includes('InsufficientGas')) {
                        throw new Error('Insufficient Gas Fee to execute transaction')
                    }
                    throw new Error('Transaction failed, please try again')
                }
                setCanHatch(false)
                setRefresh(new Date())
            } catch (error: any) {
                console.log(error)
                throw new Error(error.message)
            } finally {
                setIsHatching(false)
            }
        },
    }
}
