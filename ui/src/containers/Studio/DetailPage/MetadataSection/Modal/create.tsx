import useTranslation from 'next-translate/useTranslation'
import { Card, Flex, IconType, TextInput, Typography } from '~/components'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-hot-toast'
import { FileUploadInput } from '~/components/Input/FileUpload'
import { useState } from 'react'
import { HatchMetadata, HatchMetadataAttribute, Launchpad, useUpdateLaunchpadMutation } from '~/gql/generated/graphql'
import { Modal } from '~/components/Modal'
import { DateTime } from 'luxon'

interface CreateMetadataStoreForm {
    metadata: HatchMetadata[]
    startTime: string
}

export const CreateMetadataStoreModal = ({
    launchpad,
    open,
    onClose,
    onSuccess,
}: {
    launchpad: Launchpad
    open: boolean
    onClose: () => void
    onSuccess: () => void | Promise<void>
}) => {
    const [fileNotValid, setFileNotValid] = useState(false)

    const { t } = useTranslation('studio')
    const schema = yup.object().shape({
        metadata: yup
            .array()
            .of(
                yup.object().shape({
                    name: yup.string().required(),
                    description: yup.string().required(),
                    imageUrl: yup.string().required(),
                    attributes: yup.array().of(
                        yup.object().shape({
                            name: yup.string().required(),
                            value: yup.string().required(),
                        }),
                    ),
                }),
            )
            .required(t('common:validation.required')),
        startTime: yup.string().required(t('common:validation.required')),
    })
    const formMethods = useForm<CreateMetadataStoreForm>({ mode: 'onBlur', resolver: yupResolver(schema) })
    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors, isValid },
    } = formMethods

    const { mutateAsync: updateLaunchpad, isLoading } = useUpdateLaunchpadMutation()

    return (
        <Modal
            show={open}
            title={t('studioDetail.hatching.createMetadataModal.title')}
            titleIcon={IconType.edit}
            onClose={onClose}
            confirmButton={{
                title: t('studioDetail.hatching.createMetadataModal.submit'),
                loading: isLoading,
                disabled: isLoading || !isValid || fileNotValid,
                onClick: handleSubmit(async (data) => {
                    await updateLaunchpad({
                        id: launchpad.id,
                        input: {
                            hatchDate: DateTime.fromJSDate(new Date(data.startTime || Date.now())).toISO() || '',
                            hatchMetadata: data.metadata.map((item) => {
                                return {
                                    name: item.name,
                                    description: item.description,
                                    imageUrl: item.imageUrl,
                                    attributes: (item.attributes as HatchMetadataAttribute[]) ?? [],
                                }
                            }),
                        },
                    })
                    toast('Update successfully')
                    onSuccess()
                }),
            }}
            cancelButton={{
                title: 'Cancel',
                disabled: isLoading,
            }}
        >
            <FormProvider {...formMethods}>
                <Flex flexDirection="column" fullWidth gap={6} className="py-4">
                    <Flex flexDirection="row" fullWidth gap={6}>
                        <Card padding={false} alignItems="center" justifyContent="center" className="h-[40px] w-[40px]">
                            1
                        </Card>
                        <Flex flex={1} gap={2} flexDirection="column">
                            <Typography variant="lg" bold font="jbm" transform="uppercase">
                                {t('studioDetail.hatching.createMetadataModal.metatdata.title')}
                            </Typography>
                            <Typography variant="sm" color="secondary" bold>
                                {t('studioDetail.hatching.createMetadataModal.metatdata.description')}
                            </Typography>
                            <div>
                                <FileUploadInput
                                    accept="application/json"
                                    disabled={isLoading}
                                    onChange={async (e: any) => {
                                        setFileNotValid(false)
                                        const data = e.target.files
                                        if (!data) return
                                        const fileReader = new FileReader()
                                        fileReader.readAsText(data?.[0])
                                        fileReader.onload = () => {
                                            try {
                                                const json = JSON.parse(fileReader.result as string)
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                const metadata = json.map((item: any) => {
                                                    return {
                                                        name: item.name,
                                                        description: item.description,
                                                        imageUrl: item.imageUrl,
                                                        attributes: item.attributes,
                                                    }
                                                })
                                                setValue('metadata', metadata)
                                                setFileNotValid(false)
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            } catch (error: any) {
                                                if (error instanceof yup.ValidationError) {
                                                    toast(`${error.path} ${error.errors}`)
                                                } else {
                                                    toast('File is not valid')
                                                    setFileNotValid(true)
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                            {errors.metadata && (
                                <Typography variant="sm" color="error" bold>
                                    {errors.metadata.message}
                                </Typography>
                            )}
                        </Flex>
                    </Flex>
                    <Flex flexDirection="row" fullWidth gap={6}>
                        <Flex flexDirection="row">
                            <Card
                                padding={false}
                                alignItems="center"
                                justifyContent="center"
                                className="h-[40px] w-[40px]"
                            >
                                2
                            </Card>
                        </Flex>
                        <Flex flex={1} gap={2} flexDirection="column">
                            <Typography variant="lg" bold font="jbm" transform="uppercase">
                                {t('studioDetail.hatching.createMetadataModal.startTime.title')}
                            </Typography>
                            <Typography variant="sm" color="secondary" bold>
                                {t('studioDetail.hatching.createMetadataModal.startTime.description')}
                            </Typography>
                            <TextInput
                                placeholder="DD/MM/YYYY"
                                type="datetime-local"
                                className="w-full lg:w-1/2"
                                {...register('startTime')}
                                disabled={isLoading}
                            />
                            {errors.startTime && (
                                <Typography variant="sm" color="error" bold>
                                    {errors.startTime.message}
                                </Typography>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </FormProvider>
        </Modal>
    )
}
