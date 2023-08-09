import clsx from 'clsx'
import { useRouter } from 'next/router'
import { Button, Flex, Typography } from '~/components'

export const LandingSection = ({
    title,
    children,
    buttonTitle,
    link,
}: {
    title: string
    children: React.ReactNode
    buttonTitle: string
    link: string
}) => {
    const router = useRouter()
    return (
        <Flex flexDirection="column" className="w-full" gap={8}>
            <Typography variant="h3" className={clsx('whitespace-pre-line')} align="center" color="gradient">
                {title}
            </Typography>
            {children}
            <Flex alignItems="center" justifyContent="center">
                <Button
                    variant="outlined-gradient"
                    title={buttonTitle}
                    onClick={() => {
                        router.push(link)
                    }}
                />
            </Flex>
        </Flex>
    )
}
