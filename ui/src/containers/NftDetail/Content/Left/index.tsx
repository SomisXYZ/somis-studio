import clsx from 'clsx'
import { Flex, Image } from '~/components'
import { useBreakpoint } from '~/hooks'
import { AttributeCollapse } from '../../Attribute/Collapse'
import { useNftDetailPageContext } from '../../context'

export const NftContentLeft = () => {
    const { breakpoint } = useBreakpoint()

    const { nft, isLoading } = useNftDetailPageContext()

    const src = nft?.imageUrl ?? null
    return (
        <Flex
            gap={6}
            flexDirection="column"
            className={clsx('lg:max-w-[543px]', 'w-full', 'lg:basis-12/12', 'xl:basis-9/12')}
        >
            <>
                <Image
                    src={src}
                    skeleton={isLoading}
                    className={clsx('w-full', 'aspect-square', 'rounded-lg', 'hidden', 'lg:flex')}
                />
                {!['sm', 'md', 'lg'].includes(breakpoint) && <AttributeCollapse />}
            </>
        </Flex>
    )
}
