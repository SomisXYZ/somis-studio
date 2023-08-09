import useTranslation from 'next-translate/useTranslation'
import { FormProvider, useForm } from 'react-hook-form'
import { StudioContainer } from '~/containers/Studio/Container'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormSection } from '~/components/FormSection'
import { Button, Flex } from '~/components'
import clsx from 'clsx'
import { FileUploadInput } from '~/components/Input/FileUpload'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { QueryClient } from '@tanstack/react-query'
import { Launchpad, useQueryLaunchpadQuery } from '~/gql/generated/graphql'
import toast from 'react-hot-toast'
import { MintingStep } from '~/containers/Studio/MintingStep'
import { PreviewStep } from '~/containers/Studio/PreviewStep'

export type CreateGenerativeCollectionForm = {
    metadata: FileList | null
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

const StudioCreateGenerativeCollectionPage = ({ launchpad }: { launchpad: Launchpad }) => {
    const { t } = useTranslation('studio')
    const router = useRouter()
    const [showPreview, setShowPreview] = useState(false)
    const [minting, setMinting] = useState(false)
    const [loading, setLoading] = useState(false)
    const [nfts, setNfts] = useState<
        {
            imageUrl: string
            name: string
            description: string
            attributes?: {
                name: string
                value: string
            }[]
            address: string | null
            state: 'inQueue' | 'minting' | 'minted' | 'failed'
        }[]
    >([])
    const [previewLoading, setPreviewLoading] = useState(false)

    // Form validation
    const schema = yup.object().shape({
        metadata: yup.mixed().required(t('common:validation.required')),
    })

    // Form
    const formMethods = useForm<CreateGenerativeCollectionForm>({
        mode: 'onBlur',
        resolver: yupResolver(schema),
        defaultValues: {
            supply: undefined,
            batchNumber: undefined,
            metadata: null,
        },
    })
    const {
        register,
        reset,
        getValues,
        setValue,
        trigger,
        formState: { errors },
    } = formMethods

    return !minting ? (
        <StudioContainer
            position="center"
            title={t('createGenerativeCollection.title')}
            description={t('createGenerativeCollection.description')}
        >
            <FormProvider {...formMethods}>
                <form className="flex w-full flex-col items-center gap-12">
                    <Flex flexDirection="column" className="w-full lg:w-1/2" gap={6}>
                        {/* Media */}
                        {/* <FormSection
                            title={t('label.media')}
                            name="media"
                            focus={false}
                            error={errors.media?.message}
                            description={t('description.media')}
                        >
                            <FileUploadInput {...register('media')} example="http://" />
                        </FormSection> */}
                        {/* Metatdata */}
                        <FormSection
                            title={t('label.metadata')}
                            name="metadata"
                            focus={false}
                            error={errors.metadata?.message}
                            description={t('description.metadata')}
                        >
                            <FileUploadInput
                                {...register('metadata')}
                                example={'/assets/example/studio-example.json'}
                            />
                        </FormSection>
                    </Flex>
                    {/* Buttons */}
                    <Flex fullWidth justifyContent="between" className="w-full lg:w-1/2">
                        <Button
                            type="button"
                            variant="primary"
                            title={t('common:button.upload')}
                            className={clsx('w-1/6')}
                            disabled={Object.keys(errors).length > 0}
                            loading={previewLoading}
                            onClick={async () => {
                                setShowPreview(false)
                                setPreviewLoading(true)
                                const result = await trigger(['metadata'])
                                const metadata = getValues('metadata')
                                if (result && metadata) {
                                    const fileReader = new FileReader()
                                    fileReader.readAsText(metadata?.[0])
                                    fileReader.onload = () => {
                                        try {
                                            const json = JSON.parse(fileReader.result as string)
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            const nfts = json.map((item: any) => {
                                                return {
                                                    name: item.name,
                                                    description: item.description,
                                                    imageUrl: item.imageUrl,
                                                    attributes: item.attributes,
                                                    state: 'inQueue',
                                                }
                                            })

                                            const nftSchema = yup.object().shape({
                                                name: yup.string().required(t('common:validation.required')),
                                                description: yup.string().required(t('common:validation.required')),
                                                imageUrl: yup.string().required(t('common:validation.required')),
                                                attributes: yup.array().of(
                                                    yup.object().shape({
                                                        name: yup.string().required(t('common:validation.required')),
                                                        value: yup.string().required(t('common:validation.required')),
                                                    }),
                                                ),
                                            })

                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            nfts.forEach((nft: any) => {
                                                nftSchema.validateSync(nft)
                                            })
                                            setNfts(nfts)
                                            setValue('supply', nfts.length)
                                            setShowPreview(true)
                                            setPreviewLoading(false)
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        } catch (error: any) {
                                            if (error instanceof yup.ValidationError) {
                                                toast(`${error.path} ${error.errors}`)
                                            } else {
                                                toast('File is not valid')
                                            }
                                            setPreviewLoading(false)
                                        }
                                    }
                                }
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

export default StudioCreateGenerativeCollectionPage
