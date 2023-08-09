import clsx from 'clsx'
import NextImage, { ImageProps as NextImageProps, StaticImageData } from 'next/image'
import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { twMerge } from 'tailwind-merge'
import { Flex } from '../Flex'
import { Skeleton } from '../Skeleton'
import { Icon, IconType } from '../Icon'
export interface ImageProps extends Omit<NextImageProps, 'src' | 'alt'> {
    className?: string
    containerClassName?: string
    skeleton?: boolean
    src?: string | StaticImageData | null
    alt?: string
    nextImage?: boolean
    border?: boolean
    disableLoader?: boolean
}

// TODO: This is a temporary fix for the pinata issue, Remove this when demo is over
export function replacePinataUrl(src: string | StaticImageData | null | undefined) {
    if (!src) {
        return ''
    }
    if (typeof src === 'string') {
        return src
            .replace('https://ikzttp.mypinata.cloud/ipfs/', 'https://somis-prod.infura-ipfs.io/ipfs/')
            .replace('ipfs://', 'https://somis-prod.infura-ipfs.io/ipfs/')
    }
    if (src.src) {
        return src.src
    }
    return ''
}

export const Image = ({
    src = '',
    alt = '',
    skeleton = false,
    containerClassName,
    className,
    fill = true,
    loading = 'lazy',
    sizes = '100%',
    nextImage = true,
    border = false,
    quality = 50,
    disableLoader = false,
    ...props
}: ImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState(false)
    const handleLoad = () => {
        setIsLoaded(true)
    }

    if (src === 'no-image' || (src === null && !skeleton) || error) {
        return (
            <Flex
                className={twMerge(
                    'relative',
                    'overflow-hidden',
                    'transition-opacity',
                    'duration-300',
                    className,
                    containerClassName,
                    !border && 'border-none',
                    'bg-black',
                    // 'bg-opacity-50',
                )}
                justifyContent="center"
                alignItems="center"
                gap={2}
                flexDirection="column"
            >
                <Icon icon={IconType.somis} colorClass="fill-white" />
            </Flex>
        )
    }
    return (
        <div
            className={twMerge(
                'relative',
                'overflow-hidden',
                'transition-opacity',
                'duration-300',
                className,
                // 'w-full',
                // 'aspect-square',
                !border && 'border-none',
                containerClassName,
            )}
        >
            {typeof src === 'string' && src.includes('ext=mp4') ? (
                <video
                    className={clsx(
                        'object-cover',
                        'w-full',
                        'h-full',
                        'transition-opacity',
                        'overflow-hidden',
                        'duration-300',
                        'bg-transparent',
                        {
                            'opacity-0': !isLoaded || skeleton,
                            'opacity-100': isLoaded && !skeleton,
                        },
                        className,
                    )}
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={replacePinataUrl(src) ?? ''}
                    onCanPlay={handleLoad}
                />
            ) : (
                src &&
                (nextImage ? (
                    error ? (
                        <NextImage
                            src={replacePinataUrl(src) ?? ''}
                            alt={isLoaded ? alt : ''}
                            unoptimized
                            onLoad={handleLoad}
                            onError={() => {
                                handleLoad()
                            }}
                            fill={fill}
                            loading={loading}
                            className={clsx(
                                'object-cover',
                                'w-full',
                                'h-full',
                                'transition-opacity',
                                'overflow-hidden',
                                'duration-300',
                                'bg-transparent',
                                {
                                    'opacity-0': !isLoaded || skeleton,
                                    'opacity-100': isLoaded && !skeleton,
                                },
                                className,
                            )}
                            sizes={sizes}
                            {...props}
                        />
                    ) : (
                        <NextImage
                            src={replacePinataUrl(src) ?? ''}
                            alt={isLoaded ? alt : ''}
                            onLoad={handleLoad}
                            onError={() => {
                                console.log('NextImage error')
                                setError(true)
                            }}
                            fill={fill}
                            loading={loading}
                            quality={quality}
                            className={clsx(
                                'relative',
                                'object-cover',
                                'w-full',
                                'h-full',
                                'transition-opacity',
                                'overflow-hidden',
                                'duration-300',
                                'bg-transparent',
                                {
                                    'opacity-0': !isLoaded || skeleton,
                                    'opacity-100': isLoaded && !skeleton,
                                },
                                className,
                            )}
                            sizes={sizes}
                            loader={
                                disableLoader
                                    ? undefined
                                    : ({ src, width, quality }) => {
                                          return `https://image.somis.xyz?image=${src}&width=${width}&quality=${
                                              quality || 50
                                          }`
                                      }
                            }
                            {...props}
                        />
                    )
                ) : (
                    <img
                        src={typeof src === 'string' ? replacePinataUrl(src) : src?.src}
                        alt={isLoaded ? alt : ''}
                        onLoad={handleLoad}
                        onError={() => {
                            setError(true)
                            handleLoad()
                        }}
                        loading={loading}
                        className={clsx(
                            'object-cover',
                            'w-full',
                            'h-full',
                            'transition-opacity',
                            'overflow-hidden',
                            'duration-300',
                            'bg-transparent',
                            {
                                'opacity-0': !isLoaded || skeleton,
                                'opacity-100': isLoaded && !skeleton,
                            },
                            className,
                        )}
                        sizes={sizes}
                        {...props}
                    />
                ))
            )}
            <CSSTransition in={!isLoaded || skeleton} timeout={1000} classNames="image-skeleton" unmountOnExit>
                <div
                    className={twMerge(
                        'bg-light-background',
                        'dark:bg-dark-background',
                        'absolute',
                        'overflow-hidden',
                        'top-0',
                        'left-0',
                        'w-full',
                        'h-full',
                        className,
                        'border-none',
                    )}
                >
                    <Skeleton
                        height="100%"
                        width="100%"
                        className={twMerge(
                            'absolute',
                            'overflow-hidden',
                            'top-0',
                            'left-0',
                            'w-full',
                            'h-full',
                            className,
                            'border-none',
                        )}
                    />
                </div>
            </CSSTransition>
        </div>
    )
}

Image.displayName = 'Image'
