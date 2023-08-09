import clsx from 'clsx'
import { useRef, useState } from 'react'
import { Flex, Icon, IconType } from '~/components'
import { Spinner } from '~/components/Spinner'
import { User, useUpdateUserProfileImageMutation } from '~/gql/generated/graphql'
import { useAuthState } from '~/contexts/auth'
import { ProfileImage } from '~/containers/ProfileImage'

interface Props {
    user: User
    loading: boolean
    editable: boolean
    className?: string
}

export const EditableProfileImage = ({ editable, className, user }: Props) => {
    const { refreshUser } = useAuthState()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { mutateAsync } = useUpdateUserProfileImageMutation()
    const [submitting, setSubmitting] = useState(false)
    const uploadProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            setSubmitting(true)
            const result = await mutateAsync({})
            const formData = new FormData()
            Object.entries(result.updateUserProfileImage.fields).forEach(([field, value]) => {
                formData.append(field, value as string)
            })
            formData.append('file', file)
            await fetch(result.updateUserProfileImage.url, {
                method: 'POST',
                body: formData,
            })
            await refreshUser()
            setSubmitting(false)
        } catch (error) {
            console.error(error)
            setSubmitting(false)
        }
    }

    return (
        <div className={clsx('relative', 'group', 'flex', 'grow')}>
            <ProfileImage priority loading="eager" className={className} user={user} />
            {editable && (
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    className={clsx(
                        'absolute',
                        '-top-[1px]',
                        '-left-[1px]',
                        'w-[calc(100%_+_2px)]',
                        'h-[calc(100%_+_2px)]',
                        'group-hover:opacity-100',
                        'rounded-full',
                        'bg-black',
                        'bg-opacity-80',
                        'group-hover:flex',
                        'cursor-pointer',
                        'transition-opacity',
                        submitting ? 'opacity-100' : 'opacity-0',
                    )}
                    onClick={() => {
                        fileInputRef.current?.click()
                    }}
                >
                    {submitting ? (
                        <Spinner />
                    ) : (
                        <div className={clsx('group-hover:block', 'hidden')}>
                            <Icon icon={IconType.camera} />
                            <input
                                ref={fileInputRef}
                                type="file"
                                className={clsx('hidden')}
                                onChange={uploadProfileImage}
                                accept="image/png, image/jpeg"
                            />
                        </div>
                    )}
                </Flex>
            )}
        </div>
    )
}
