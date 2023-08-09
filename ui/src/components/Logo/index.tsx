// import { Typography } from '~/components/Typography'
import LightLogo from '@assets/logo-light.png'
import DarkLogo from '@assets/logo-dark.png'
import clsx from 'clsx'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function Logo() {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)
    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const imgClass = 'h-[56px] w-[195px]'
    return (
        <div className="flex items-center gap-4 max-lg:gap-2">
            {theme === 'dark' ? (
                <Image src={DarkLogo} className={clsx(imgClass)} alt="somis" priority />
            ) : (
                <Image src={LightLogo} className={clsx(imgClass)} alt="somis" priority />
            )}
        </div>
    )
}
