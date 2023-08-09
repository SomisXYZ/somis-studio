import clsx from 'clsx'
import { DateTime } from 'luxon'
import { Card, Flex, Icon, IconType, Typography } from '~/components'

interface StepCardProps {
    icon: IconType
    title: string
    tag: string
    variant: 'primary' | 'secondary'
    date?: string
    children?: React.ReactNode
}

export const StepCard = ({ title, variant, tag, icon, date, children }: StepCardProps) => {
    const formatDate = date ? DateTime.fromISO(date).toFormat('dd LLL yyyy') : '-- -- ----'
    const color = variant === 'primary' ? 'text-dark-primary' : 'text-dark-tertiary'
    const backgroundColor = variant === 'primary' ? 'rgba(255, 48, 209, 0.20)' : 'rgba(255, 214, 0, 0.20)'
    return (
        <Flex flexDirection="row" gap={12}>
            <Flex className={clsx('p-4')} flexDirection="column" gap={4}>
                <Flex flexDirection="row" gap={4} alignItems="center">
                    <Icon icon={icon} colorClass="fill-light-gray dark:fill-dark-gray" width={16} height={16} />
                    <Typography variant="sm" bold font="jbm">
                        {formatDate}
                    </Typography>
                </Flex>
                <div>
                    <Typography
                        variant="sm"
                        className={clsx('px-3', 'py-2', 'text-center', 'rounded-md', color)}
                        style={{
                            background: backgroundColor,
                        }}
                    >
                        {tag}
                    </Typography>
                </div>
            </Flex>
            <Card border flex={1} gap={4} flexDirection="column">
                <Typography variant="h4" bold font="jbm">
                    {title}
                </Typography>
                {children}
            </Card>
        </Flex>
    )
}
