import React, { forwardRef, InputHTMLAttributes, useEffect, useRef, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Flex } from '~/components/Flex'
import { Typography } from '~/components/Typography'
import { Icon, IconType } from '~/components/Icon'
import clsx from 'clsx'
import { Image } from '~/components/Image'

export interface ImageUploadProps extends InputHTMLAttributes<HTMLInputElement> {
    image?: string
    placeholder?: string
}

export const ImageUploadInput = forwardRef(
    (
        { onChange, image, className = 'w-full aspect-5/1', placeholder, ...rest }: ImageUploadProps,
        ref: React.ForwardedRef<HTMLInputElement>,
    ): React.ReactElement => {
        const { t } = useTranslation('common')

        const [preview, setPreview] = useState<string>()

        useEffect(() => {
            if (image) {
                setPreview(image)
            }
        }, [])
        const inputRef = useRef<HTMLInputElement | null>(null)

        const onFileDrop = (e: React.SyntheticEvent<EventTarget>) => {
            // console.log('onFileDrop')
            const target = e.target as HTMLInputElement
            if (!target.files) return

            // console.log(target.files)
            const newFile = Object.values(target.files).map((file: File) => file)
            onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>)

            if (newFile.length === 0) return
            const objectUrl = URL.createObjectURL(newFile[0])
            setPreview(objectUrl)
        }

        const removeFile = () => {
            if (inputRef != null && typeof inputRef !== 'function' && inputRef.current) {
                const currentTarget = inputRef.current
                currentTarget.value = ''
                setPreview(undefined)
            }
        }

        return (
            <Flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                className={clsx('cursor-pointer', 'relative', className)}
            >
                {preview ? (
                    <Flex
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        fullWidth
                        className="relative"
                    >
                        {/* Image Preview */}
                        <Image
                            src={preview}
                            className={clsx(
                                'border',
                                'border-dashed',
                                'border-light-input-border',
                                'rounded-xs',
                                'bg-light-input-background',
                                'dark:bg-dark-input-background',
                                'cursor-pointer',
                                'w-full',
                                className,
                            )}
                        />
                        {/* Remove Button */}
                        <Flex
                            className={clsx(
                                'absolute',
                                'top-0',
                                'right-0',
                                'bg-light-input-background',
                                'dark:bg-dark-input-background',
                                'rounded-full',
                                'p-1.5',
                                'cursor-pointer',
                                'z-10',
                            )}
                            alt-label="Remove"
                            onClick={removeFile}
                        >
                            <Icon icon={IconType.cross} width={12} height={12} />
                        </Flex>
                    </Flex>
                ) : (
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
                        <Typography variant="md" color="gray">
                            {placeholder ?? t('input.image.uploadImage')}
                        </Typography>
                    </Flex>
                )}
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
        )
    },
)

ImageUploadInput.displayName = 'ImageUploadInput'
