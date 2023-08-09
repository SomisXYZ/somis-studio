import useTranslation from 'next-translate/useTranslation'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { StudioContainer } from '~/containers/Studio/Container'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormSection } from '~/components/FormSection'
import { Button, Flex, IconType, TextInput, Toggle } from '~/components'
import TextAreaInput from '~/components/Input/TextAreaInput'
import clsx from 'clsx'
import { ImageUploadInput } from '~/components/Input/ImageUpload'
import { useState } from 'react'
import useAlert from '~/components/Alert/context'
import { createCollection, createLaunchpad, createStudio } from '~/services/studio/service'
import walletKitContext from '~/components/Wallet/WalletKitContext'
import { TransactionBlock, fromB64, normalizeSuiObjectId, SuiObjectChangeCreated, MIST_PER_SUI } from '@mysten/sui.js'
import { getAllDynamicFields, getCreatedObjectByType, getCreatedObjectsByType, getObject } from '~/services/blockChain'
import { convertSuiToMist, DEFAULT_GAS_BUDGET, EnableFixedGasPrice } from '~/utils/sui'
import { Launchpad, OrderbookType } from '~/gql/generated/graphql'
import { DateTime } from 'luxon'
import { delay } from '~/utils/helpers'

export type CreateStudioLaunchForm = {
    collectionName: string
    symbol: string
    description: string
    url: string | null
    royalty: number
    image: FileList | null
    coverImage: FileList | null
    logo: FileList | null
    venues: {
        name: string | null
        isPublicSale: boolean | null
        maxMintByWallet: number | null
        price: string | null
        startTime: string | null
    }[]
}

