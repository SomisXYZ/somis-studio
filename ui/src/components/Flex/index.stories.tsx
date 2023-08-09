import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Flex } from '../Flex'

export default {
    title: 'Flex',
    component: Flex,
} as ComponentMeta<typeof Flex>

const Template: ComponentStory<typeof Flex> = (args) => (
    <Flex {...args}>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="w-50 h-50 color-border rounded-[6px] border bg-[#F3F4F6] p-20 dark:bg-[#1C2030] ">
                {`Column-${i + 1}`}
            </div>
        ))}
    </Flex>
)

export const Default = Template.bind({})
Default.args = {
    flexDirection: 'row',
    justifyContent: 'start',
    gap: 4,
}

export const Column = Template.bind({})
Column.args = {
    flexDirection: 'column',
    justifyContent: 'start',
    gap: 4,
}
