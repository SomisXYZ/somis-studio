// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Dialog } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { Body, CloseButton, Content, Overlay } from './utils/Dialog'
import { WalletList } from './WalletList'
import { useWalletKit } from './WalletKitContext'

export interface ConnectModalProps {
    open: boolean
    onClose(): void
}

export interface ConnectModalProps {
    open: boolean
    onClose(): void
}

export function ConnectModal({ open, onClose }: ConnectModalProps) {
    const { connect, currentWallet, isConnected } = useWalletKit()
    const [selected, setSelected] = useState<string | null>(null)

    useEffect(() => {
        if (!open) {
            setSelected(null)
        }
    }, [open])

    useEffect(() => {
        if (isConnected && currentWallet?.name === selected) {
            onClose()
        }
    }, [currentWallet, selected, isConnected])

    return (
        <Dialog open={open} onClose={onClose}>
            <Overlay />
            <Content>
                <Body connect>
                    <WalletList
                        selected={selected}
                        onChange={(walletName) => {
                            setSelected(walletName)
                            connect(walletName)
                        }}
                    />
                    <CloseButton onClick={onClose} />
                </Body>
            </Content>
        </Dialog>
    )
}
