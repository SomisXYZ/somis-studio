import clsx from 'clsx'
import Link from 'next/link'
import { Flex } from '../Flex'
import { Typography } from '../Typography'
// import styles from './timeline.module.scss'

// const Point = ({ current = false }: { current?: boolean }) => (
//     <div
//         className={clsx(
//             'timeline-point',
//             'absolute',
//             'h-3',
//             'w-3',
//             'rounded-full',
//             'border-none',
//             'transition-colors',
//             'duration-300',
//             current ? ['bg-light-primary', 'dark:bg-dark-primary'] : ['bg-light-border', 'dark:bg-dark-border'],
//         )}
//     />
// )

export interface TimelineProps {
    lists: {
        title: string
        id: string
    }[]
    current?: number
    onClick?: (index: number) => void
}

export const Timeline = ({ lists, current = 0, onClick }: TimelineProps) => {
    return (
        <ol
            className={clsx(
                'relative',
                'flex',
                'flex-col',
                'gap-4',
                'w-full',
                'py-8',
                'px-10',
                'border',
                'rounded-md',
                'color-border',
            )}
        >
            {lists.map((list, index) => {
                const selected = current === index
                return (
                    // styles['timeline-item'], selected && styles['current'],
                    <li className={clsx('w-full')} key={index}>
                        <Flex gap={4} alignItems="center" fullWidth>
                            {/* <Point current={selected} /> */}
                            <Link
                                scroll={false}
                                href={`#${list.id}`}
                                className={clsx(
                                    // 'ml-6',
                                    // 'p-1',
                                    // selected && 'bg-light-card-background-hover',
                                    // selected && 'dark:bg-dark-card-background',
                                    'rounded-md',
                                    'transition-colors',
                                    'duration-300',
                                    'bg-opacity-75',
                                    'w-full',
                                )}
                                onClick={() => {
                                    onClick?.(index)
                                }}
                            >
                                <Typography
                                    variant="lg"
                                    bold={selected}
                                    regular={!selected}
                                    font="sg"
                                    color={selected ? 'primary' : 'default'}
                                >
                                    {list.title}
                                </Typography>
                            </Link>
                        </Flex>
                    </li>
                )
            })}
        </ol>
    )
}
