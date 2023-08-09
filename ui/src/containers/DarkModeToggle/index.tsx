import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Toggle } from '~/components'

export const DarkModeToggle = ({ extraOnClick }: { extraOnClick?: () => void }) => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }
    return (
        <Toggle
            checkedCallback={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark')
                extraOnClick?.()
            }}
            offIcon={'/assets/icons/sun.svg'}
            onIcon={'/assets/icons/moon.svg'}
            checked={theme === 'dark'}
        />
    )
}
