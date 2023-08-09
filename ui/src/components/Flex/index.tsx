import clsx from 'clsx'
import React from 'react'

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    justifyContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
    alignItems?: 'stretch' | 'start' | 'end' | 'center' | 'baseline'
    alignSelf?: 'start' | 'end' | 'center' | 'baseline'
    alignContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch'
    flexWrap?: 'wrap' | 'no-wrap'
    flexGrow?: number
    flexShrink?: number
    flexBasis?: number | string
    flex?: number | 'auto' | 'initial' | 'none'
    gap?: number | { x?: number; y?: number }
    fullWidth?: boolean
}

export const Flex = React.forwardRef(
    (
        {
            className,
            flexDirection = 'row',
            flex,
            justifyContent = 'start',
            alignItems,
            alignSelf,
            alignContent,
            flexWrap,
            flexGrow,
            flexShrink,
            flexBasis,
            children,
            gap,
            fullWidth,
            ...props
        }: FlexProps,
        ref: React.ForwardedRef<HTMLDivElement>,
    ) => {
        const flexDirectionClass = (flexDirection: string) => {
            switch (flexDirection) {
                case 'row':
                    return 'flex-row'
                case 'column':
                    return 'flex-col'
                case 'row-reverse':
                    return 'flex-row-reverse'
                case 'column-reverse':
                    return 'flex-col-reverse'
                default:
                    return 'flex-col'
            }
        }

        const gapClass = (gap: number | { x?: number; y?: number }) => {
            if (typeof gap === 'number') {
                return `gap-${gap}`
            } else {
                return `${gap.x && `gap-x-${gap.x}`}  ${gap.y && `gap-y-${gap.y}`}`
            }
        }

        // Map props to Twind classes
        const twindClasses = clsx(
            fullWidth && 'w-full',
            className,
            'flex',
            flexDirection && flexDirectionClass(flexDirection),
            justifyContent && `justify-${justifyContent}`,
            alignItems && `items-${alignItems}`,
            alignSelf && `self-${alignSelf}`,
            alignContent && `content-${alignContent}`,
            flexWrap && `flex-${flexWrap}`,
            flexGrow && `flex-grow-${flexGrow}`,
            flexShrink && `flex-shrink-${flexShrink}`,
            flexBasis && `basis-${flexBasis}`,
            flex && `flex-${flex}`,
            gap && gapClass(gap),
        )

        return (
            <div className={twindClasses} ref={ref} {...props}>
                {children}
            </div>
        )
    },
)

Flex.displayName = 'Flex'
