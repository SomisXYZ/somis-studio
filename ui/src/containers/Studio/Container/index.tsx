import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'
import { Container, Flex, Typography } from '~/components'
import { Seo } from '~/components/Seo'
import { FeatureWrapper } from '~/containers/FeatureWrapper'

export const StudioContainer = ({
    title,
    description,
    right,
    children,
    gap = 8,
    position = 'left',
}: Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'title'> & {
    gap?: number | { x?: number; y?: number }
    title?: ReactNode
    description?: string
    right?: ReactNode
    position?: 'left' | 'center'
}) => {
    const { t } = useTranslation('studio')
    return (
        <FeatureWrapper feature="studio" redirect>
            <Container
                flexDirection="column"
                gap={gap}
                isFullWidth={false}
                overflow="visible"
                className={clsx('pt-12', 'pb-[250px]', 'relative', 'min-h-[1229px]')}
            >
                <>
                    <Seo
                        seo={{
                            title: t('seo.title'),
                            description: t('seo.description'),
                        }}
                    />
                    {/* <div className={clsx(style['background-blur'])} /> */}
                    <Flex
                        fullWidth
                        justifyContent={position === 'left' ? 'between' : 'center'}
                        className={clsx('max-md:flex-col', 'max-md:gap-4', 'relative')}
                    >
                        <>
                            <Flex flexDirection="column" gap={2} className={clsx('w-full', 'lg:w-1/2')}>
                                {title && (
                                    <Typography font="jbm" variant="h5" component="h1" extraBold>
                                        {title}
                                    </Typography>
                                )}
                                {description && <Typography color="gray">{description}</Typography>}
                            </Flex>
                            <Flex className="top-0 right-0 lg:absolute">{right}</Flex>
                        </>
                    </Flex>
                    {children}
                    {/* <div className={clsx('absolute', 'z-[-1]', 'top-[32vh]', 'left-[-5vw]')}>
                    <Icon icon={IconType.somisBg} />
                </div>
                <div className={clsx(style['background-blur-bottom'])} /> */}
                </>
            </Container>
        </FeatureWrapper>
    )
}
