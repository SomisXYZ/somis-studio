import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { Flex } from '../Flex'
import { IconType } from '../Icon'
import { LinkIcon } from '../LinkIcon'
import { Typography } from '../Typography'
import styles from './BottomDrawer.module.scss'
import { createPortal } from 'react-dom'

export const BottomDrawer = ({
    show,
    content,
    onClose,
}: {
    show: boolean
    content?: {
        title?: string
        children: React.ReactNode
        height?: number
    } | null
    onClose?: () => void
}) => {
    const [showContent, setShowContent] = useState(show)

    useEffect(() => {
        if (show) {
            document.body.classList.add('no-scroll')
        } else {
            setTimeout(() => {
                document.body.classList.remove('no-scroll')
            }, 300)
        }
    }, [show])

    useEffect(() => {
        setTimeout(() => {
            setShowContent(show)
        }, 300)
    }, [show])

    return createPortal(
        <CSSTransition
            in={show ? show : showContent}
            timeout={0}
            classNames={{
                enterActive: styles['slide-enter-active'],
                enterDone: styles['slide-enter-done'],
                exitActive: styles['slide-exit-done'],
                exitDone: styles['slide-exit-done'],
            }}
        >
            <Flex flexDirection="column" className={clsx(styles['bottom-drawer'])}>
                <div
                    className={clsx('grow')}
                    onClick={() => {
                        onClose?.()
                    }}
                />
                <CSSTransition
                    in={show}
                    timeout={300}
                    unmountOnExit
                    classNames={{
                        enterActive: styles['slide-enter-active'],
                        enterDone: styles['slide-enter-done'],
                        exitActive: styles['slide-exit-done'],
                        exitDone: styles['slide-exit-done'],
                    }}
                >
                    <div
                        className={clsx(
                            styles['bottom-drawer--content'],
                            'bg-light-content-background',
                            'dark:bg-dark-content-background',
                            'w-full',
                            'overflow-hidden',
                        )}
                        style={{
                            height: content?.height ? `${content.height}vh` : '100vh',
                        }}
                    >
                        <Flex flexDirection="column" fullWidth gap={3}>
                            {/* Bottom Sheet Header */}
                            <Flex
                                justifyContent="center"
                                fullWidth
                                className={clsx('pb-4', 'px-6', 'relative', 'border-b', 'color-border')}
                            >
                                {/* <div></div> */}
                                <Typography transform="uppercase" variant="b4" bold>
                                    {content?.title}
                                </Typography>
                                {/* close button */}
                                <LinkIcon
                                    className={clsx('absolute', 'right-[1.125rem]', 'top-[-0.25rem]')}
                                    icon={IconType.cross}
                                    onClick={() => {
                                        onClose?.()
                                    }}
                                />
                            </Flex>
                            <Flex flexDirection="column" fullWidth className={clsx('relative', 'max-h-[80vh]')}>
                                {content?.children}
                            </Flex>
                        </Flex>
                    </div>
                </CSSTransition>
            </Flex>
        </CSSTransition>,
        document.body,
    )
}
