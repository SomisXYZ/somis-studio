import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MockNft } from '~/mocks/fixtures/nft'
import { NFTCard } from '../NFTCard'
import { CollectionWrapper } from '.'
import I18nProvider from 'next-translate/I18nProvider'
import common from '../../../locales/en/common.json'
import config from '../../../i18n.json'
export default {
    title: 'Collection Wrapper',
    component: CollectionWrapper,
} as ComponentMeta<typeof CollectionWrapper>

const Template: ComponentStory<typeof CollectionWrapper> = (args) => (
    <I18nProvider lang="en" namespaces={{ common }} config={config}>
        <CollectionWrapper {...args}>
            {Array(10)
                .fill(MockNft)
                .map((nft, index) => (
                    <NFTCard key={index} nft={nft} />
                ))}
        </CollectionWrapper>
    </I18nProvider>
)

export const Default = Template.bind({})
