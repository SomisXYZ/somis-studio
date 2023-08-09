import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { memo, useEffect } from 'react'

export const RouterProgress = memo(() => {
    if (typeof window === 'undefined') {
        return <></>
    }
    NProgress.configure({ showSpinner: false })
    const Router = useRouter()

    const start = () => {
        NProgress.start()
    }
    const done = () => {
        NProgress.done()
    }
    useEffect(() => {
        Router.events.on('routeChangeStart', start)
        Router.events.on('routeChangeComplete', done)
        Router.events.on('routeChangeError', done)
    }, [])
    return <></>
})

RouterProgress.displayName = 'RouterProgress'
