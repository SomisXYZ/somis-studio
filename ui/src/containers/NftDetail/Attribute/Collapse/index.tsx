import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { ItemCollapse } from '~/containers/ItemCollapse'
import { useNftDetailPageContext } from '../../context'
import { AttributeCard } from '../Card'

export const AttributeCollapse = () => {
    const { t } = useTranslation('common')
    const { nft } = useNftDetailPageContext()
    if (!nft?.attributes || nft?.attributes?.length === 0) return <></>

    return (
        <ItemCollapse
            header={t('nft.attributes.title')}
            defaultOpen={!!(nft?.attributes && nft?.attributes?.length > 0)}
        >
            <div
                className={clsx(
                    'w-full',
                    'grid',
                    'lg:grid-cols-2',
                    'sm:grid-cols-3',
                    'md:grid-cols-4',
                    'grid-cols-2',
                    'gap-4',
                    'grid',
                    'auto-rows-fr',
                    'p-4',
                )}
            >
                {nft?.attributes?.map((attr, key) => (
                    <AttributeCard attribute={attr} key={key} />
                ))}
            </div>
        </ItemCollapse>
    )
}
