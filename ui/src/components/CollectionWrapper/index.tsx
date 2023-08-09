import clsx from 'clsx'
import { CSSProperties, HTMLAttributes, useEffect, createRef, useCallback, memo } from 'react'
import { useRefDimensions } from '~/hooks'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { getColumnNumberByBreakpoint } from '~/utils/theme'

import { Nft } from '~/gql/generated/graphql'
import { Flex } from '../Flex'
import lodash from 'lodash'

interface Props extends HTMLAttributes<HTMLDivElement> {
    total?: number | null
    nfts?: Nft[]
}

export interface Pagination {
    pageSize: number
    currentPage: number
    total: number
}
export const CollectionWrapper = memo(({ className, children, ...ref }: Props) => {
    const collectionRef = createRef<HTMLDivElement>()
    const { debounce } = lodash
    const { width } = useRefDimensions(collectionRef)
    const { breakpoint } = useBreakpoint()

    const standardWidth = 176
    const gapWidth = 16
    // Calculate the column width
    const delay = useCallback(
        debounce(() => {
            // calculate the new column width by collection width and gap width
            const collection = collectionRef.current
            if (!collection) return
            const maxWidth = standardWidth * 6 + gapWidth * 5
            if (collection.scrollWidth >= maxWidth) {
                // calculate the number of columns
                const numberOfColumns = Math.floor((collection.scrollWidth - gapWidth) / (standardWidth + gapWidth))
                const totalGapWidth = gapWidth * (numberOfColumns - 1)
                // set the new column width
                const newWidth = `calc((100% - ${totalGapWidth}px)  / ${numberOfColumns})`
                // set the new column width
                collection.style.setProperty('--column-width', `${newWidth}`)
            } else {
                // claculate the column width by gap width and breakpoint
                const numberOfColumns = getColumnNumberByBreakpoint(breakpoint)
                const totalGapWidth = gapWidth * (numberOfColumns - 1)
                const newWidth = `calc((100% - ${totalGapWidth}px)  / ${numberOfColumns})`
                // set the new column width
                collection.style.setProperty('--column-width', `${newWidth}`)
            }
        }, 100),
        [width, collectionRef],
    )
    useEffect(() => {
        delay()
    }, [width, collectionRef])
    return (
        <Flex
            ref={collectionRef}
            flexWrap="wrap"
            justifyContent="start"
            alignContent="center"
            style={
                {
                    '--column-width': '176px',
                } as CSSProperties
            }
            className={clsx('collection', 'w-full', 'gap-4', 'gap-y-4', 'mx-auto', className)}
            {...ref}
        >
            {children}
        </Flex>
    )
})

CollectionWrapper.displayName = 'CollectionWrapper'
