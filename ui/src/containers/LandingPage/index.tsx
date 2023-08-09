import { Container, Flex, Icon, IconType, Typography } from '~/components'
import useTranslation from 'next-translate/useTranslation'
import clsx from 'clsx'
import { createRef, useEffect, useState } from 'react'
import { useBreakpoint, useWindowSize } from '~/hooks'

export const LandingPage = () => {
    const { width } = useWindowSize()
    const [cubeWidth, setCubeWidth] = useState<number | null>(null)
    const { isDesktop } = useBreakpoint()
    const { t } = useTranslation('common')

    const cubeRef = createRef<HTMLCanvasElement>()
    const persentRef = createRef<HTMLDivElement>()
    const containerRef = createRef<HTMLDivElement>()

    useEffect(() => {
        if (!width || !persentRef.current || !containerRef.current) return
        setCubeWidth(Math.min(persentRef.current?.offsetWidth, containerRef.current.offsetWidth))
        cubeRef.current?.setAttribute('style', `width: ${cubeWidth}px; height: ${cubeWidth}px;`)
    }, [width, persentRef, containerRef])

    return (
        <>
            <Container
                ref={containerRef}
                flexDirection="column"
                justifyContent="start"
                alignContent="start"
                alignItems="start"
                isFullWidth={false}
                overflow="hidden"
                className={clsx('transition-opacity', 'duration-300', 'relative', 'z-0', 'min-h-[calc(100vh-80px)]')}
                backgroundBlur
            >
                {/* Title */}
                <Flex
                    justifyContent="between"
                    alignItems="center"
                    alignContent="center"
                    flexDirection="column"
                    className={clsx('py-[80px]', 'lg:py-[160px]', 'w-full', 'relative', 'z-0', 'mb-[30px]')}
                    gap={10}
                >
                    <div className={clsx('absolute', 'top-[25rem]', 'lg:top-[22rem]', 'z-[-1]')}>
                        <Icon icon={IconType.somisBg} />
                    </div>
                    <Flex alignItems="center" alignContent="center" gap={4}>
                        <Typography variant="lg" regular>
                            Powered by
                        </Typography>
                        <Flex alignItems="center" alignContent="center" gap={2}>
                            <Icon icon={IconType.sui} />
                            <Typography variant="lg" regular>
                                sui
                            </Typography>
                        </Flex>
                    </Flex>
                    <Typography variant="h1" color="gradient" align="center">
                        {t(`landing.title`)}
                    </Typography>
                    <Typography variant="lg" regular align="center">
                        {t(`landing.subtitle`)}
                    </Typography>
                </Flex>
                <Flex flexDirection="column" className={clsx('w-full', 'gap-[120px]', 'z-0', 'relative')}></Flex>
            </Container>
        </>
    )
}
