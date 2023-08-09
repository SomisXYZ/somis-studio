import React, { createRef, useEffect, useState } from 'react'
import { Button } from '../Button'
import { Typography } from '../Typography'
import { Flex } from '../Flex'
import clsx from 'clsx'
import { Coin } from '../Coin'
import { Image } from '../Image'
import useTranslation from 'next-translate/useTranslation'
import { Nft, Order } from '~/gql/generated/graphql'
import { GridSelector } from '../GridSelector'
import { splitNftName } from '~/utils/helpers'
import styles from './NFTCard.module.scss'
import Marquee from 'react-fast-marquee'
import { useWindowSize } from '~/hooks'
import { CommissionMarketplaceIcon } from '../CommissionMarketplaceIcon'
import { NftWithIndex } from '~/containers/CollectionPage/Contexts/ListContext'
import { OriginBytesCommissionFields } from '~/services/blockChain'

export interface NFTProps {
    className?: string
    nft: Nft | null
    orderbook?:
        | (Order & {
              commission?: OriginBytesCommissionFields | null
          })
        | null
    seller?: string
    onSell?: () => void
    onBuy?: () => void
    onCancel?: () => void
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, address: string | null) => void
    selectable?: boolean
    selected?: boolean
    style?: React.CSSProperties
    showPrice?: boolean
}

export const NFTCard = ({
    className,
    onClick,
    nft,
    selectable = false,
    selected,
    style,
    orderbook,
    showPrice = true,
}: NFTProps) => {
    const { t } = useTranslation('common')
    const { width } = useWindowSize()
    const isSkeleton = nft === null
    const { name, code } = splitNftName(nft?.name ?? '')
    const ref = createRef<HTMLDivElement>()
    const [showMarquee, setShowMarquee] = useState<boolean | null>(null)

    useEffect(() => {
        if (ref.current && width) {
            const el = ref.current
            const sizes = el.getBoundingClientRect()
            const textLength = nft?.name?.length ?? 0
            const pWidth = sizes.width
            if (pWidth * 0.9 < textLength * 9) {
                setShowMarquee(true)
            } else {
                setShowMarquee(false)
            }
        }
    }, [width, nft])

    const content = (
        <>
            <Flex className={clsx('relative')}>
                <Image
                    src={nft?.imageUrl ?? null}
                    className="aspect-square w-full object-cover"
                    skeleton={isSkeleton}
                    quality={50}
                    sizes="300px"
                />
                {/* {user?.address && user.address === nft?.owner?.address && showOwnedLabel && (
                        <Flex
                            justifyContent="center"
                            className={clsx(
                                'absolute',
                                'bottom-0',
                                'left-0',
                                'right-0',
                                'p-2',
                                'bg-background-secondary',
                                'opacity-80',
                            )}
                        >
                            <Typography>{t('nft.owned')}</Typography>
                        </Flex>
                    )} */}
            </Flex>
            {/* Content */}
            <Flex flexDirection="column" gap={1} className={clsx('px-3', 'py-3', 'grow', 'relative')}>
                <Flex justifyContent="between" ref={ref}>
                    <Typography
                        font="jbm"
                        variant="md"
                        bold
                        color={'default'}
                        skeleton={isSkeleton || showMarquee === null}
                        skeletonLength={60}
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                        className="nft-title"
                    >
                        {name && showMarquee ? (
                            <Marquee
                                gradient={false}
                                speed={40}
                                loop={0}
                                pauseOnHover={true}
                                className="z-[0] overflow-y-hidden"
                            >
                                {name && name !== '' ? name : '--'}&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
                            </Marquee>
                        ) : name && name !== '' ? (
                            name
                        ) : (
                            '--'
                        )}
                    </Typography>
                    <Typography bold variant="md" skeleton={isSkeleton} skeletonLength={30}>
                        {code}
                    </Typography>
                </Flex>
                <Typography
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                    variant="sm"
                    color="secondary"
                    regular
                    font="jbm"
                    skeleton={isSkeleton}
                    skeletonLength={80}
                >
                    {nft?.collection?.name ?? '--'}
                </Typography>
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    className={clsx(
                        'opacity-0',
                        '-z-10',
                        'group-hover:z-auto',
                        !isSkeleton && 'group-hover:opacity-100',
                        'transition-opacity',
                        'duration-300',
                        'absolute',
                        'ease-in-out',
                        'top-0',
                        'left-0',
                        'w-full',
                        'h-full',
                        'px-3',
                        'bg-background-quaternary',
                    )}
                >
                    <Button
                        title={t('button.details', null, {
                            default: 'Details',
                        })}
                        to={`/assets/${nft?.address}`}
                        className={'w-full'}
                        disabled={!nft?.address}
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                    />
                </Flex>
            </Flex>
            {/* Footer */}
            <Flex
                data-name="nft-card"
                flexDirection="row"
                gap={1}
                className={clsx('p-2', 'md:p-3', 'bg-light-selected-background', 'dark:bg-dark-selected-background')}
                alignItems="center"
                justifyContent="between"
            >
                <Coin
                    number={orderbook?.price ?? 0}
                    variant="md"
                    bold
                    skeleton={showPrice ? orderbook === undefined : false}
                    skeletonLength={30}
                    skeletonColor="secondary"
                />
                <CommissionMarketplaceIcon
                    commissionMarketplaceAddress={orderbook?.commission?.beneficiary}
                    size={16}
                />
            </Flex>
        </>
    )
    return (
        <Flex
            flexDirection="column"
            aria-disabled={isSkeleton}
            id={nft?.address ?? undefined}
            className={clsx(
                'group',
                'nft-col',
                'relative',
                'cursor-pointer',
                'overflow-hidden',
                'rounded',
                'transition-transform',
                'ease-in-out',
                'duration-100',
                'transition-[top]',
                // 'transition-[width]',
                'top-0',
                'hover:top-[-2px]',
                'bg-background-quaternary',
                selectable && 'selectable-card',
                className,
                selected
                    ? [
                          'border',
                          'selected-card',
                          'border-light-card-border',
                          'dark:border-dark-card-border',
                          styles['selected-card'],
                      ]
                    : ['border', 'border-light-card-border', 'dark:border-dark-card-border'],
            )}
            onClick={(e) => onClick?.(e, nft?.address ?? null)}
            style={style}
        >
            {selectable && nft?.address ? <GridSelector selected={selected}>{content}</GridSelector> : content}
        </Flex>
    )
}

// TODO: Add this back in when design confirm
// {seller != null &&
//     (seller === userPublicKey ? (
//         <Button title="Cancel" onClick={onCancel} />
//     ) : (
//         userPublicKey != null && <Button title="Buy" onClick={onBuy} />
//     ))}
// {nft.owner === userPublicKey && <Button title="Sell" onClick={onSell} />}

NFTCard.displayName = 'NFTCard'
