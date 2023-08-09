import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Coin } from '../Coin'

export default {
    title: 'Coin',
    component: Coin,
} as ComponentMeta<typeof Coin>

const Template: ComponentStory<typeof Coin> = (args) => <Coin {...args} />

export const Default = Template.bind({})
export const TwoDecimal = Template.bind({})

Default.args = {
    number: 1000000,
}

TwoDecimal.args = {
    number: 10.238455,
    decimal: 2,
}
