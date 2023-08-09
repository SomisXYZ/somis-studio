import clsx from 'clsx'
import { Container, Flex, Typography } from '~/components'
import { Timeline } from '~/components/Timeline'
import { Launchpad } from '~/gql/generated/graphql'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './index.module.scss'
import { createRef, useEffect, useState } from 'react'
import { useScrollIndex } from '~/hooks/useScrollIndex'
import { SpaceGrotesk } from '~/components/Typography/fonts'

interface Section {
    title: string
    content: string
    id: string
    ref: React.RefObject<HTMLDivElement>
}

export const LaunchpadPageContent = ({ launchpad }: { launchpad: Launchpad }) => {
    const [sections, setSections] = useState<Section[]>([])

    useEffect(() => {
        setSections(
            launchpad?.sections?.map((section) => ({
                title: section.title,
                content: section?.content,
                id: section.title.replace(/\s/g, ''),
                ref: createRef<HTMLDivElement>(),
            })) ?? [],
        )
    }, [launchpad])
    const currentIndex = useScrollIndex(
        sections.map((section) => section.ref),
        () => document.getElementById('launchpad-header')?.clientHeight ?? 0,
    )

    return (
        <Container
            data-name="launchpad-page"
            fullWidth
            overflow="inherit"
            className={clsx('max-lg:flex-col', 'relative', 'mt-6')}
            gap={8}
            justifyContent="between"
        >
            <Flex
                flexBasis={'7/12'}
                gap={12}
                flexDirection="column"
                className={clsx('max-lg:basis-full', 'relative', 'max-lg:order-2')}
            >
                {sections?.map((section) => (
                    <Flex
                        key={section.id}
                        id={section.id}
                        ref={section.ref}
                        flexDirection="column"
                        gap={4}
                        className={clsx('scrollable', 'relative')}
                    >
                        <Typography variant="h2" textStyle="text-heading-5">
                            {section.title}
                        </Typography>
                        <Flex
                            className={clsx(styles['markdown-content'], SpaceGrotesk.className)}
                            flexDirection="column"
                            fullWidth
                            gap={4}
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.content}</ReactMarkdown>
                        </Flex>
                    </Flex>
                ))}
            </Flex>
            <Flex
                justifyContent="end"
                alignSelf="start"
                flexBasis={'4/12'}
                fullWidth
                className={clsx('px-4', 'sticky', 'top-[6rem]', 'max-lg:hidden', 'max-w-[435px]')}
            >
                {sections && sections.length > 0 && (
                    <Timeline
                        lists={
                            sections?.map((section) => ({
                                title: section.title,
                                id: section.id,
                            })) ?? []
                        }
                        current={currentIndex ?? 0}
                    />
                )}
            </Flex>
        </Container>
    )
}
