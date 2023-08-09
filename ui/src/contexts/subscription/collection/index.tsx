import { createContext, useContext, useState } from 'react'
import { SubscribeCollectionOrdersDocument, SubscribeCollectionOrdersSubscription } from '~/gql/generated/graphql'
import { useSubscription } from '~/hooks/useSubscription'

export interface SubscriptionType {
    subscriptionOrder: SubscribeCollectionOrdersSubscription | null
}

const CollectionSubscriptionContext = createContext<SubscriptionType | null>(null)

export const useCollectionSubscriptionContext = () => {
    const context = useContext(CollectionSubscriptionContext)
    if (!context) {
        throw new Error('useCollectionSubscriptionContext must be used within CollectionSubscriptionContext')
    }
    return context
}

export const CollectionSubscriptionContextProvider = ({
    children,
    collectionAddress,
}: {
    children: React.ReactNode
    collectionAddress: string
}) => {
    const [subscriptionOrder, setSubscriptionOrder] = useState<SubscribeCollectionOrdersSubscription | null>(null)

    useSubscription<SubscribeCollectionOrdersSubscription>({
        query: SubscribeCollectionOrdersDocument,
        params: {
            collectionAddress: collectionAddress,
        },
        handler: async (data) => {
            setSubscriptionOrder(data)
        },
    })

    return (
        <CollectionSubscriptionContext.Provider value={{ subscriptionOrder }}>
            {children}
        </CollectionSubscriptionContext.Provider>
    )
}
