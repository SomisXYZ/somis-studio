import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { memo, useEffect, useState } from 'react'
import { Flex, IconType, Image, Typography } from '~/components'
import { Modal } from '~/components/Modal'
import { Nft } from '~/gql/generated/graphql'
import { useNfts } from '~/hooks/web3/nft'
import { covertOriginBytesNftToNft } from '~/utils/sui'

const MintModalContent = memo(({ addresses, failedCount }: { addresses: string[]; failedCount?: number }) => {
    const { t } = useTranslation('launchpad')
    const { loading, nfts, fetch } = useNfts(addresses)
    const [nftList, setNftList] = useState<Nft[] | null>(null)
    useEffect(() => {
        fetch()
    }, addresses)

    useEffect(() => {
        const syncNfts = async () => {
            if (nfts.length > 0) {
                const list = await Promise.all(nfts.map((nft) => covertOriginBytesNftToNft(nft)))
                setNftList(list)
            }
        }
        syncNfts()
    }, [nfts])

    const getTopByIndex = (index: number, isCover: boolean) => {
        switch (index) {
            case 0:
                return ['top-0', !isCover && 'hover:top-[-30px]']
            case 1:
                return ['top-[8px]', !isCover && 'hover:top-[-30px]']
            case 2:
                return ['top-[16px]', !isCover && 'hover:top-[-30px]']
            case 3:
                return ['top-[24px]', !isCover && 'hover:top-[-30px]']
            case 4:
                return ['top-[32px]', !isCover && 'hover:top-[-30px]']
            default:
                return ['top-0', !isCover && 'hover:top-[-30px]']
        }
    }
    const getRightByIndex = (index: number) => {
        switch (index) {
            case 0:
                return ['right-0']
            case 1:
                return ['right-[15px]']
            case 2:
                return ['right-[25px]']
            case 3:
                return ['right-[35px]']
            case 4:
                return ['right-[45px]']
            default:
                return ['right-0']
        }
    }

    const [selectedImage, setSelectedImage] = useState<Nft | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [prevImage, setPrevImage] = useState<Nft | null>(null)
    useEffect(() => {
        if (nftList && nftList?.length > 0) {
            setPrevImage(nftList[nftList.slice(0, 4).length - 1])
        }
    }, [nftList])
    return (
        <Flex fullWidth gap={4} flexDirection="column" className="relative py-3">
            <Flex flexDirection="column" gap={5}>
                <Flex className={clsx('h-[230px]', 'w-[260px]', 'relative', 'm-auto')}>
                    {/* Only take 4 imge to display */}
                    {nftList?.slice(0, 4).map((nft, index) => {
                        if (index === nftList?.slice(0, 4).length - 1) {
                            return nftList && selectedImage ? (
                                <Image
                                    key={selectedImage?.address}
                                    src={selectedImage?.imageUrl}
                                    skeleton={loading}
                                    containerClassName={clsx(
                                        'absolute',
                                        'transition-all',
                                        'duration-300',
                                        'm-auto',
                                        getTopByIndex(nftList?.slice(0, 4).length - 1, true),
                                        'left-0',
                                        getRightByIndex(nftList?.slice(0, 4).length - 1),
                                    )}
                                    className={clsx(
                                        'aspect-square',
                                        'w-[200px]',
                                        'h-[200px]',
                                        'object-cover',
                                        'rounded-xl',
                                    )}
                                    loading="lazy"
                                />
                            ) : (
                                <Image
                                    key={nft?.address}
                                    src={nft?.imageUrl}
                                    skeleton={loading}
                                    containerClassName={clsx(
                                        'absolute',
                                        'transition-all',
                                        'duration-300',
                                        'm-auto',
                                        getTopByIndex(index, index === nftList?.slice(0, 4).length - 1),
                                        'left-0',
                                        getRightByIndex(index),
                                    )}
                                    className={clsx(
                                        'aspect-square',
                                        'w-[200px]',
                                        'h-[200px]',
                                        'object-cover',
                                        'rounded-xl',
                                        'cursor-pointer',
                                    )}
                                    loading="lazy"
                                    onClick={() => {
                                        setSelectedImage((selectedImage) =>
                                            selectedImage?.address === nft?.address ? null : nft,
                                        )
                                        setSelectedIndex(index)
                                    }}
                                />
                            )
                        } else {
                            return (
                                <Image
                                    key={nft?.address}
                                    src={selectedIndex === index ? prevImage?.imageUrl : nft?.imageUrl}
                                    skeleton={loading}
                                    containerClassName={clsx(
                                        'absolute',
                                        'transition-all',
                                        'duration-300',
                                        'm-auto',
                                        getTopByIndex(index, index === nftList?.slice(0, 4).length - 1),
                                        'left-0',
                                        getRightByIndex(index),
                                    )}
                                    className={clsx(
                                        'aspect-square',
                                        'w-[200px]',
                                        'h-[200px]',
                                        'object-cover',
                                        'rounded-xl',
                                        'cursor-pointer',
                                    )}
                                    loading="lazy"
                                    onClick={() => {
                                        setSelectedImage((selectedImage) =>
                                            selectedImage?.address === nft?.address ? null : nft,
                                        )
                                        setSelectedIndex(index)
                                    }}
                                />
                            )
                        }
                    })}
                </Flex>
                <Typography variant="md" font="sg">
                    {nftList ? t('mintModal.successMessage', { count: nftList?.length ?? 1 }) : null}
                    {!!failedCount && failedCount > 0 && (
                        <div className="pt-1">
                            <Typography color="error" variant="md" font="sg">
                                {t('mintModal.failMessage', { count: failedCount })}
                            </Typography>
                        </div>
                    )}
                </Typography>
            </Flex>
        </Flex>
    )
})

export const MintModal = ({
    show,
    onClose,
    failedCount,
    addresses,
}: {
    show: boolean
    onClose: () => void
    failedCount: number
    addresses: string[]
}) => {
    const { t } = useTranslation('launchpad')
    const router = useRouter()

    const onCompleted = () => {
        onClose()
    }

    return (
        <Modal
            show={show}
            onClose={() => {
                onCompleted()
            }}
            title={t('mintModal.title')}
            titleIcon={IconType.cart}
            confirmButton={{
                title: t('mintModal.inventoryBtn'),
                onClick: () => {
                    onCompleted()
                    router.push('/profile')
                },
            }}
            cancelButton={{
                title: t('mintModal.stayOnPageBtn'),
                onClick: () => {
                    onCompleted()
                },
            }}
        >
            <MintModalContent failedCount={failedCount} addresses={addresses} />
        </Modal>
    )
}

MintModal.displayName = 'MintModal'

MintModalContent.displayName = 'MintModalContent'
