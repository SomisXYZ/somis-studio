import clsx from 'clsx'
import { ReactElement } from 'react'
import { CSSTransition } from 'react-transition-group'
import { Button } from '../Button'
import { Flex } from '../Flex'
import { Typography } from '../Typography'
import { useAlertState } from './context'

const AlertContainer = ({ children }: { children: ReactElement }) => {
    const { close } = useAlertState()
    return (
        <div
            data-name="alert-container"
            className={clsx(
                'fixed',
                'top-0',
                'left-0',
                'w-full',
                'h-full',
                'z-[9999]',
                'flex',
                'justify-center',
                'items-center',
                'opacity-0',
            )}
        >
            <div
                className={clsx('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-black', 'bg-opacity-50')}
                onClick={() => {
                    close()
                }}
            />
            {children}
        </div>
    )
}

export const Alert = () => {
    const { show, message, title, close } = useAlertState()
    return (
        <CSSTransition
            in={show}
            timeout={300}
            classNames="alert transition-opacity duration-300 ease-in-out"
            unmountOnExit
            mountOnEnter
            onEnter={(node: HTMLElement) => {
                node.style.opacity = '0'
            }}
            onEntered={(node: HTMLElement) => {
                node.style.opacity = '1'
            }}
            onExit={(node) => {
                node.style.opacity = '0'
            }}
            onExited={(node) => {
                node.style.opacity = '1'
            }}
        >
            <AlertContainer>
                <Flex
                    flexDirection="column"
                    justifyContent="start"
                    alignItems="center"
                    className={clsx(
                        'bg-light-content-background',
                        'dark:bg-dark-content-background',
                        'min-w-[400px]',
                        'max-w-[90vw]',
                        'rounded-lg',
                        'relative',
                    )}
                    gap={2}
                >
                    <Flex
                        fullWidth
                        justifyContent="between"
                        className={clsx('border-b', 'py-4', 'px-6', 'color-border')}
                    >
                        <Typography variant="xl" bold font="sg">
                            {title ?? ''}
                        </Typography>
                    </Flex>
                    <Flex fullWidth flexDirection="column" className={clsx('py-4', 'px-6')}>
                        <Typography variant="md">{message}</Typography>
                    </Flex>
                    <Flex
                        fullWidth
                        justifyContent="end"
                        flexDirection="column"
                        className={clsx('pb-4', 'px-6', 'inline-grid')}
                    >
                        <Button
                            title="OK"
                            onClick={() => {
                                close()
                            }}
                            className={clsx('flex-1')}
                        />
                    </Flex>
                </Flex>
            </AlertContainer>
        </CSSTransition>
    )
}
