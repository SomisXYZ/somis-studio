import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Icon, IconType } from '../Icon'

export default {
    title: 'Icon',
    component: Icon,
} as ComponentMeta<typeof Icon>

const Template: ComponentStory<typeof Icon> = (args) => <Icon {...args} />

export const Default = Template.bind({})

Default.args = {
    icon: IconType.sui,
}
