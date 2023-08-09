import { TransactionBlock } from '@mysten/sui.js'
import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'
import { Button, Card, Coin, Flex, Image, Typography } from '~/components'
import { FormSection } from '~/components/FormSection'
import { Modal } from '~/components/Modal'
import { useWalletKit } from '~/components/Wallet'
import { getConfig } from '~/contexts/app'
import { Launchpad } from '~/gql/generated/graphql'
import { getLaunchpadInfo } from '~/services/blockChain'
import { toast } from 'react-hot-toast'
import { FileUploadInput } from '~/components/Input/FileUpload'
import Papa from 'papaparse'
import { formatAddress } from '~/utils/helpers'

export const StudioDetailCollectionSection = ({ launchpad }: { launchpad: Launchpad }) => {
    const { t } = useTranslation('studio')
    const [mintInfo, setMintInfo] = useState<{
        remain: number
        sold: number
        total: number
        launchpad: Launchpad
    } | null>(null)
    const { signAndExecuteTransactionBlock } = useWalletKit()

    const [open, setOpen] = useState(false)
    const [vuenue, setVuenue] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [whitelists, setWhitelists] = useState<
        | {
              address: string
              amount: string
          }[]
        | null
    >(null)
    const [whitelistError, setWhitelistError] = useState<string | null>(null)

    useEffect(() => {
        const getMintInfo = async () => {
            const res = await getLaunchpadInfo(launchpad)
            setMintInfo(res)
        }
        if (launchpad) {
            getMintInfo()
        }
    }, [launchpad])

    return (
        <>
            <Flex flexDirection="column" fullWidth gap={12} className={clsx('mt-10')}>
                <Flex fullWidth gap={6} className={'max-md:flex-col'}>
                    <Card flexDirection="column" gap={2} padding={false} className="w-[240px] py-8 px-8 max-md:w-full">
                        <Typography variant="xl" bold>
                            --/--
                        </Typography>

                        <Typography variant="sm" bold color="gray">
                            TOTAL ITEMS SOLD
                        </Typography>
                    </Card>
                    <Card flexDirection="column" gap={2} padding={false} className="w-[240px] py-8 px-8 max-md:w-full">
                        <Coin variant="xl" bold number={'--'} />

                        <Typography variant="sm" bold color="gray">
                            SALES VOLUME
                        </Typography>
                    </Card>
                    <Card flexDirection="column" gap={2} padding={false} className="w-[240px] py-8 px-8 max-md:w-full">
                        <Coin variant="xl" bold number={'--'} />

                        <Typography variant="sm" bold color="gray">
                            UNIQUE OWNERS
                        </Typography>
                    </Card>
                </Flex>
                <Flex fullWidth gap={6} flexDirection="column">
                    <Flex alignItems="center" gap={8}>
                        <Typography variant="xl" bold>
                            COLLECTION DETAILS
                        </Typography>
                        {/* <Button variant="outlined" title={t('common:button.edit')} icon={IconType.edit} /> */}
                    </Flex>

                    <FormSection title={t('label.collectionName')} name="collectionName">
                        <Typography variant="md">{launchpad.name}</Typography>
                    </FormSection>
                    <FormSection title={t('label.description')} name="description">
                        <Typography variant="md">{launchpad.collection?.description}</Typography>
                    </FormSection>
                    <FormSection title={t('label.saleGroups')} name="description" focus={false}>
                        <Flex flexDirection="column" gap={4} className="w-1/2">
                            {launchpad.venues?.map((venue) => (
                                <Flex
                                    key={venue.address}
                                    justifyContent="between"
                                    className={clsx(
                                        'p-3',
                                        'border-2',
                                        'rounded-md',
                                        'color-border-gradient',
                                        // 'color-border-gradient-shadow',
                                    )}
                                >
                                    <Flex gap={3} flexDirection="column">
                                        <Flex gap={1} flexDirection="column">
                                            <Typography variant="md">{venue.name}</Typography>
                                            <Typography variant="sm" color="secondary">
                                                {venue.isPublicSale ? 'Public Sale' : 'Private Sale'}
                                            </Typography>
                                        </Flex>
                                        <Flex>
                                            <Typography variant="sm">
                                                {'Max Buy: '}
                                                {venue.maxMintPerWallet === -1 ? 'Unlimited' : venue.maxMintPerWallet}
                                            </Typography>
                                        </Flex>
                                        <Flex>
                                            <Coin variant="md" number={venue.price} />
                                        </Flex>
                                        <Flex>
                                            <Typography variant="sm">
                                                {venue.startTime
                                                    ? `Start at ${new Date(venue.startTime).toLocaleString()}`
                                                    : 'TBC'}
                                            </Typography>
                                        </Flex>
                                    </Flex>
                                    {!venue.isPublicSale && (
                                        <Flex gap={3} flexDirection="column">
                                            <Button
                                                variant="secondary"
                                                title={t('button.addWhitelist')}
                                                onClick={() => {
                                                    console.log('addWhitelist')
                                                    setVuenue(venue.address)
                                                    setOpen(true)
                                                }}
                                            />
                                        </Flex>
                                    )}
                                </Flex>
                            ))}
                        </Flex>
                    </FormSection>
                    <FormSection title={t('label.supply')} name="supply">
                        <Typography variant="md">{mintInfo?.total ?? '--'}</Typography>
                        {!launchpad.launchDate && (
                            <Button
                                className="w-[200px]"
                                variant="outlined"
                                title={t('button.addMore')}
                                to={`/studio/launches/create/type/${launchpad.id}`}
                            />
                        )}
                    </FormSection>
                    <FormSection title={t('label.avatar')} name="avatar">
                        <Image src={launchpad.imageUrl} className="h-[200px] w-[200px]" />
                    </FormSection>
                    <FormSection title={t('label.coverImage')} name="coverImage">
                        <Image src={launchpad.coverUrl} className="aspect-5/1 w-full" />
                    </FormSection>
                </Flex>
            </Flex>
            <Modal
                title={t('button.addWhitelist')}
                show={open}
                onClose={() => {
                    setOpen(false)
                    setVuenue(null)
                    setWhitelists(null)
                }}
                confirmButton={{
                    title: t('common:button.submit'),
                    loading,
                    disabled: !whitelists || whitelists.length === 0,
                    onClick: async () => {
                        setLoading(true)
                        const { launchpadPackage } = getConfig()
                        const { listing } = launchpad
                        try {
                            if (!listing || !vuenue) {
                                return
                            }
                            const tx = new TransactionBlock()
                            whitelists?.forEach(({ address, amount }) => {
                                Array.from({ length: Number(amount) }).forEach(() => {
                                    tx.moveCall({
                                        target: `${launchpadPackage}::market_whitelist::issue`,
                                        arguments: [tx.object(listing), tx.object(vuenue), tx.object(address)],
                                    })
                                })
                            })
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
                        } catch (error: any) {
                            console.log(error)
                            toast(error.message ?? 'Issue failed, please check your balance and try again')
                        }
                        setLoading(false)
                        setOpen(false)
                        setVuenue(null)
                    },
                }}
            >
                <Flex gap={4} justifyContent="between" fullWidth>
                    <FormSection
                        title={t('label.walletList')}
                        name="walletList"
                        focus={false}
                        description={t('description.walletList')}
                    >
                        <FileUploadInput
                            accept=".csv"
                            onClick={(e) => {
                                const element = e.target as HTMLInputElement
                                element.value = ''
                            }}
                            onChange={(e) => {
                                // read csv to array
                                const file = e.target.files?.[0]
                                if (!file) return
                                Papa.parse(file, {
                                    header: true,
                                    skipEmptyLines: true,
                                    complete: function (results: {
                                        data: {
                                            address: string
                                            amount: string
                                        }[]
                                    }) {
                                        const totalAmount = results.data.reduce((acc, cur) => {
                                            return acc + Number(cur.amount)
                                        }, 0)
                                        if (totalAmount > Number(100)) {
                                            setWhitelistError('Total amount should be less than 100')
                                            return
                                        }
                                        setWhitelists(results.data)
                                    },
                                })
                            }}
                            example={'/assets/example/whitelist-example.csv'}
                        />
                        {whitelistError && (
                            <Typography variant="sm" color="error">
                                {whitelistError}
                            </Typography>
                        )}
                    </FormSection>
                    <Flex fullWidth className="max-h-[300px] overflow-y-auto" flexDirection="column" gap={2}>
                        <table className="w-full">
                            <thead className="sticky top-[-1px] bg-light-background dark:bg-dark-background">
                                <tr>
                                    <th className="color-border border">
                                        <Typography variant="sm">Address</Typography>
                                    </th>
                                    <th className="color-border border">
                                        <Typography variant="sm">Amount</Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {whitelists?.map((whitelist, i) => (
                                    <tr key={i}>
                                        <td className="color-border border text-center">
                                            <Typography variant="sm">{formatAddress(whitelist.address)}</Typography>
                                        </td>
                                        <td className="color-border border text-center">
                                            <Typography variant="sm">{whitelist.amount}</Typography>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Flex>
                </Flex>
            </Modal>
        </>
    )
}

export default StudioDetailCollectionSection
