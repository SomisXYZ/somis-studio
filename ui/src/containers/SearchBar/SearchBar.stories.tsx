import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SearchBar } from '.'

export default {
    title: 'SearchBar',
    component: SearchBar,
} as ComponentMeta<typeof SearchBar>

const Template: ComponentStory<typeof SearchBar> = () => <SearchBar />

export const Default = Template.bind({})
