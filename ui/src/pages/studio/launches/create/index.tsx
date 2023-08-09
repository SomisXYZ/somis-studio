import { useRouter } from 'next/router'
import { CreateStudioLaunchpadStep } from '~/containers/Studio/CreateStudioLaunchpadStep'

export type CreateStudioLaunchForm = {
    collectionName: string
    symbol: string
    description: string
    url: string | null
    royalty: number
    image: FileList | null
    coverImage: FileList | null
    logo: FileList | null
    price: number
}

const StudioCreateCollectionPage = () => {
    const router = useRouter()

    return (
        <CreateStudioLaunchpadStep
            onSuccess={(launchpad) => {
                router.push(`/studio/launches/create/type/${launchpad?.id}`)
            }}
            onCancel={() => {
                router.push('/studio/launches/create')
            }}
        />
    )
}

export default StudioCreateCollectionPage