export const CreateStudioLaunchpadStep = ({
    onCancel,
    onSuccess,
}: {
    onCancel?: () => Promise<void> | void
    onSuccess: (launchpad: Launchpad) => Promise<void> | void
}) => {
    const { t } = useTranslation('studio')
    const [loading, setLoading] = useState(false)
    const { open: AlertOpen, setChildren } = useAlert()
    const { signAndExecuteTransactionBlock, currentAccount } = walletKitContext.useWalletKit()

    // Form validation
    const schema = yup.object().shape({
        collectionName: yup.string().required(t('common:validation.required')),
        symbol: yup
            .string()
            .required(t('common:validation.required'))
            .max(8, t('common:validation.max', { max: 8 })),
        description: yup.string().required(t('common:validation.required')),
        royalty: yup.number().typeError(t('common:validation.numberType')),
        venues: yup.array().of(
            yup.object().shape({
                name: yup.string().required(t('common:validation.required')),
                isPublicSale: yup.boolean().required(t('common:validation.required')),
                maxMintByWallet: yup.number().typeError(t('common:validation.numberType')),
                price: yup
                    .number()
                    .typeError(t('common:validation.numberType'))
                    .required(t('common:validation.required')),
            }),
        ),
        image: yup.mixed().required(t('common:validation.required')),
        coverImage: yup.mixed().required(t('common:validation.required')),
        logo: yup.mixed().required(t('common:validation.required')),
    })

    // Form
    const formMethods = useForm<CreateStudioLaunchForm>({
        mode: 'onBlur',
        resolver: yupResolver(schema),
        defaultValues: {
            collectionName: '',
            symbol: '',
            description: '',
            royalty: 0,
            image: null,
            coverImage: null,
            logo: null,
            venues: [],
        },
    })
    const {
        handleSubmit,
        register,
        control,
        reset,
        getValues,
        setValue,
        formState: { errors },
    } = formMethods

    const { fields, append, prepend, remove, swap, move, insert, replace } = useFieldArray({
        control,
        name: 'venues',
    })

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true)
        try {
            if (!currentAccount) {
                throw new Error('Please connect wallet')
            }
            const form = getValues()
            const formVenues = form.venues.map((venue) => ({
                name: venue.name || '',
                isPublicSale: venue.isPublicSale == null ? true : venue.isPublicSale,
                maxMintByWallet: Number(venue.maxMintByWallet) || -1,
                price: Number(convertSuiToMist(venue.price || 0)),
                startTime: DateTime.fromJSDate(new Date(venue.startTime || Date.now())).toISO() || '',
            }))
            const description = form.description.replaceAll('\n', ' ')
            const builder = await createStudio({
                collectionName: form.collectionName,
                symbol: form.symbol,
                description,
                url: form.url || '',
                royalty: 0,
                venues: formVenues,
                creator: currentAccount.address,
            })
            const builderTx = new TransactionBlock()
            const upgradeCap = builderTx.publish({
                modules: builder.modules.map((m) => Array.from(fromB64(m))),
                dependencies: builder.dependencies.map((addr) => normalizeSuiObjectId(addr)),
            })
            builderTx.transferObjects([upgradeCap], builderTx.pure(currentAccount?.address))

            if (EnableFixedGasPrice) {
                builderTx.setGasBudget(DEFAULT_GAS_BUDGET)
            }

            const result = await signAndExecuteTransactionBlock({
                transactionBlock: builderTx,
                options: {
                    showEvents: true,
                    showEffects: true,
                    showObjectChanges: true,
                },
            })
            console.log(`deployed contract result: `, result)

            const listing = getCreatedObjectByType(result, /Listing/)
            const market = getCreatedObjectByType(result, /FixedPriceMarket/)
            const venues = getCreatedObjectsByType(result, /Venue/)
            const warehouse = getCreatedObjectByType(result, /Inventory/)
            const publisher = getCreatedObjectByType(result, /Publisher/)
            const transferPolicy = getCreatedObjectByType(result, /TransferPolicy/)
            const borrowPolicy = getCreatedObjectByType(result, /BORROW_REQ/)
            const orderbook = getCreatedObjectByType(result, /Orderbook/)

            let venueInfos: {
                address: string
                isPublicSale: boolean
                price: any
                maxMintByWallet: any
            }[] = []
            let success = false
            let count = 0
            while (!success && count < 20) {
                try {
                    venueInfos = await Promise.all(
                        venues.map(async (venue) => {
                            const venueData = await getObject(venue)
                            const venueDf = await getAllDynamicFields(venue)
                            const venueDfData = await getObject(venueDf[0].objectId)
                            return {
                                address: venue,
                                isPublicSale: (venueData.data?.content as any)?.fields.is_whitelisted === false,
                                price: (venueDfData.data?.content as any)?.fields.value.fields.price,
                                maxMintByWallet: (venueDfData.data?.content as any)?.fields.value.fields.limit ?? '-1',
                            }
                        }),
                    )
                    success = true
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    count++
                    // console.error(error)
                    console.log('retrying', count)
                    await delay(1000 * count)
                }
            }
            const mappedformVenues = formVenues.map((venue) => {
                const venueInfoIdx = venueInfos.findIndex(
                    (v) =>
                        v.isPublicSale === venue.isPublicSale &&
                        v.price === venue.price.toString() &&
                        v.maxMintByWallet === venue.maxMintByWallet.toString(),
                )

                if (venueInfoIdx === -1) {
                    throw new Error('Venue info not found')
                }
                const venueInfo = venueInfos[venueInfoIdx]
                venueInfos.splice(venueInfoIdx, 1)
                return {
                    name: venue.name,
                    isPublicSale: venueInfo?.isPublicSale,
                    price: (Number(venueInfo.price) * (1 / Number(MIST_PER_SUI))).toString(),
                    maxMintPerWallet: Number(venueInfo?.maxMintByWallet),
                    startTime: venue.startTime,
                    address: venueInfo?.address,
                }
            })

            if (result.effects?.status.status === 'failure') {
                const error = result.effects.status.error
                if (!error) {
                    throw new Error('Transaction failed')
                }
                if (error.includes('InsufficientCoinBalance') || error.includes('InsufficientGas')) {
                    throw new Error('Insufficient Gas Fee to execute transaction')
                }
                throw new Error('Transaction failed, please try again')
            }

            if (!publisher) {
                throw new Error('publisher is not defined')
            }

            const collection = result.objectChanges?.find(
                (change) => change.type === 'created' && change?.objectType?.includes('::collection::Collection'),
            ) as SuiObjectChangeCreated | undefined
            const collectionAddress = collection?.objectId

            if (!collectionAddress) {
                throw new Error('Collection address is not defined')
            }
            const collectionType = collection?.objectType?.match(/.*<(.*)>/)?.[1]
            if (collectionType == null) {
                throw new Error('Collection type is not defined')
            }
            const [package_, module_] = collectionType.split('::')

            const [, createLaunchpadRes] = await Promise.all([
                await createCollection({
                    address: collectionAddress,
                    description,
                    name: form.collectionName,
                    packageModule: `${package_}::${module_}`,
                    type: collectionType,
                    slug: collectionAddress,
                    image: form.image?.[0],
                    logo: form.logo?.[0],
                    cover: form.coverImage?.[0],
                    orderbook: orderbook,
                    orderbookType: OrderbookType.ObV1,
                    transferPolicy,
                }),
                await createLaunchpad({
                    category: 'Collectiable',
                    collectionAddress,
                    listing,
                    publisher,
                    borrowPolicy,
                    market,
                    name: form.collectionName,
                    royalty: form.royalty ? form.royalty * 100 : 0,
                    venues: mappedformVenues,
                    warehouse,
                    website: form.url,
                    image: form.image?.[0],
                    logo: form.logo?.[0],
                    cover: form.coverImage?.[0],
                }),
            ])

            setLoading(false)
            reset()
            await onSuccess(createLaunchpadRes)
        } catch (error) {
            setLoading(false)
            console.log(error)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setChildren(<div>{(error as unknown as any)?.message}</div>)
            AlertOpen()
        }
    })

    return (
        <StudioContainer
            position="center"
            title={t('createCollection.title')}
            description={t('createFixedCollection.description')}
        >
            <FormProvider {...formMethods}>
                <form className="flex w-full flex-col items-center gap-6">
                    <Flex flexDirection="column" className="w-full lg:w-1/2" gap={6}>
                        {/* Collection Name */}
                        <FormSection
                            title={t('label.collectionName')}
                            name="collectionName"
                            error={errors.collectionName?.message}
                        >
                            <TextInput {...register('collectionName')} />
                        </FormSection>
                        {/* Symbol */}
                        <FormSection title={t('label.symbol')} name="symbol" error={errors.symbol?.message}>
                            <TextInput {...register('symbol')} className={clsx('w-1/3 lg:w-1/6')} />
                        </FormSection>
                        {/* Description */}
                        <FormSection
                            title={t('label.description')}
                            name="description"
                            error={errors.description?.message}
                        >
                            <TextAreaInput {...register('description')} />
                        </FormSection>
                        {/* Url */}
                        <FormSection title={t('label.url')} name="url" error={errors.url?.message}>
                            <TextInput {...register('url')} />
                        </FormSection>
                        {/* Royalty */}
                        <FormSection title={t('label.royalty')} name="royalty" error={errors.royalty?.message}>
                            <TextInput
                                {...register('royalty')}
                                min={0}
                                max={100}
                                step={1}
                                containerClassName={clsx('w-2/12')}
                                placeholder="Digit from 0 to 100"
                                type="number"
                                suffix="%"
                            />
                        </FormSection>
                        {/* Sale Tiers */}
                        <FormSection title={t('label.saleGroups')} name="saleGroups" focus={false}>
                            <Flex fullWidth gap={2} flexDirection="column">
                                {fields.map((item, index) => {
                                    return (
                                        <Flex
                                            key={item.id}
                                            gap={4}
                                            flexDirection="column"
                                            className={clsx('color-border', 'border', 'p-4', 'rounded')}
                                        >
                                            <Flex justifyContent="between" className={clsx('h-[56px]')}>
                                                {/* TODO: Add toggle action */}
                                                <FormSection
                                                    title={t('label.isPublicSale')}
                                                    name={`venues.${index}.isPublicSale`}
                                                    focus={false}
                                                    error={errors.venues?.[index]?.isPublicSale?.message}
                                                >
                                                    <div className={clsx('pl-2', 'pt-2')}>
                                                        <Toggle
                                                            register={register(`venues.${index}.isPublicSale`)}
                                                            checkedCallback={(checked) => {
                                                                setValue(`venues.${index}.isPublicSale`, checked)
                                                            }}
                                                        />
                                                    </div>
                                                </FormSection>
                                            </Flex>
                                            <FormSection
                                                title={t('label.venueName')}
                                                name={`venues.${index}.name`}
                                                error={errors.venues?.[index]?.name?.message}
                                            >
                                                <TextInput {...register(`venues.${index}.name`)} />
                                            </FormSection>
                                            <FormSection
                                                title={t('label.maxMintByWallet')}
                                                name={`venues.${index}.maxMintByWallet`}
                                                error={errors.venues?.[index]?.maxMintByWallet?.message}
                                                helper={t('helper.maxMintByWalletHelper')}
                                            >
                                                <TextInput
                                                    {...register(`venues.${index}.maxMintByWallet`)}
                                                    containerClassName={clsx('w-2/12')}
                                                />
                                            </FormSection>
                                            <FormSection
                                                title={t('label.price')}
                                                name={`venues.${index}.price`}
                                                error={errors.venues?.[index]?.price?.message}
                                            >
                                                <TextInput
                                                    {...register(`venues.${index}.price`)}
                                                    type="number"
                                                    min={0}
                                                    step={0.00001}
                                                    containerClassName={clsx('w-2/12')}
                                                    suffixIcon={IconType.sui}
                                                    suffixIconColorClass="fill-blue"
                                                />
                                            </FormSection>
                                            <FormSection
                                                title={t('label.startTime')}
                                                name="startTime"
                                                error={errors.venues?.[index]?.startTime?.message}
                                            >
                                                <TextInput
                                                    {...register(`venues.${index}.startTime`)}
                                                    type="datetime-local"
                                                    containerClassName={clsx('w-4/12')}
                                                />
                                            </FormSection>
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                title={t('common:button.remove')}
                                                onClick={() => remove(index)}
                                            />
                                        </Flex>
                                    )
                                })}
                            </Flex>
                            <Button
                                title={t('common:button.add')}
                                type="button"
                                onClick={() => {
                                    append({
                                        name: fields.length === 0 ? 'Public Sale' : '',
                                        isPublicSale: fields.length === 0 ? true : null,
                                        maxMintByWallet: fields.length === 0 ? -1 : null,
                                        price: null,
                                        startTime: null,
                                    })
                                }}
                            />
                        </FormSection>
                        {/* Image */}
                        <FormSection title={t('label.image')} name="image" focus={false} error={errors.image?.message}>
                            <ImageUploadInput {...register('image')} />
                        </FormSection>
                        {/* Cover Image */}
                        <FormSection
                            title={t('label.coverImage')}
                            name="coverImage"
                            focus={false}
                            error={errors.coverImage?.message}
                        >
                            <ImageUploadInput {...register('coverImage')} />
                        </FormSection>
                        {/* Logo */}
                        <FormSection title={t('label.logo')} name="logo" focus={false} error={errors.logo?.message}>
                            <ImageUploadInput
                                {...register('logo')}
                                placeholder=""
                                className={clsx('w-[100px]', 'h-[100px]')}
                            />
                        </FormSection>
                    </Flex>
                    {/* Buttons */}
                    <Flex fullWidth justifyContent="between">
                        <Button
                            type="button"
                            variant="tertiary"
                            title={'Cancel'}
                            onClick={() => {
                                reset()
                                onCancel?.()
                            }}
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            title={'Next'}
                            className={clsx('w-1/6')}
                            disabled={Object.keys(errors).length > 0}
                            onClick={onSubmit}
                            loading={loading}
                        />
                    </Flex>
                </form>
            </FormProvider>
        </StudioContainer>
    )
}
