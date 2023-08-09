import clsx from 'clsx'
import { useEffect } from 'react'
import { Container } from '~/components'

const Custom404 = () => {
    useEffect(() => {
        // router.replace('/');
    }, [])

    return (
        <Container
            data-name="404-page"
            isFullWidth={false}
            gap={6}
            className={clsx('w-full', 'max-lg:flex-col', 'lg:gap-14', 'pt-8 lg:pt-16')}
        >
            This page is under construction
        </Container>
    )
}

export default Custom404
