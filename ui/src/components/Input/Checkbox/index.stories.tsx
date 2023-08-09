import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Checkbox } from '.'

export default {
    title: 'Checkbox',
    component: Checkbox,
} as ComponentMeta<typeof Checkbox>

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args}>{'Children'}</Checkbox>

export const Default = Template.bind({})

Default.args = {}
