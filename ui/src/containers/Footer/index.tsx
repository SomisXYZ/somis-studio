import clsx from 'clsx'
import Link from 'next/link'
import { Container, Flex, IconType, Typography, LinkIcon } from '~/components'
import { Logo } from '~/components/Logo'
import { useBreakpoint } from '~/hooks'
import { isFeatureEnabled, Features } from '~/utils/helpers'

export const Footer = () => {
    const { breakpoint } = useBreakpoint()
    const footerLink: {
        title: string
        children: {
            title: string
            href: string
            featured?: Features
        }[]
    }[] = [
        {
            title: 'App',
            children: [
                {
                    title: 'Studio',
                    href: '/studio/launches',
                    featured: 'studio',
                },
            ],
        },
        {
            title: 'Resources',
            children: [
                {
                    title: 'Branding kit',
                    href: 'https://drive.google.com/drive/folders/1MGeAyPqdy0m44C6RmCVi14aMVOqix843?usp=share_link',
                },
                {
                    title: 'Documentation',
                    href: '/',
                },
            ],
        },
    ]

    return (
        <Flex fullWidth className={clsx('bg-footer-background', 'pb-[30px]', 'mt-20', 'z-[1]')}>
            <Container
                isFullWidth={false}
                gap={12}
                flexWrap="wrap"
                justifyContent="between"
                className={clsx(
                    'border-t',
                    'border-light-primary',
                    'py-11',
                    'max-md:flex-col',
                    'max-md:px-8',
                    'max-xl:gap-6',
                )}
            >
                <Flex
                    className={clsx(
                        'max-md:items-center',
                        'max-md:w-full',
                        'max-xl:w-6/12',
                        'max-xl:gap-8',
                        'max-xl:flex-col',
                    )}
                    gap={14}
                    alignItems="start"
                >
                    <Link href="/" className="min-w-[195px]">
                        <Logo />
                    </Link>
                    <Typography
                        className={clsx('lg:max-w-[320px]', 'max-md:text-center')}
                        variant={breakpoint === 'sm' ? 'md' : 'b4'}
                        color="secondary"
                    >
                        Somis is the fastest NFT marketplace on Sui, with a focus on community governance.
                    </Typography>
                </Flex>

                <Flex gap={14} className={clsx('max-xl:w-5/12', 'max-md:flex-col', 'max-md:gap-12', 'max-md:order-2')}>
                    {footerLink.map((item, i) => (
                        <Flex flexDirection="column" gap={4} key={i}>
                            <Typography bold variant="b4">
                                {item.title}
                            </Typography>
                            {item.children
                                .filter((c) => !c.featured || isFeatureEnabled(c.featured))
                                .map((child, j) => (
                                    <Link href={child.href} key={j}>
                                        <Typography variant="b4" color="secondary">
                                            {child.title}
                                        </Typography>
                                    </Link>
                                ))}
                        </Flex>
                    ))}
                </Flex>
                <Flex
                    className={clsx('max-xl:w-full', 'max-xl:justify-start', 'max-md:justify-center', 'max-md:order-1')}
                    justifyContent="end"
                >
                    <Flex
                        alignItems="start"
                        flexDirection="column"
                        gap={3}
                        className={clsx('max-md:items-center', 'max-md:pt-0', 'max-md:pb-10')}
                    >
                        <Typography bold variant="b4">
                            Join the community
                        </Typography>
                        <Flex alignItems="start">
                            <LinkIcon
                                url="https://discord.gg/somis"
                                icon={IconType.discord}
                                // colorClassName="fill-footer-text"
                            />
                            {/* <LinkIcon
                                url="https://instagram.com/"
                                icon={IconType.instagram}
                                // colorClassName="stroke-footer-text"
                            /> */}
                            <LinkIcon
                                url="https://twitter.com/Somisxyz"
                                icon={IconType.twitter}
                                // colorClassName="fill-footer-text"
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </Container>
        </Flex>
    )
}
