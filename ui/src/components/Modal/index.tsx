import clsx from 'clsx'
import { createPortal } from 'react-dom'
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { CSSTransition } from 'react-transition-group'
import { Button, ButtonProps } from '../Button'
import { Flex } from '../Flex'
import { Icon, IconType } from '../Icon'
import { Typography } from '../Typography'

interface ModalButtonProps extends ButtonProps {
    dataName?: string
}

export const Modal = ({
    children,
    show,
    title,
    titleIcon,
    confirmButton,
    cancelButton,
    onClose,
    maxWidth = '900px',
    iconSize = {
        width: 20,
        height: 20,
    },
    formMethod,
}: {
    title: string
    titleIcon?: IconType
    children?: React.ReactNode
    show: boolean
    maxWidth?: string
    iconSize?: {
        width: number
        height: number
    }
    confirmButton?: ModalButtonProps
    cancelButton?: ModalButtonProps
    onClose?: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formMethod?: UseFormReturn<any>
}) => {
    const ButtonHandler = (button?: ModalButtonProps, close = false) => {
        if (!button) return

        const { onClick, dataName, ...props } = button

        return (
            <Button
                variant="primary"
                {...props}
                onClick={(e) => {
                    onClick?.(e)
                    if (close) {
                        onClose?.()
                    }
                    // onClose?.()
                }}
                data-name={dataName}
            />
        )
    }

    const content = () => (
        <>
            <Flex flex={1} fullWidth flexDirection="column" className={clsx('py-3', 'px-6')}>
                {children}
                <div className="grow" />
            </Flex>
            {(confirmButton || cancelButton) && (
                <Flex
                    gap={4}
                    fullWidth
                    flexDirection="row"
                    justifyContent="end"
                    alignItems="center"
                    className={clsx('border-t', 'border-light-secondary-border', 'py-3', 'px-6')}
                >
                    {confirmButton &&
                        ButtonHandler({
                            ...confirmButton,
                            variant: 'primary',
                            type: 'submit',
                        })}
                    {cancelButton &&
                        ButtonHandler(
                            {
                                ...cancelButton,
                                variant: 'default',
                                type: 'button',
                            },
                            true,
                        )}
                </Flex>
            )}
        </>
    )

    return createPortal(
        <CSSTransition
            in={show}
            timeout={0}
            classNames="modal"
            unmountOnExit
            mountOnEnter
            onEnter={(node: HTMLElement) => {
                node.style.opacity = '0'
                node.style.transition = 'opacity 200ms ease-in-out'
            }}
            onEntered={(node: HTMLElement) => {
                node.style.opacity = '1'
            }}
            onExit={(node) => {
                node.style.opacity = '0'
                node.style.transition = 'opacity 200ms ease-in-out'
            }}
            onExited={(node) => {
                node.style.opacity = '1'
            }}
        >
            <div
                data-name="modal-container"
                className={clsx(
                    'fixed',
                    'top-0',
                    'left-0',
                    'w-full',
                    'h-full',
                    'z-50',
                    'flex',
                    'justify-center',
                    'items-center',
                    'opacity-0',
                )}
            >
                <div
                    className={clsx(
                        'absolute',
                        'top-0',
                        'left-0',
                        'w-full',
                        'h-full',
                        'bg-black',
                        'bg-opacity-50',
                        'backdrop-blur-[1px]',
                    )}
                    onClick={() => {
                        onClose?.()
                    }}
                />
                <Flex
                    style={{ maxWidth }}
                    flexDirection="column"
                    justifyContent="start"
                    alignItems="center"
                    className={clsx(
                        'bg-light-background',
                        'dark:bg-dark-background',
                        'min-h-[30%]',
                        'rounded',
                        'w-[90%]',
                        'relative',
                        'py-1',
                    )}
                    gap={0}
                >
                    <Flex
                        data-name="modal"
                        fullWidth
                        justifyContent="between"
                        className={clsx('border-b', 'border-light-secondary-border', 'py-4', 'px-6')}
                    >
                        <Flex gap={2} alignItems="center">
                            {titleIcon && (
                                <Icon height={iconSize.height} width={iconSize.width} icon={titleIcon} className="" />
                            )}
                            <Typography variant="title" bold transform="uppercase">
                                {title}
                            </Typography>
                        </Flex>
                    </Flex>
                    {formMethod ? (
                        <FormProvider {...formMethod}>
                            <form className="w-full">{content()}</form>
                        </FormProvider>
                    ) : (
                        content()
                    )}
                </Flex>
            </div>
        </CSSTransition>,
        document.body,
    )
}
