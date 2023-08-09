import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Toggle } from '.'

export default {
    title: 'Toggle',
    component: Toggle,
} as ComponentMeta<typeof Toggle>

const Template: ComponentStory<typeof Toggle> = (args) => <Toggle {...args} />

export const Default = Template.bind({})
export const BgColor = Template.bind({})

Default.args = {
    checkedCallback: (b) => console.log('Toggle Callback', b),
}

BgColor.args = {
    checkedCallback: (b) => console.log('Toggle Callback', b),
    onBgColor: '#E0FEFF',
    offBgColor: '#E0FEFF',
}
