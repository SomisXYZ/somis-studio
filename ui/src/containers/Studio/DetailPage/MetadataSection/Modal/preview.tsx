import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { Collapse, Flex, IconType, Image, Typography } from '~/components'
import { Modal } from '~/components/Modal'
import { HatchMetadata } from '~/gql/generated/graphql'

export const PreviewMetadataModal = ({
    open,
    onClose,
    metadata,
}: {
    open: boolean
    onClose: () => void
    metadata: HatchMetadata[]
}) => {
    const { t } = useTranslation('studio')
    return (
        <Modal show={open} title="Preview" onClose={onClose} titleIcon={IconType.merge}>
            <Flex fullWidth gap={4} flexDirection="column" className="max-h-[500px] overflow-y-auto py-4">
                {metadata?.map((item, index) => {
                    return (
                        <Flex fullWidth flexDirection="column" gap={4} key={index}>
                            {/* Attributes Preview */}
                            <Collapse
                                header={
                                    <Flex flexDirection="row" gap={4} alignItems="center">
                                        <Image src={item.imageUrl} alt={item.name} className={clsx('h-10 w-10')} />
                                        <Flex flexDirection="column" gap={2}>
                                            <Typography variant="md" bold>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="sm" color="secondary">
                                                {item.description}
                                            </Typography>
                                        </Flex>
                                    </Flex>
                                }
                            >
                                {item.attributes && (
                                    <Flex fullWidth flexDirection="column">
                                        <Flex
                                            fullWidth
                                            flexDirection="row"
                                            gap={2}
                                            className="color-border border-b p-2"
                                        >
                                            <Flex fullWidth>
                                                <Typography variant="sm" bold>
                                                    {t('common:name')}
                                                </Typography>
                                            </Flex>
                                            <Flex fullWidth>
                                                <Typography variant="sm" color="secondary" bold>
                                                    {t('common:value')}
                                                </Typography>
                                            </Flex>
                                        </Flex>
                                        {item.attributes.map((attr, index) => {
                                            return (
                                                <Flex
                                                    fullWidth
                                                    flexDirection="row"
                                                    gap={2}
                                                    className="color-border border-b p-2"
                                                    key={index}
                                                >
                                                    <Flex fullWidth>
                                                        <Typography variant="sm">{attr.name}</Typography>
                                                    </Flex>
                                                    <Flex fullWidth>
                                                        <Typography variant="sm" color="secondary">
                                                            {attr.value}
                                                        </Typography>
                                                    </Flex>
                                                </Flex>
                                            )
                                        })}
                                    </Flex>
                                )}
                            </Collapse>
                        </Flex>
                    )
                })}
            </Flex>
        </Modal>
    )
}
