import { Button, Flex, Image, Typography } from '~/components'
import { PrecreateNft } from '../types'
import { useState } from 'react'
import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { delay, splitNftName } from '~/utils/helpers'
import { FormSection } from '~/components/FormSection'
import { Radio } from '~/components/Input/Radio'
import { OriginBytesNft, getAllOwnedObjects, getNftByNftAddresses } from '~/services/blockChain'

import WalletKitContext from '~/components/Wallet/WalletKitContext'
import { Launchpad } from '~/gql/generated/graphql'
import { TransactionBlock } from '@mysten/sui.js'
import { DEFAULT_MIN_GAS_BUDGET, EnableFixedGasPrice } from '~/utils/sui'
import { toast } from 'react-hot-toast'

export const PreviewStep = ({
    precreateNfts: nfts,
    onCancel,
    launchpad,
    onSuccess,
    onError,
    onMinting,
}: {
    precreateNfts: PrecreateNft[]
    launchpad: Launchpad
    onCancel?: () => void
    onSuccess: (nfts: PrecreateNft[]) => Promise<void> | void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: (error: any) => void
    onMinting?: (minting: boolean) => void
}) => {
    const { t } = useTranslation('studio')
    const [batchNumber, setBatchNumber] = useState<number | null>(null)
    const { signAndExecuteTransactionBlock, currentAccount } = WalletKitContext.useWalletKit()

    const mint = async (
        nfts: {
            imageUrl: string
            name: string
            description: string
            attributes?: {
                name: string
                value: string
            }[]
            address: string | null
            state: 'inQueue' | 'minting' | 'minted' | 'failed'
        }[],
    ) => {
        try {
            onMinting?.(true)
            const supply = nfts.length
            const objects = await getAllOwnedObjects(currentAccount?.address || '')
            const [package_, module_] = launchpad.collection?.type?.split('::') || []
            const type = launchpad.collection?.type?.replace('0x0', '0x')
            const originType = launchpad.collection?.type
            const mintCapObj =
                objects.find((it) => it.data && it.data?.type?.includes(`::MintCap<${type}>`)) ||
                objects.find((it) => it.data && it.data?.type?.includes(`::MintCap<${originType}>`))
            const mintCap = mintCapObj?.data?.objectId
            const listing = launchpad.listing
            const warehouse = launchpad.warehouse
            console.log('warehouse', warehouse)
            if (!mintCap || !listing || !warehouse) {
                throw new Error('Missing mintCap, listing or warehouse')
            }

            if (batchNumber == null) {
                throw new Error('Batch number is not set')
            }

            // split nfts by batch number
            const splittedNftCount = Math.ceil(supply / batchNumber)

            const splittedNfts = Array.from({ length: splittedNftCount }, (_, i) => {
                const start = i * batchNumber
                const end = start + batchNumber
                return nfts.slice(start, end)
            })

            for (let index = 0; index < splittedNfts.length; index++) {
                const tx = new TransactionBlock()
                const nfts = splittedNfts[index]
                nfts.forEach((nft) => {
                    tx.moveCall({
                        target: `${package_}::${module_}::mint_nft`,
                        typeArguments: [],
                        arguments: [
                            tx.pure(nft.name),
                            tx.pure(nft.description),
                            tx.pure(nft.imageUrl),
                            tx.pure(nft.attributes ? nft.attributes.map((it) => it.name) : []),
                            tx.pure(nft.attributes ? nft.attributes.map((it) => it.value) : []),
                            tx.object(mintCap),
                            tx.object(listing),
                            tx.object(warehouse),
                        ],
                    })
                })

                if (EnableFixedGasPrice) {
                    tx.setGasBudget(DEFAULT_MIN_GAS_BUDGET * (nfts.length / 2))
                }

                const res = await signAndExecuteTransactionBlock({
                    transactionBlock: tx,
                    options: {
                        showInput: true,
                        showEffects: true,
                        showEvents: true,
                        showObjectChanges: true,
                    },
                })
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
                const nftsRes = res.objectChanges
                    ?.filter((it) => it.type === 'created' && it.objectType.includes(`::${module_}`))
                    .map((it) => (it as { objectId: string }).objectId)
                let getNfts: OriginBytesNft[] = []
                let success = false
                let count = 0
                while (!success && count < 20) {
                    try {
                        getNfts = await getNftByNftAddresses(nftsRes ?? [])
                        success = true
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (error: any) {
                        count++
                        // console.error(error)
                        console.log('retrying', count)
                        await delay(1000 * count)
                    }
                }

                if (!success) {
                    throw new Error('Minting failed')
                }

                const newNfts = nfts.map((nft) => {
                    const address = getNfts.find((it) => it.name === nft.name)?.address || null
                    return {
                        ...nft,
                        address,
                        state: address ? 'minted' : 'failed',
                    } as PrecreateNft
                })
                const succesRes = nfts.map((it) => newNfts.find((nft) => nft.name === it.name) || it)

                await onSuccess(succesRes)
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error)
            onError?.(error)
            toast(error.message ?? 'Minting failed, please check your balance and try again')
        }
    }

    return (
        <Flex
            fullWidth
            flexDirection="column"
            className={clsx('border-t', 'border-b', 'color-border', 'py-6', 'w-full lg:w-1/2')}
            gap={10}
        >
            <Typography variant="xl">{t('preview')}</Typography>
            <Flex fullWidth flexDirection="column" gap={2}>
                {/* Header */}
                <Flex fullWidth gap={12}>
                    <Flex className="w-[40px]" />
                    <Flex className="flex-[1_1_10%]">
                        <Typography variant="md" bold color="gray">
                            {t('label.nftName')}
                        </Typography>
                    </Flex>
                    <Flex className="flex-[1_1_10%]">
                        <Typography variant="md" bold color="gray">
                            {t('label.number')}
                        </Typography>
                    </Flex>
                </Flex>
                {/* Body */}
                <Flex fullWidth flexDirection="column" gap={2}>
                    {nfts.map((nft, index) => (
                        <Flex fullWidth gap={12} alignItems="center" key={index}>
                            <Flex className="w-[40px]">
                                <Image src={nft.imageUrl} className={clsx('w-10', 'h-10')} />
                            </Flex>
                            <Flex className="flex-[1_1_10%]" alignItems="center">
                                <Typography variant="md">{splitNftName(nft.name).name}</Typography>
                            </Flex>
                            <Flex className="flex-[1_1_10%]" alignItems="center">
                                <Typography variant="md">{splitNftName(nft.name).code}</Typography>
                            </Flex>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
            {/* Batch Number */}
            <FormSection title={t('label.batchNumber')} name="batchNumber">
                <Flex justifyContent="start" gap={8} className="w-3/12">
                    <Radio
                        reverse
                        className="w-1/12"
                        value={10}
                        label={'10'}
                        onClick={() => {
                            setBatchNumber((p) => (p === 10 ? null : 10))
                        }}
                        checked={batchNumber === 10}
                    />
                    <Radio
                        reverse
                        className="w-1/12"
                        value={25}
                        label={'25'}
                        onClick={() => {
                            setBatchNumber((p) => (p === 25 ? null : 25))
                        }}
                        checked={batchNumber === 25}
                    />
                    <Radio
                        reverse
                        className="w-1/12"
                        value={50}
                        label={'50'}
                        onClick={() => {
                            setBatchNumber((p) => (p === 50 ? null : 50))
                        }}
                        checked={batchNumber === 50}
                    />
                </Flex>
            </FormSection>
            {/* Buttons */}
            <Flex fullWidth justifyContent="between">
                <Button
                    type="button"
                    variant="tertiary"
                    title={'Back'}
                    onClick={() => {
                        onCancel?.()
                    }}
                />
                <Button
                    type="button"
                    variant="primary"
                    title={'Next'}
                    className={clsx('w-1/6')}
                    disabled={batchNumber === null}
                    onClick={async () => {
                        await mint(nfts)
                    }}
                />
            </Flex>
        </Flex>
    )
}
