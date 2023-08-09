import { Typography, TypographyProps } from '../Typography'

export const HighLightText = ({
    text,
    highlight,
    ...props
}: {
    text: string
    highlight: string
} & TypographyProps) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return (
        <Typography {...props}>
            {parts.map((part, i) => (
                <Typography
                    color={part.toLowerCase() === highlight.toLowerCase() ? 'primary' : 'default'}
                    bold={part.toLowerCase() === highlight.toLowerCase()}
                    key={i}
                >
                    {part}
                </Typography>
            ))}
        </Typography>
    )
}
