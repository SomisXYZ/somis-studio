import useTranslation from 'next-translate/useTranslation'
import { FormProvider, useForm } from 'react-hook-form'
import { StudioContainer } from '~/containers/Studio/Container'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormSection } from '~/components/FormSection'
import { Button, Flex, TextInput } from '~/components'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { ImageUploadInput } from '~/components/Input/ImageUpload'
import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { QueryClient } from '@tanstack/react-query'
import { Launchpad, useQueryLaunchpadQuery } from '~/gql/generated/graphql'
import { MintingStep } from '~/containers/Studio/MintingStep'
import { getLaunchpadInfo } from '~/services/blockChain'
import { uploadFixedImage } from '~/services/studio/service'
import { PreviewStep } from '~/containers/Studio/PreviewStep'
import { PrecreateNft } from '~/containers/Studio/types'

export type CreateFixedCollectionForm = {
    image: FileList | null
    supply: number
    batchNumber: number
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params } = context
    const id = params?.id as string
    if (!id) {
        return {
            notFound: true,
        }
    }

    const query = new QueryClient()
    const res = await query.fetchQuery(useQueryLaunchpadQuery.getKey({ id }), useQueryLaunchpadQuery.fetcher({ id }))
    const launchpad = res.launchpad

    if (!launchpad) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            launchpad,
        },
    }
}

const StudioCreateFixedCollectionPage = ({ launchpad }: { launchpad: Launchpad }) => {
    const { t } = useTranslation('studio')
    const router = useRouter()
    const [showPreview, setShowPreview] = useState(false)
    const [data, setData] = useState<CreateFixedCollectionForm | null>(null)
    const [image, setImage] = useState<FileList | null>(null)
    const [minting, setMinting] = useState(false)
    const [loading, setLoading] = useState(false)
    const [previewLoading, setPreviewLoading] = useState(false)
    const [nfts, setNfts] = useState<PrecreateNft[]>([])

    // Form validation
    const schema = yup.object().shape({
        image: yup.mixed().required(t('common:validation.required')),
        supply: yup.number().typeError(t('common:validation.numberType')).required(t('common:validation.required')),
    })

    // Form
    const formMethods = useForm<CreateFixedCollectionForm>({
        mode: 'onBlur',
        resolver: yupResolver(schema),
        defaultValues: {
            image: null,
            supply: undefined,
        },
    })
    const {
        register,
        reset,
        getValues,
        watch,
        trigger,
        formState: { errors },
    } = formMethods

    useEffect(() => {
        const subscription = watch(() => {
            const watchImage = watch('image')
            if (watchImage?.[0] !== image?.[0]) {
                setImage(watchImage)
            }
            setData(getValues())
        })
        return () => subscription.unsubscribe()
    }, [watch])

    return !minting ? (
        <StudioContainer
            position="center"
            title={t('createFixedCollection.title')}
            description={t('createFixedCollection.description')}
        >
            <FormProvider {...formMethods}>
                <form className="flex w-full flex-col items-center gap-12">
                    <Flex flexDirection="column" className="w-full lg:w-1/2" gap={6}>
                        {/* Image */}
                        <FormSection title={t('label.image')} name="image" focus={false} error={errors.image?.message}>
                            <ImageUploadInput {...register('image')} className={clsx('w-[150px]', 'h-[150px]')} />
                        </FormSection>
                        {/* Supply */}
                        <FormSection title={t('label.supply')} name="supply" error={errors.supply?.message}>
                            <TextInput
                                {...register('supply')}
                                min={1}
                                max={100}
                                step={1}
                                containerClassName={clsx('w-4/12')}
                                placeholder="Digit from 1 to 100"
                                type="number"
                            />
                        </FormSection>
                    </Flex>
                    {/* Buttons */}
                    <Flex className="w-full lg:w-1/2" justifyContent="between">
                        <Button
                            type="button"
                            variant="primary"
                            title={t('common:button.preview')}
                            className={clsx('w-1/6')}
                            disabled={Object.keys(errors).length > 0}
                            loading={previewLoading}
                            onClick={async () => {
                                setShowPreview(false)
                                setPreviewLoading(true)
                                const result = await trigger(['image', 'supply'])
                                const image = getValues('image')

                                const imageUrl = await uploadFixedImage(launchpad.collection?.address || '', image?.[0])
                                if (result) {
                                    const launchapdBlockchain = await getLaunchpadInfo(launchpad)
                                    const total = launchapdBlockchain?.total || 0
                                    const nftLists = Array.from({ length: data?.supply || 0 }).map((_, index) => ({
                                        imageUrl: imageUrl,
                                        name: `${launchpad.name} #${index + total + 1}`,
                                        description: launchpad.collection?.description || '',
                                        address: null,
                                        state: 'inQueue',
                                    })) as typeof nfts
                                    setNfts(nftLists)
                                    setMinting(false)
                                    setShowPreview(true)
                                }

                                setPreviewLoading(false)
                            }}
                        />
                    </Flex>
                    {showPreview && (
                        <PreviewStep
                            precreateNfts={nfts}
                            launchpad={launchpad}
                            onError={() => {
                                setMinting(false)
                                setLoading(false)
                            }}
                            onCancel={() => {
                                reset()
                                router.push(`/studio/launches/create/type/${launchpad.id}`)
                            }}
                            onSuccess={(newNfts) => {
                                setNfts(newNfts)
                                setLoading(false)
                            }}
                            onMinting={() => {
                                setMinting(true)
                                setLoading(true)
                            }}
                        />
                    )}
                </form>
            </FormProvider>
        </StudioContainer>
    ) : (
        <MintingStep nfts={nfts} launchpad={launchpad} loading={loading} />
    )
}

export default StudioCreateFixedCollectionPage
