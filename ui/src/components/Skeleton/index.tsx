import clsx from 'clsx'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    height?: string
    width?: string
    color?: 'primary' | 'secondary'
}

export const Skeleton = ({ height, width, className, color = 'primary', ...props }: Props) => {
    const style = {
        '--skeleton-height': height,
        '--skeleton-width': width,
    } as React.CSSProperties
    const heightClass = height && 'h-[var(--skeleton-height)]'
    const widthClass = width && 'w-[var(--skeleton-width)]'
    return (
        <div
            style={style}
            className={clsx(
                'skeleton',
                'inline-block',
                'animate-pulse',
                color === 'primary' ? 'bg-light-card-background-hover' : 'bg-content-background',
                color === 'primary' ? 'dark:bg-dark-card-background-hover' : 'dark:bg-dark-card-background',
                'rounded',
                heightClass,
                widthClass,
                className,
            )}
            {...props}
        ></div>
    )
}
