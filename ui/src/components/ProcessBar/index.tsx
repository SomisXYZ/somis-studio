import clsx from 'clsx'

export const ProcessBar = ({ percent = 0, size = 'md' }: { percent: number; size?: 'sm' | 'md' | 'lg' }) => {
    return (
        <div
            className={clsx(
                size === 'sm' ? 'h-1' : size === 'md' ? 'h-2' : 'h-3',
                'w-full',
                'rounded-full',
                'bg-light-card-footer-background',
                'dark:bg-dark-card-footer-background',
                'group-hover:bg-light-background',
                'dark:group-hover:bg-dark-background',
            )}
        >
            <div
                className={clsx(
                    'h-full',
                    'rounded-full',
                    'text-center',
                    'text-white',
                    'transition-width',
                    'duration-200',
                    'ease-in-out',
                    'color-gradient',
                )}
                style={{ width: `${percent}%` }}
            ></div>
        </div>
    )
}
