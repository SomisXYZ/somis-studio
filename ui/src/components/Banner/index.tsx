import clsx from 'clsx'
import { Typography } from '../Typography'

interface Props {
    text: string
}

export const Banner = ({ text }: Props) => {
    return (
        <div
            id="global-banner"
            className={clsx(
                'flex',
                'w-full',
                'min-h-[2rem]',
                'py-1',
                'px-2',
                'items-center',
                'justify-center',
                'flex-col',
                'z-0',
                'color-gradient-banner',
                'dark:color-gradient-banner',
            )}
        >
            <Typography
                variant="b3"
                className={clsx('items-center', 'justify-center', 'dark:text-black', 'text-white', 'text-center')}
            >
                {text}
            </Typography>
        </div>
    )
}
