import React, { forwardRef, InputHTMLAttributes, useRef, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Flex } from '~/components/Flex'
import { Typography } from '~/components/Typography'
import { Icon, IconType } from '~/components/Icon'
import clsx from 'clsx'

export interface FileUploadProps extends InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string
    example?: string | File
}

export const FileUploadInput = forwardRef(
    (
        { onChange, className = 'w-full aspect-5/1', placeholder, example, ...rest }: FileUploadProps,
        ref: React.ForwardedRef<HTMLInputElement>,
    ): React.ReactElement => {
        const { t } = useTranslation('common')

        const [preview, setPreview] = useState<string>()

        const inputRef = useRef<HTMLInputElement | null>(null)

        const onFileDrop = (e: React.SyntheticEvent<EventTarget>) => {
            // console.log('onFileDrop')
            const target = e.target as HTMLInputElement
            if (!target.files) return

            // console.log(target.files)
            const newFile = Object.values(target.files).map((file: File) => file)
            onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>)

            if (newFile.length === 0) return
            const fileName = newFile[0].name
            setPreview(fileName)
        }

        const removeFile = () => {
            if (inputRef != null && typeof inputRef !== 'function' && inputRef.current) {
                const currentTarget = inputRef.current
                currentTarget.value = ''
                setPreview(undefined)
            }
        }

        const downloadExample = () => {
            if (!example) return
            const url = example instanceof File ? URL.createObjectURL(example) : example
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', url)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
        return (
            <Flex flexDirection="column" alignItems="start" justifyContent="start" gap={3}>
                {example && (
                    <Flex
                        gap={3}
                        justifyContent="center"
                        alignItems="center"
                        className="cursor-pointer pt-1"
                        onClick={downloadExample}
                    >
                        <Icon icon={IconType.download} colorClass="fill-light-primary dark:fill-dark-primary" />
                        <Typography variant="md" color="primary">
                            {t('input.file.example')}
                        </Typography>
                    </Flex>
                )}
                <Flex
                    flexDirection="column"
                    alignItems="start"
                    justifyContent="start"
                    className={clsx('cursor-pointer', 'relative', className)}
                    gap={3}
                >
                    {
                        <Flex
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            fullWidth
                            className={clsx(
                                'border',
                                'border-dashed',
                                'border-light-input-border',
                                'rounded-xs',
                                'h-full',
                                'bg-light-input-background',
                                'dark:bg-dark-input-background',
                                'cursor-pointer',
                            )}
                        >
                            {preview ? (
                                <Flex flexDirection="column" gap={2}>
                                    <Typography variant="md" color="gray">
                                        {preview}
                                    </Typography>
                                    <Flex
                                        flexDirection="row"
                                        alignItems="center"
                                        justifyContent="center"
                                        className="cursor-pointer"
                                        onClick={removeFile}
                                    >
                                        <Icon icon={IconType.cross} className="mr-2" />
                                        <Typography variant="md" color="gray">
                                            {t('input.image.remove')}
                                        </Typography>
                                    </Flex>
                                </Flex>
                            ) : (
                                <Typography variant="md" color="gray">
                                    {placeholder ?? t('input.file.uploadFile')}
                                </Typography>
                            )}
                        </Flex>
                    }
                    <input
                        type="file"
                        onChange={onFileDrop}
                        ref={(node) => {
                            if (typeof ref === 'function') {
                                ref(node)
                                inputRef.current = node
                            }
                        }}
                        {...rest}
                        multiple={false}
                        style={{
                            opacity: 0,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                        }}
                    />
                </Flex>
            </Flex>
        )
    },
)

FileUploadInput.displayName = 'ImageUploadInput'
