import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { Button, Card, Coin, Container, Flex, Icon, IconType, Image, Typography } from '~/components'
import { ConnectButton } from '~/components/Wallet/ConnectButton'
import { ProcessBar } from '~/components/ProcessBar'
import { Launchpad, User, Venue } from '~/gql/generated/graphql'
import { useBreakpoint } from '~/hooks'
import { useHatchLaunchpad, useLaunchpadList, useMintLaunchpad } from '~/hooks/web3/launchpad'
import authContext from '~/contexts/auth'
import { formatNumber } from '~/utils/helpers'
import { MintModal } from '../MintModal'
import { SocialButtons } from '~/containers/SocialButtons'
import { Countdown } from '~/components/Countdown'
import { useEffect, useRef, useState } from 'react'
import useAlert from '~/components/Alert/context'
import { NumberInput } from '~/components/Input/NumberInput'
import { convertSuiToMist } from '~/utils/sui'
import blockchainService from '~/services/blockChain/service'
import { Certificate } from '~/services/blockChain'
import { VueneCard } from './VueneCard'
import { Tab } from '~/components/Tabs'
import { toast } from 'react-hot-toast'

interface Props {
    launchpad: Launchpad
}

export const LaunchpadPageHeader = ({ launchpad }: Props) => {
    const { coverUrl } = launchpad

    const { mint, readyToMint, isMinting, error } = useMintLaunchpad(launchpad)
    const { user, balance, refreshBalance } = authContext.useAuthState()
    const { open: alertOpen, setChildren: alertSetChildren } = useAlert()
    const { canMint, total, minted, process, refresh, nftType } = useLaunchpadList(launchpad)
    const { hatch, isHatching, canHatch, noAttributeNfts } = useHatchLaunchpad(launchpad)

    const { breakpoint } = useBreakpoint()
    const numberRef = useRef<HTMLInputElement>(null)
    const { t } = useTranslation('launchpad')
    const formRef = useRef<HTMLFormElement>(null)

    const [venues, setVenues] = useState<Venue[]>([])
    const [open, setOpen] = useState(false)
    const [failedCount, setFailedCount] = useState(0)
    const [addresses, setAddresses] = useState<string[]>([])
    const [selectedVenue, setSelectedVenue] = useState<number | null>(null)
    const [number, setNumber] = useState(1)
    const [loading, setLoading] = useState(false)
    const [selectedTab, setSelectedTab] = useState(0)
    const [whitelist, setWhitelist] = useState<
        {
            canMint: boolean
            certs: Certificate[]
            maxMintPerWallet: number
            venue: string
        }[]
    >([])

    const isMobileOrTablet = ['sm', 'md', 'lg'].includes(breakpoint)
    const enoughBalance =
        balance && launchpad.mintPrice
            ? Number(balance) >= Number(convertSuiToMist(Number(launchpad.mintPrice) * number))
            : true

    // Handle old flow launchpad
    useEffect(() => {
        if (launchpad.venue && !launchpad.venues) {
            const mockVenue: Venue = {
                name: 'Public Sale',
                address: launchpad.venue,
                isPublicSale: true,
                maxMintPerWallet: -1,
                price: launchpad.mintPrice ?? '0',
                startTime: launchpad.launchDate ?? null,
            }
            setVenues([mockVenue])
        } else {
            setVenues(
                launchpad.venues
                    ?.sort((a, b) => (a.startTime && b.startTime ? (a.startTime > b.startTime ? 1 : -1) : 0))
                    .sort((a, b) => (a.isPublicSale ? 1 : -1)) ?? [],
            )
        }
    }, [launchpad])

    useEffect(() => {
        reloadCerts(user, venues, readyToMint)
    }, [user, venues, readyToMint])

    useEffect(() => {
        if (error) {
            alertSetChildren(error, 'Mint failed')
            alertOpen()
        }
    }, [error])

    const reloadCerts = async (user: User | null, venues: Venue[], readyToMint: boolean | null) => {
        if (!user?.address || !readyToMint) {
            setWhitelist([])
            return
        }
        const [cert, nftLength] = await Promise.all([
            blockchainService.getOwnedWhitelistCerts(user?.address ?? ''),
            blockchainService.getOwnedNftLengthByType(user?.address ?? '', launchpad.collection?.type ?? ''),
        ])
        const certs = venues.map((venue, index) => {
            const ownedCerts = cert.filter((c) => c.venueId === venue.address)
            let isMintedMaxNft = false
            if (venue.maxMintPerWallet !== -1) {
                isMintedMaxNft = nftLength >= venue.maxMintPerWallet
            }
            return {
                canMint: venue.isPublicSale
                    ? !!(user?.address !== undefined && readyToMint && !isMintedMaxNft)
                    : !!(ownedCerts.length > 0 && user?.address !== undefined && readyToMint && !isMintedMaxNft),
                certs: ownedCerts,
                maxMintPerWallet: !venue.isPublicSale
                    ? venue.maxMintPerWallet === -1
                        ? ownedCerts.length
                        : Math.min(nftLength - venue.maxMintPerWallet, ownedCerts.length)
                    : venue.maxMintPerWallet,
                venue: venue.address,
            }
        })
        setWhitelist(certs)
    }

    const mintButtonTitle = () => {
        if (!readyToMint) {
            return t('button.comingSoon')
        }
        if (total && !canMint) {
            return t('button.soldOut')
        }

        return t('mintBtn')
    }

    const mintView =
        venues.length > 0 &&
        venues.map((venue, index) => (
            <VueneCard
                key={index}
                venue={venue}
                whitelist={whitelist[index]}
                isSelected={selectedVenue === index}
                onClick={() => {
                    setSelectedVenue((prev) => (prev === index ? null : index))
                    setNumber(1)
                    formRef.current?.reset()
                }}
            />
        ))
    const tabs = [
        {
            title: t('mintTab'),
            key: 'mint',
            content: <Flex className="mt-6">{mintView}</Flex>,
        },

        {
            title: t('hatchTab'),
            key: 'hatch',
            content: (
                <Flex className="mt-6">
                    <Card
                        id={`hatch-card`}
                        fullWidth
                        justifyContent="between"
                        padding={false}
                        border={false}
                        className={clsx('px-6', 'py-6', 'border-2', [
                            'color-border-gradient',
                            'color-border-gradient-shadow',
                        ])}
                        alignItems="end"
                    >
                        <Flex flexDirection="column" gap={2}>
                            <Typography variant="lg" bold transform="uppercase">
                                {t('hatching')}
                            </Typography>
                        </Flex>
                        <Flex gap={3} justifyContent="start" alignItems="end">
                            {launchpad.hatchDate ? (
                                <>
                                    <Typography variant="lg" bold>
                                        <Countdown
                                            prefixContent={
                                                <Typography
                                                    variant="sm"
                                                    color="gray"
                                                    bold
                                                    transform="uppercase"
                                                    className="mr-3"
                                                >
                                                    {t('startsIn')}
                                                </Typography>
                                            }
                                            expiredText="Live Now"
                                            targetDate={launchpad.hatchDate}
                                        />
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="sm" color="gray" bold transform="uppercase">
                                    {t('tbc')}
                                </Typography>
                            )}
                        </Flex>
                    </Card>
                </Flex>
            ),
        },
    ]

    return (
        <Flex fullWidth className={clsx('max-lg:mb-10')} id="launchpad-header">
            <Image
                data-name="launchpad-cover-image"
                src={coverUrl}
                className={clsx('absolute', 'top-0', 'left-0', 'w-full', 'h-[360px]', 'z-[-1]', 'max-lg:opacity-40')}
            />
            <Container
                data-name="launchpad-header-container"
                flexDirection={isMobileOrTablet ? 'column' : 'row'}
                justifyContent="between"
                alignItems="start"
                className={clsx('mt-[60px]', 'lg:mt-[240px]', 'relative')}
                gap={4}
            >
                <Flex
                    flexBasis={'7/12'}
                    gap={6}
                    flexDirection="column"
                    alignItems={isMobileOrTablet ? 'center' : 'start'}
                    className={clsx('max-lg:w-full')}
                >
                    <Image
                        data-name="launchpad-image"
                        src={launchpad.logoUrl}
                        className={clsx(
                            'w-[10rem]',
                            'h-[10rem]',
                            'lg:w-[12.875rem]',
                            'lg:h-[12.875rem]',
                            'rounded-xl',
                            'border-[0.75rem]',
                            'border-light-background',
                            'dark:border-dark-background',
                        )}
                    />
                    <Flex flexDirection="column" justifyContent="start" gap={6}>
                        <Typography data-name="launchpad-title" component="h1" variant="h2">
                            {launchpad.name}
                        </Typography>
                        <SocialButtons
                            alignItems="start"
                            justifyContent={isMobileOrTablet ? 'center' : 'start'}
                            className={clsx('w-full')}
                            website={launchpad.website ?? ''}
                            twitter={launchpad.twitter ?? ''}
                            discord={launchpad.discord ?? ''}
                            address={launchpad.collectionAddress ?? ''}
                            zealySubdomain={launchpad.zealySubdomain ?? undefined}
                            title={launchpad.name}
                        />
                    </Flex>
                    {canHatch ? (
                        <Tab
                            tabs={tabs}
                            onchange={(key) => {
                                setSelectedTab(key)
                            }}
                        />
                    ) : (
                        mintView
                    )}
                    {launchpad?.flags && launchpad?.flags.length > 0 && (
                        <Card flexDirection="column" fullWidth border padding={false} className={clsx('px-6', 'py-7')}>
                            <div className={clsx('grid', 'grid-cols-2', 'gap-5')}>
                                {launchpad?.flags?.map((flag, key) => (
                                    <Flex
                                        key={key}
                                        flexDirection="row"
                                        gap={4}
                                        className={clsx('relative')}
                                        alignItems="center"
                                    >
                                        <Flex alignItems="center" className={clsx('w-4')} justifyContent="center">
                                            {flag.included ? (
                                                <Icon
                                                    icon={IconType.check}
                                                    colorClass={clsx('fill-light-success', 'dark:fill-dark-success')}
                                                />
                                            ) : (
                                                <Icon
                                                    icon={IconType.smallCross}
                                                    colorClass={clsx(
                                                        'fill-light-secondary',
                                                        'dark:fill-dark-secondary',
                                                    )}
                                                />
                                            )}
                                        </Flex>
                                        <Typography color={flag.included ? 'default' : 'secondary'} regular>
                                            {flag.name}
                                        </Typography>
                                    </Flex>
                                ))}
                            </div>
                        </Card>
                    )}
                </Flex>
                <Flex className={clsx('max-sm:w-full', 'mb-6', 'lg:mb-0', 'max-lg:m-auto')} flexDirection="column">
                    <Image
                        src={launchpad.imageUrl}
                        className={clsx(
                            'max-sm:w-full',
                            'w-[435px]',
                            'aspect-square',
                            'md:w-[435px]',
                            'md:h-[435px]',
                            'rounded-xl',
                            'border-[0.75rem]',
                            'border-light-background',
                            'dark:border-dark-background',
                        )}
                    />
                    <Flex flexDirection="column" gap={6} className={clsx('mt-6', 'px-[0.75rem]')}>
                        <Flex flexDirection="column" gap={4}>
                            <Flex fullWidth justifyContent="start" flexDirection="column" gap={1}>
                                <Flex justifyContent="start" gap={2}>
                                    <Typography>
                                        {minted !== null ? formatNumber(minted) : '--'} /{' '}
                                        {total !== null ? formatNumber(total) : '--'}
                                    </Typography>
                                    <Typography transform="uppercase" color="secondary">
                                        {t('minted')}
                                    </Typography>
                                </Flex>
                            </Flex>
                            <ProcessBar percent={process} />
                        </Flex>

                        {selectedTab === 1 ? (
                            <Card>
                                <Button
                                    type="button"
                                    data-name="hatch-button"
                                    title={t('button.hatchBtn', {
                                        count: noAttributeNfts.length,
                                    })}
                                    disabled={!canHatch}
                                    loading={isHatching}
                                    variant="secondary"
                                    className="w-full"
                                    onClick={async () => {
                                        try {
                                            await hatch()
                                            toast('Hatch success')
                                            setSelectedTab(0)
                                        } catch (error) {
                                            console.error(error)
                                            toast('Hatch failed')
                                        }
                                    }}
                                />
                            </Card>
                        ) : (
                            <form id="mint-form" ref={formRef}>
                                <Card
                                    border
                                    flexDirection="column"
                                    className={clsx(
                                        'z-[1]',
                                        'max-sm:w-full',
                                        'px-6',
                                        'py-7',
                                        selectedVenue === null
                                            ? ['opacity-50', 'cursor-not-allowed', 'pointer-events-none']
                                            : 'opacity-100',
                                    )}
                                    padding={false}
                                >
                                    <Flex flexDirection="row" justifyContent="between">
                                        <Flex flexDirection="column" gap={2}>
                                            <Typography variant="sm" color="gray" bold transform="uppercase">
                                                {t('mintPrice')}
                                            </Typography>
                                            <Coin
                                                showZero={selectedVenue !== null}
                                                bold
                                                number={selectedVenue != null ? venues[selectedVenue]?.price : '0'}
                                                variant="lg"
                                            />
                                        </Flex>
                                        <Flex flexDirection="column" gap={2} justifyContent="end" alignItems="end">
                                            <Typography variant="sm" color="gray" bold transform="uppercase">
                                                {t('items')}
                                            </Typography>
                                            <NumberInput
                                                ref={numberRef}
                                                max={
                                                    selectedVenue != null && whitelist[selectedVenue]?.maxMintPerWallet
                                                        ? whitelist[selectedVenue]?.maxMintPerWallet
                                                        : undefined
                                                }
                                                onChange={(value) => {
                                                    setNumber(value)
                                                }}
                                            />
                                        </Flex>
                                    </Flex>
                                    <Flex fullWidth flexDirection="column" gap={2} justifyContent="center">
                                        {!user?.address ? (
                                            <ConnectButton variant="full-gradient" showAddress={false} />
                                        ) : (
                                            <>
                                                <Button
                                                    type="button"
                                                    data-name="mint-button"
                                                    disabled={
                                                        !canMint ||
                                                        !(
                                                            selectedVenue !== null && whitelist[selectedVenue]?.canMint
                                                        ) ||
                                                        !enoughBalance
                                                    }
                                                    loading={isMinting || loading}
                                                    variant="primary"
                                                    title={mintButtonTitle()}
                                                    onClick={async () => {
                                                        try {
                                                            setLoading(true)
                                                            setFailedCount(0)
                                                            setAddresses([])
                                                            // Loop mint by number
                                                            const number = parseInt(numberRef.current?.value ?? '1')
                                                            if (selectedVenue === null) {
                                                                throw new Error('Please select venue')
                                                            }
                                                            let addresses: string[] = []
                                                            try {
                                                                const { nftAddresses } = await mint(
                                                                    number,
                                                                    nftType ?? '',
                                                                    venues[selectedVenue],
                                                                    whitelist[selectedVenue]?.certs
                                                                        .map((cert) => cert.address)
                                                                        .slice(0, number),
                                                                )
                                                                addresses = nftAddresses
                                                            } catch (error) {
                                                                console.error(error)
                                                            }

                                                            if (addresses.length === 0) {
                                                                throw new Error('Mint failed')
                                                            }
                                                            setAddresses(addresses)
                                                            await reloadCerts(user, venues, readyToMint)
                                                            setSelectedVenue(null)
                                                            refreshBalance()
                                                            setLoading(false)
                                                            setOpen(true)
                                                            refresh()
                                                        } catch (error) {
                                                            setLoading(false)
                                                            console.error(error)
                                                        }
                                                    }}
                                                />
                                                {canMint && !enoughBalance && (
                                                    <Flex className={'pt-2'}>
                                                        <Typography
                                                            data-name="mint-error"
                                                            variant="sm"
                                                            color="error"
                                                            className={clsx('text-center')}
                                                        >
                                                            {t('common:insufficientBalance')}
                                                        </Typography>
                                                    </Flex>
                                                )}
                                                <MintModal
                                                    show={open}
                                                    onClose={() => setOpen(false)}
                                                    failedCount={failedCount}
                                                    addresses={addresses}
                                                />
                                            </>
                                        )}
                                    </Flex>
                                </Card>
                            </form>
                        )}
                    </Flex>
                </Flex>
            </Container>
        </Flex>
    )
}
