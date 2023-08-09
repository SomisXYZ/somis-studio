import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Typography } from '.'

export default {
    title: 'Typography',
    component: Typography,
} as ComponentMeta<typeof Typography>

const Template: ComponentStory<typeof Typography> = (args) => <Typography {...args} />

export const Heading1 = Template.bind({})
export const Heading2 = Template.bind({})
export const Heading3 = Template.bind({})
export const Heading4 = Template.bind({})
export const Body1 = Template.bind({})
export const Body2 = Template.bind({})
export const Body3 = Template.bind({})
export const Body4 = Template.bind({})
export const Small = Template.bind({})
export const Medium = Template.bind({})
export const MediumSkeleton = Template.bind({})
export const Button = Template.bind({})

Heading1.args = {
    variant: 'h1',
    children: 'Heading 1',
}

Heading2.args = {
    variant: 'h2',
    children: 'Heading 2',
}

Heading3.args = {
    variant: 'h3',
    children: 'Heading 3',
}

Heading4.args = {
    variant: 'h4',
    children: 'Heading 4',
}

Body1.args = {
    variant: 'b1',
    children: 'Heading 1',
}

Body2.args = {
    variant: 'b2',
    children: 'Body 2',
}
Body3.args = {
    variant: 'b3',
    children: 'Body 2',
}
Body4.args = {
    variant: 'b4',
    children: 'Body 2',
}
Small.args = {
    variant: 'sm',
    children: 'Body 2',
}
Medium.args = {
    variant: 'md',
    children: 'Body 2',
}
MediumSkeleton.args = {
    variant: 'md',
    children: 'Body 2',
    skeleton: true,
}

Button.args = {
    variant: 'button',
    children: 'Button',
}
