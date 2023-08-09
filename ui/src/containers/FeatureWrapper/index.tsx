import { Features, isFeatureEnabled } from '~/utils/helpers'
import { useRouter } from 'next/router'
export const FeatureWrapper = ({
    children,
    feature,
    redirect = false,
}: {
    feature: Features
    children: React.ReactNode
    redirect?: boolean
}) => {
    const isCollectionFeatureEnabled = isFeatureEnabled(feature)
    const router = useRouter()

    if (!isCollectionFeatureEnabled && redirect) {
        router.push('/404')
    }

    if (!isCollectionFeatureEnabled) {
        return <></>
    }

    return <>{children}</>
}
