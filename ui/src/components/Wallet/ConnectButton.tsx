// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react'

import { ConnectModal } from './ConnectModal'
import walletKit from './WalletKitContext'
import { Button, ButtonProps } from '../Button'

interface Props extends Omit<ButtonProps, 'title'> {
    title?: string
    showAddress?: boolean
}

export function ConnectButton({ title = 'Connect Wallet', showAddress, ...props }: Props) {
    const [connectModalOpen, setConnectModalOpen] = useState(false)
    const { currentAccount } = walletKit.useWalletKit()

    if (currentAccount) {
        return <></>
    }

    return (
        <>
            <Button data-name="connect-button" onClick={() => setConnectModalOpen(true)} title={title} {...props} />
            <ConnectModal open={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
        </>
    )
}
