import { TransactionBlock } from '@mysten/sui.js'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import WalletKitContext from '~/components/Wallet/WalletKitContext'
import { useAppState } from '~/contexts/app'
import { Launchpad, useUpdateLaunchpadMutation } from '~/gql/generated/graphql'
import { getAllOwnedObjects } from '~/services/blockChain'
import { DEFAULT_GAS_BUDGET, EnableFixedGasPrice } from '~/utils/sui'

export const useSetLive = () => {
    const { mutateAsync: updateLaunchpad } = useUpdateLaunchpadMutation()
    const { currentAccount, signAndExecuteTransactionBlock } = WalletKitContext.useWalletKit()
    const { config } = useAppState()
    const [loading, setLoading] = useState(false)

    const setLive = async (launchpad: Launchpad) => {
        setLoading(true)
        try {
            const objects = await getAllOwnedObjects(currentAccount?.address || '')
            // const [package_, module_] = launchpad.collection?.type?.split('::') || []
            const type = launchpad.collection?.type?.replace('0x0', '0x')
            if (!config) return

            const { launchpadPackage } = config

            const listing = launchpad.listing
            const venues = (launchpad.venues?.map((v) => v.address) || [launchpad.venue] || []).filter(
                (v) => v,
            ) as string[]
            if (!listing || venues.length === 0 || !launchpadPackage) {
                throw new Error('Missing listing or venue')
            }

            const tx = new TransactionBlock()
            for (const venue of venues) {
                tx.moveCall({
                    target: `${launchpadPackage}::listing::sale_on`,
                    typeArguments: [],
                    arguments: [tx.object(listing), tx.object(venue)],
                })
            }

            if (EnableFixedGasPrice) {
                tx.setGasBudget(DEFAULT_GAS_BUDGET)
            }

            const res = await signAndExecuteTransactionBlock({
                transactionBlock: tx,
                options: {
                    showEffects: true,
                },
            })

            if (res?.effects?.status.status === 'failure') {
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
            await updateLaunchpad({
                id: launchpad.id,
                input: {
                    launchDate: new Date().toISOString(),
                },
            })
            setLoading(false)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error)
            setLoading(false)
            toast(error.message ?? 'Failed to set Live')
            throw new Error('Failed to set live')
        }
    }

    return {
        setLive,
        loading,
    }
}
