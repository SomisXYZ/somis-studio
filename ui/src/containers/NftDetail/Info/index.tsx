import clsx from 'clsx'
import { Flex, Image, Typography } from '~/components'
import { useNftDetailPageContext } from '../context'
import { CollectionInfo } from './CollectionInfo'
import { createRef, useEffect, useState } from 'react'
import { useWindowSize } from '~/hooks'
import Marquee from 'react-fast-marquee'

export const NftInfo = () => {
    const { nft, isLoading, orderCommission } = useNftDetailPageContext()
    const { width } = useWindowSize()
    const src = nft?.imageUrl ?? null
    const ref = createRef<HTMLDivElement>()
    const [showMarquee, setShowMarquee] = useState(false)

    useEffect(() => {
        if (ref.current && width) {
            const el = ref.current
            const sizes = el.getBoundingClientRect()
            const textLength = nft?.name?.length ?? 0
            const pWidth = sizes.width
            if (pWidth * 0.9 < textLength * 40) {
                setShowMarquee(true)
            } else {
                setShowMarquee(false)
            }
        }
    }, [width, nft])
    return (
        <>
            <Flex flexDirection="column" fullWidth gap={3} ref={ref}>
                <CollectionInfo />
                <Typography
                    variant="h1"
                    textStyle="text-heading-3"
                    font="ppm"
                    bold
                    skeleton={isLoading}
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '800px' }}
                >
                    {nft?.name && showMarquee && nft.name !== '' ? (
                        <Marquee
                            gradient={false}
                            speed={40}
                            loop={0}
                            pauseOnHover={true}
                            className="z-[0] overflow-y-hidden"
                        >
                            {nft?.name && nft?.name !== '' ? nft?.name : '--'}&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
                        </Marquee>
                    ) : nft?.name && nft.name !== '' ? (
                        nft?.name
                    ) : (
                        nft?.collection?.name + ` #${nft?.address.split('x')[1].slice(0, 4) ?? '--'}` ?? '--'
                    )}
                </Typography>
            </Flex>
            <Image
                src={src}
                skeleton={isLoading}
                className={clsx('w-full', 'aspect-square', 'rounded-lg', 'block', 'lg:hidden')}
            />
            <Flex className={clsx('max-lg:hidden')}>
                <Typography color="tertiary" variant="b4" font="sg" className={clsx('w-full')} skeleton={isLoading}>
                    {nft?.collection?.description}
                </Typography>
            </Flex>
        </>
    )
}
