import clsx from 'clsx'
import { Collapse, Flex, Icon, IconType, Typography } from '~/components'

export const ItemCollapse = ({
    header,
    children,
    className,
    defaultOpen = true,
}: {
    header: string
    children: React.ReactNode
    className?: string | string[]
    defaultOpen?: boolean
}) => {
    return (
        <Collapse
            contentClassName={clsx(
                'border',
                'rounded-md',
                'color-border',
                'border-dark-card-border',
                'bg-background-quaternary',
                className,
            )}
            headerClassName={clsx(
                'p-6',
                'color-border',
                'rounded-bl-none',
                'rounded-br-none',
                'color-input-background',
                'bg-dark-card-background',
                'border-dark-card-border',
                'hover:bg-light-background-hover',
                'dark:hover:bg-dark-card-background-hover',
            )}
            header={
                <Flex justifyContent="center" alignItems="center" alignContent="center" gap={4}>
                    <Icon icon={IconType.list} />
                    <Typography variant="md" font="jbm" bold transform="uppercase">
                        {header}
                    </Typography>
                </Flex>
            }
            className={clsx('w-full')}
            defaultOpen={defaultOpen}
        >
            <Flex flex="auto" className="">
                {children}
            </Flex>
        </Collapse>
    )
}
