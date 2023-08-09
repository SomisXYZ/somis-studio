import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { Button, Flex, Image, Typography } from '~/components'
import { StudioContainer } from '~/containers/Studio/Container'
import { Launchpad } from '~/gql/generated/graphql'

import { formatAddress, splitNftName } from '~/utils/helpers'
import { useSetLive } from '../hook'

export const MintingStep = ({
    nfts,
    launchpad,
    loading,
}: {
    nfts: {
        imageUrl: string
        name: string
        address: string | null
        state: 'inQueue' | 'minting' | 'minted' | 'failed'
    }[]
    launchpad: Launchpad
    loading?: boolean
}) => {
    const { t } = useTranslation('studio')
    const { loading: setLiveLoading, setLive } = useSetLive()
    const router = useRouter()

    return (
        <StudioContainer
            // position="center"
            title="NFT Creation"
            description="Please do not close the browser while we mint your NFTs"
        >
            <Flex fullWidth flexDirection="column">
                <Flex
                    fullWidth
                    flexDirection="column"
                    // alignItems="center"
                    className={clsx('border-t', 'border-b', 'color-border', 'py-6')}
                    gap={10}
                >
                    <Typography variant="xl">{t('processingList')}</Typography>
                    <Flex fullWidth flexDirection="column" gap={2} justifyContent="start">
                        {/* Header */}
                        <Flex fullWidth gap={12} justifyContent="start">
                            <Flex className="w-[40px]" />
                            <Flex className="flex-[1_1_1%]">
                                <Typography variant="md" bold color="gray">
                                    {t('label.nftName')}
                                </Typography>
                            </Flex>
                            <Flex className="flex-[1_1_3%]" alignItems="start">
                                <Typography variant="md" bold color="gray">
                                    {t('label.number')}
                                </Typography>
                            </Flex>
                            <Flex className="flex-[1_1_3%]" alignItems="center">
                                <Typography variant="md" bold color="gray">
                                    {t('label.state')}
                                </Typography>
                            </Flex>
                            <Flex className="flex-[1_1_10%]" alignItems="center">
                                <Typography variant="md" bold color="gray">
                                    {t('label.nftAddress')}
                                </Typography>
                            </Flex>
                        </Flex>
                        {/* Body */}
                        <Flex fullWidth flexDirection="column" gap={2}>
                            {nfts.map((nft, index) => (
                                <Flex fullWidth gap={12} key={index}>
                                    <Flex className="w-[40px]">
                                        <Image src={nft.imageUrl} className={clsx('w-10', 'h-10')} />
                                    </Flex>
                                    <Flex className="flex-[1_1_1%]" alignItems="center">
                                        <Typography variant="md">{splitNftName(nft.name).name}</Typography>
                                    </Flex>
                                    <Flex className="flex-[1_1_3%]" alignItems="center">
                                        <Typography variant="md">{splitNftName(nft.name).code}</Typography>
                                    </Flex>
                                    <Flex className="flex-[1_1_3%]" alignItems="center">
                                        <Typography variant="md">{nft.state}</Typography>
                                    </Flex>
                                    <Flex className="flex-[1_1_10%]" alignItems="center">
                                        <Typography variant="md" skeleton={nft.state === 'inQueue'}>
                                            {nft.address ? formatAddress(nft.address) : ''}
                                        </Typography>
                                    </Flex>
                                </Flex>
                            ))}
                        </Flex>
                    </Flex>
                </Flex>
                {/* Buttons */}
                <Flex fullWidth justifyContent="between">
                    <Button
                        type="button"
                        variant="tertiary"
                        title={t('viewCollectionDetails')}
                        className={clsx('min-w-1/6')}
                        to={`/studio/launches/${launchpad.id}`}
                    />
                    <Button
                        type="button"
                        variant="primary"
                        title={t('setLive')}
                        className={clsx('min-w-1/6')}
                        loading={setLiveLoading || loading}
                        onClick={async () => {
                            try {
                                await setLive(launchpad)
                                router.push('/studio/launches')
                            } catch (error) {
                                console.error(error)
                            }
                        }}
                    />
                </Flex>
            </Flex>
        </StudioContainer>
    )
}
