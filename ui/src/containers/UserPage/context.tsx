import { createContext, useContext, useState } from 'react'
import { User } from '~/gql/generated/graphql'
import { useOwnerNfts } from '~/hooks/useOwnerNfts'
import { OriginBytesNft } from '~/services/blockChain'

export interface UserPageContextType {
    user: User
    activityNfts: OriginBytesNft[]
    activityNftsLoading: boolean
    offersNfts: OriginBytesNft[]
    offersNftsLoading: boolean
}

const UserPageContext = createContext<UserPageContextType | null>(null)

export const useUserPageContext = () => {
    const context = useContext(UserPageContext)
    if (!context) {
        throw new Error('useUserPageContext must be used within UserPageContextProvider')
    }
    return context
}

export const UserPageContextProvider = ({ user, children }: { user: User; children: React.ReactNode }) => {
    const [activityNfts] = useState<OriginBytesNft[]>([])
    const [activityNftsLoading] = useState<boolean>(false)

    const [offersNfts] = useState<OriginBytesNft[]>([])
    const [offersNftsLoading] = useState<boolean>(false)

    return (
        <UserPageContext.Provider
            value={{
                user,
                activityNfts,
                activityNftsLoading,
                offersNfts,
                offersNftsLoading,
            }}
        >
            {children}
        </UserPageContext.Provider>
    )
}

const UserPageFormContext = createContext<ReturnType<typeof useOwnerNfts> | null>(null)

export const useUserPageFormContext = () => {
    const context = useContext(UserPageFormContext)
    if (!context) {
        throw new Error('useUserPageContext must be used within UserPageFormContext')
    }
    return context
}

export const UserPageFormContextProvider = ({ user, children }: { user: User; children: React.ReactNode }) => {
    const value = useOwnerNfts(user?.address ?? '')
    return <UserPageFormContext.Provider value={value}>{children}</UserPageFormContext.Provider>
}
