import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { UserContent } from '~/containers/UserPage/Content'
import { UserPageContextProvider } from '~/containers/UserPage/context'
import { UserHeader } from '~/containers/UserPage/Header'
import authContext from '~/contexts/auth'

const ProfilePage = () => {
    const { user } = authContext.useAuthState()
    const [mounted, setMounted] = useState(false)
    const { replace } = useRouter()

    useEffect(() => {
        setMounted(true)
        if (!user) {
            replace('/')
        }
    }, [user])

    return mounted && user ? (
        <UserPageContextProvider user={user}>
            <UserHeader editable />
            <UserContent />
        </UserPageContextProvider>
    ) : (
        <></>
    )
}

export default ProfilePage
