import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'
import { Button, Card, Flex, Icon, IconType, Typography } from '~/components'
import { Launchpad, useQueryLaunchpadQuery } from '~/gql/generated/graphql'
import { getLaunchpadInfo } from '~/services/blockChain'
import { DateTime } from 'luxon'
import { CreateMetadataStoreModal } from './Modal/create'
import { PreviewMetadataModal } from './Modal/preview'
import { useCreateMetadataStore } from '~/hooks/web3/launchpad'
import { StepCard } from './StepCard'

export const StudioDetailMetadataSection = ({ launchpad: oldLaunchpad }: { launchpad: Launchpad }) => {
    const { t } = useTranslation('studio')
    const [mintInfo, setMintInfo] = useState<{
        remain: number
        sold: number
        total: number
        launchpad: Launchpad
    } | null>(null)

    const [open, setOpen] = useState(false)
    const [launchpad, setLaunchpad] = useState<Launchpad>(oldLaunchpad)
    const [openPreviewModal, setOpenPreviewModal] = useState(false)
    const [scheduleError, setScheduleError] = useState<string | null>(null)
    const { isCreating, create } = useCreateMetadataStore()

    const { refetch } = useQueryLaunchpadQuery({
        id: oldLaunchpad.id,
    })

    useEffect(() => {
        const getMintInfo = async () => {
            const res = await getLaunchpadInfo(launchpad)
            setMintInfo(res)
            const metadataTotal = launchpad.hatchMetadata?.length ?? 0
            if (res.total !== metadataTotal && metadataTotal !== 0) {
                setScheduleError(
                    t('studioDetail.hatching.errors.countMissmatch', {
                        cNfts: res.total,
                        mNfts: metadataTotal,
                    }),
                )
            } else {
                setScheduleError(null)
            }
        }
        if (launchpad) {
            getMintInfo()
        }
    }, [launchpad])
    const firstLaunchDate =
        launchpad?.venues?.sort(
            (a, b) => DateTime.fromISO(a.startTime).toMillis() - DateTime.fromISO(b.startTime).toMillis(),
        )?.[0]?.startTime ??
        launchpad?.launchDate ??
        null
    const downloadExample = () => {
        const url = '/assets/example/studio-example.json'
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', url)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <>
            <Flex flexDirection="column" fullWidth gap={8} className={clsx('mt-10')}>
                {!launchpad.metadataStore && (
                    <Card flexDirection="row" gap={2} variant="secondary">
                        <Icon icon={IconType.info} colorClass="fill-light-gray dark:fill-dark-gray" />
                        <Flex flexDirection="row" justifyContent="between" gap={2} fullWidth>
                            <Flex flexDirection="column" gap={2}>
                                <Typography variant="md" bold transform="uppercase">
                                    {t('studioDetail.hatching.hits.title')}
                                </Typography>
                                <Typography variant="sm" bold color="secondary">
                                    {t('studioDetail.hatching.hits.description')}
                                </Typography>
                                <Flex
                                    gap={3}
                                    justifyContent="start"
                                    alignItems="start"
                                    className="cursor-pointer pt-1"
                                    onClick={downloadExample}
                                >
                                    <Icon
                                        icon={IconType.download}
                                        colorClass="fill-light-primary dark:fill-dark-primary"
                                    />
                                    <Typography variant="md" color="primary">
                                        {t('common:input.file.example')}
                                    </Typography>
                                </Flex>
                            </Flex>
                            <div>
                                <Button
                                    variant="primary"
                                    title={'Set Hatch'}
                                    className="py-2"
                                    disabled={isCreating}
                                    onClick={() => {
                                        setOpen(true)
                                    }}
                                />
                            </div>
                        </Flex>
                    </Card>
                )}
                {launchpad.hatchMetadata && launchpad.hatchMetadata.length > 0 && (
                    <StepCard
                        title={t('studioDetail.hatching.hatchingCard.title')}
                        variant="secondary"
                        icon={IconType.merge}
                        tag={t(launchpad.metadataStore ? 'studioDetail.tags.scheduled' : 'studioDetail.tags.pending')}
                        date={launchpad.hatchDate}
                    >
                        <div>
                            <Button
                                variant="primary"
                                title={t('common:button.preview')}
                                className="py-2"
                                onClick={() => setOpenPreviewModal(true)}
                                disabled={isCreating}
                            />
                        </div>
                    </StepCard>
                )}
                <StepCard
                    title={t('studioDetail.hatching.originalCard.title')}
                    variant="primary"
                    icon={IconType.edit}
                    tag={t('studioDetail.tags.original')}
                    date={firstLaunchDate}
                >
                    <div>
                        <Typography variant="sm" color="secondary">
                            {t('studioDetail.hatching.originalCard.description')}
                        </Typography>
                    </div>
                </StepCard>
                {!launchpad.metadataStore && (
                    <Flex flexDirection="column" gap={2}>
                        <Button
                            className="w-[200px]"
                            variant="primary"
                            title={t('common:button.schedule')}
                            disabled={!!scheduleError || isCreating}
                            onClick={async () => {
                                setScheduleError(null)
                                try {
                                    await create(launchpad, mintInfo)
                                    const data = await refetch()
                                    const newData = data?.data?.launchpad
                                    if (newData) {
                                        setLaunchpad(newData as Launchpad)
                                    }
                                } catch (error: any) {
                                    setScheduleError(error.message)
                                }
                            }}
                        />
                        {scheduleError && (
                            <Typography variant="sm" color="error">
                                {scheduleError}
                            </Typography>
                        )}
                    </Flex>
                )}
            </Flex>
            <CreateMetadataStoreModal
                launchpad={launchpad}
                open={open}
                onClose={() => setOpen(false)}
                onSuccess={async () => {
                    const data = await refetch()
                    const newData = data?.data?.launchpad
                    if (newData) {
                        setLaunchpad(newData as Launchpad)
                        const total = mintInfo?.total ?? 0
                        const metadataTotal = newData.hatchMetadata?.length ?? 0
                        if (total !== metadataTotal && metadataTotal !== 0) {
                            setScheduleError(
                                t('studioDetail.hatching.errors.countMissmatch', {
                                    cNfts: total,
                                    mNfts: metadataTotal,
                                }),
                            )
                        } else {
                            setScheduleError(null)
                        }
                    }
                    setOpen(false)
                }}
            />
            <PreviewMetadataModal
                open={openPreviewModal}
                onClose={() => setOpenPreviewModal(false)}
                metadata={launchpad.hatchMetadata ?? []}
            />
        </>
    )
}

export default StudioDetailMetadataSection
