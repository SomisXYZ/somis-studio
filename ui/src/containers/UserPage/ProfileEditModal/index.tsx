import clsx from 'clsx'
import { toSvg } from 'jdenticon'
import useTranslation from 'next-translate/useTranslation'
import { useRef, useState, useEffect } from 'react'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { Flex, Icon, IconType, Image, TextInput, Typography } from '~/components'
import { Modal } from '~/components/Modal'
import { Spinner } from '~/components/Spinner'
import authContext from '~/contexts/auth'
import { useUpdateProfileMutation, useUpdateUserProfileImageMutation } from '~/gql/generated/graphql'

const ProfileModalContent = ({
    submitting,
    methods,
}: {
    submitting: boolean
    methods: UseFormReturn<{ name: string; profileUrl: undefined; showDiscordName: boolean; showTwitterName: boolean }>
}) => {
    const { user } = authContext.useAuthState()
    const { t } = useTranslation('user')
    const emptyImage = 'data:image/svg+xml;base64,' + Buffer.from(toSvg(user?.address, 100)).toString('base64')

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [image, setImage] = useState<string>(user?.profileUrl ?? emptyImage)
    useEffect(() => {
        methods.reset({
            name: user?.name,
            profileUrl: undefined,
            showDiscordName: false,
            showTwitterName: false,
        })
        setImage(user?.profileUrl ?? emptyImage)
    }, [])

    return (
        <Flex gap={6} flexDirection="column" fullWidth justifyContent="start" className={clsx('py-3')}>
            <Flex fullWidth justifyContent="start" gap={6} className={clsx('max-md:flex-col')}>
                <Flex flex={1} gap={2} flexDirection="column" justifyContent="start">
                    <Typography bold variant="md" transform="uppercase">
                        {t('profileModalContent.profileImage')}
                    </Typography>
                    <div>
                        <div
                            className={clsx(
                                'border',
                                'rounded',
                                'border-dashed',
                                'border-light-secondary-border',
                                'max-w-[180px] p-[10px]',
                            )}
                        >
                            <div className={clsx('relative', 'group', 'flex', 'grow')}>
                                <Image
                                    src={image}
                                    alt={user?.name}
                                    priority
                                    loading="eager"
                                    className={clsx('max-w-[160px]', 'aspect-square', 'w-full', 'rounded-full')}
                                />
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
                                            <Controller
                                                name="profileUrl"
                                                control={methods.control}
                                                render={({ field }) => (
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        className={clsx('hidden')}
                                                        onChange={async (e) => {
                                                            if (!e.target.files) return
                                                            setImage(URL.createObjectURL(e.target.files[0]))
                                                            field.onChange(e.target.files[0])
                                                        }}
                                                        accept="image/png, image/jpeg"
                                                    />
                                                )}
                                            />
                                        </div>
                                    )}
                                </Flex>
                            </div>
                        </div>
                        <Typography color="secondary" variant="sm" font="jbm">
                            {t('profileModalContent.profileImageDescription')}
                        </Typography>
                    </div>
                </Flex>
                <Flex gap={2} flexDirection="column" flexBasis={'1/2'}>
                    <Typography bold variant="md" transform="uppercase">
                        {t('profileModalContent.social')}
                    </Typography>
                </Flex>
            </Flex>
            <Flex gap={2} flexDirection="column" fullWidth>
                <Typography bold font="jbm" variant="md">
                    {t('profileModalContent.displayName')}
                </Typography>
                <TextInput
                    placeholder={t('profileModalContent.displayNamePlaceholder')}
                    {...methods.register('name')}
                    disabled={submitting}
                />
            </Flex>
            {/* <Flex gap={2} flexDirection="column" fullWidth>
                    <Typography bold font="jbm" variant="md">
                        PUBLIC PROFILE INFORMATION
                    </Typography>
                    <Flex flexDirection="column" fullWidth>
                        <Checkbox
                            bgColor={false}
                            {...methods.register('showDiscordName')}
                            checked={methods.watch('showDiscordName')}
                            className={clsx('px-0')}
                        >
                            <Typography font="jbm" variant="md">
                                Discord profile
                            </Typography>
                        </Checkbox>
                        <Checkbox
                            bgColor={false}
                            {...methods.register('showTwitterName')}
                            checked={methods.watch('showTwitterName')}
                            className={clsx('px-0')}
                        >
                            <Typography font="jbm" variant="md">
                                Twitter handle
                            </Typography>
                        </Checkbox>
                    </Flex>
                    <Typography color="secondary" variant="sm" font="jbm">
                        Choose which information to display on your Somis profile
                    </Typography>
                </Flex> */}
        </Flex>
    )
}

export const ProfileEditModal = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
    const { user, refreshUser } = authContext.useAuthState()
    const { t } = useTranslation('user')
    const methods = useForm({
        defaultValues: {
            name: user?.name ?? '',
            profileUrl: undefined,
            showDiscordName: false,
            showTwitterName: false,
        },
    })
    const { mutateAsync: mutateImageAsync } = useUpdateUserProfileImageMutation()
    const { mutateAsync: mutateProfileAsync } = useUpdateProfileMutation()

    const [submitting, setSubmitting] = useState<boolean>(false)

    const uploadImage = async (file: File) => {
        try {
            const result = await mutateImageAsync({})
            const formData = new FormData()
            Object.entries(result.updateUserProfileImage.fields).forEach(([field, value]) => {
                formData.append(field, value as string)
            })
            formData.append('file', file)
            await fetch(result.updateUserProfileImage.url, {
                method: 'POST',
                body: formData,
            })
        } catch (error) {
            console.error(error)
        }
    }

    const updateProfile = async (data: { name: string }) => {
        try {
            await mutateProfileAsync({
                input: {
                    name: data.name,
                },
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error)
            methods.setError('name', {
                type: 'manual',
                message: error.message,
            })
        }
    }

    return (
        <Modal
            iconSize={{
                width: 14,
                height: 14,
            }}
            maxWidth={'520px'}
            title="Edit Profile"
            titleIcon={IconType.edit}
            show={show}
            formMethod={methods}
            confirmButton={{
                title: t('common:button.save'),
                type: 'submit',
                onClick: async () => {
                    setSubmitting(true)
                    await methods.handleSubmit(async (data) => {
                        if (data.profileUrl) {
                            await uploadImage(data.profileUrl)
                        }
                        if (data.name && data.name !== '' && data.name !== user?.name) {
                            await updateProfile({
                                name: data.name,
                            })
                        }
                        methods.reset({
                            name: data?.name,
                            profileUrl: undefined,
                            showDiscordName: data.showDiscordName,
                            showTwitterName: data.showTwitterName,
                        })
                    })()
                    await refreshUser()
                    setSubmitting(false)
                    onClose()
                },
                loading: submitting,
            }}
            cancelButton={{
                title: t('common:button.cancel'),
                onClick: () => {
                    onClose()
                },
                disabled: submitting,
            }}
            onClose={() => {
                onClose()
            }}
        >
            <ProfileModalContent submitting={submitting} methods={methods} />
        </Modal>
    )
}
