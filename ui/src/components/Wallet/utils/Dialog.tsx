// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Dialog } from '@headlessui/react'
import { ComponentType } from 'react'
import { styled } from '../stitches'
import { CloseIcon } from './icons'

/**
 * A helper that can extract props from a React component type.
 * Normally, you can use React.ComponentProps for this, but for some more complex
 * React type definitions, that helper does not work.
 */
export type ExtractProps<T> = T extends ComponentType<infer P> ? P : T

type TitleProps = ExtractProps<typeof Dialog.Title>

export const Title = styled((props: TitleProps) => <Dialog.Title {...props} />, {
    margin: 0,
    padding: '0 $2',
    fontSize: '$lg',
    fontWeight: '$title',
    color: '#ffffff',
})

export const Subtitle = styled((props: TitleProps) => <Dialog.Title {...props} />, {
    margin: 0,
    padding: '0 $2',
    fontSize: '$sm',
    fontWeight: '$title',
    color: '#ffffff',
    display: 'flex',
    paddingTop: '5px',
})

export const Overlay = styled('div', {
    backgroundColor: '$backdrop',
    position: 'fixed',
    backdropFilter: 'blur(1px)',
    inset: 0,
    zIndex: 100,
})

export const Content = styled('div', {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    height: '100%',
    fontFamily: '$sans',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '$4',
    boxSizing: 'border-box',
    pointerEvents: 'none!important',
})

export const Body = styled((props: ExtractProps<typeof Dialog.Panel>) => <Dialog.Panel {...props} />, {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '$background',
    borderRadius: 5,
    boxShadow: '$modal',
    display: 'flex',
    flexDirection: 'column',
    pointerEvents: 'auto',
    border: '1px solid #303030',
    variants: {
        connect: {
            true: {
                width: '100%',
                maxWidth: '400px',
                maxHeight: '75vh',
                '@md': {
                    flexDirection: 'row',
                },
                display: 'flex',
            },
        },
    },
})

const Close = styled('button', {
    position: 'absolute',
    cursor: 'pointer',
    padding: 7,
    top: '$5',
    right: '$5',
    display: 'flex',
    border: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#929292',
    borderRadius: '$close',
    transform: 'scale(1.3)',
})

export function CloseButton({ onClick }: { onClick(): void }) {
    return (
        <Close aria-label="Close" onClick={onClick}>
            <CloseIcon />
        </Close>
    )
}
