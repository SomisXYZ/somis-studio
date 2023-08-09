import clsx from 'clsx'
import { HTMLAttributes, forwardRef } from 'react'
import { Skeleton } from '../Skeleton'
import { JetBrainsMono, PPMonumentExtended, SpaceGrotesk } from './fonts'
import { TextColor, TypographyTextStyle, TypographyVariant } from './types'

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
    variant?: TypographyVariant
    /**
     * @deprecated Use variant instead and use component to change the tag
     */
    textStyle?: TypographyTextStyle
    color?: TextColor
    hover?: boolean
    transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'normal-case'
    bold?: boolean
    semiBold?: boolean
    extraBold?: boolean
    regular?: boolean
    font?: 'jbm' | 'sg' | 'ppm'
    align?: 'left' | 'center' | 'right'
    skeleton?: boolean
    skeletonLength?: number
    skeletonColor?: 'primary' | 'secondary'
    component?: 'p' | 'span' | 'label' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    htmlFor?: string
    ref?: any
}

export const Typography = forwardRef(
    (
        props: TypographyProps,
        ref: React.ForwardedRef<HTMLSpanElement | HTMLParagraphElement | HTMLHeadingElement | HTMLDivElement>,
    ) => {
        const {
            font,
            className,
            variant = 'md',
            transform,
            color = 'default',
            hover,
            children,
            regular,
            bold,
            semiBold,
            extraBold,
            align = 'left',
            skeleton = false,
            skeletonLength = 40,
            textStyle: defaultTextStyle,
            component,
            skeletonColor,
            ...otherProps
        } = props
        const fontMap = {
            jbm: JetBrainsMono.className,
            sg: SpaceGrotesk.className,
            ppm: PPMonumentExtended.className,
        }

        const alignClass = {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
        }

        const colorClass = {
            gradient: 'color-text-gradient',
            default: 'color-text-default',
            gray: 'color-text-gray',
            primary: 'color-text-primary',
            secondary: 'color-text-secondary',
            tertiary: 'color-text-tertiary',
            quaternary: 'color-text-quaternary',
            success: 'color-text-success',
            error: 'color-text-error',
            dark: 'color-text-dark',
            none: '',
        }

        const hoverColorClass = {
            gradient: 'color-text-gradient-hover',
            default: 'color-text-default-hover',
            gray: 'color-text-gray',
            primary: 'color-text-default-hover',
            secondary: 'color-text-secondary-hover',
            tertiary: 'color-text-default-hover',
            quaternary: 'color-text-quaternary',
            success: 'color-text-success',
            error: 'color-text-error',
            dark: 'color-text-dark',
            none: '',
        }

        const getTextStyle = (variant: TypographyVariant): TypographyTextStyle => {
            switch (variant) {
                case 'h1':
                    return 'text-heading-1'
                case 'h2':
                    return 'text-heading-2'
                case 'h3':
                    return 'text-heading-3'
                case 'h4':
                    return 'text-heading-4'
                case 'h5':
                    return 'text-heading-5'
                case 'b1':
                    return 'text-body-1'
                case 'b2':
                    return 'text-body-2'
                case 'b3':
                    return 'text-body-3'
                case 'b4':
                    return 'text-body-4'
                case 'b5':
                    return 'text-body-5'
                case 'sm':
                    return 'text-body-sm'
                case 'md':
                    return 'text-body-md'
                case 'lg':
                    return 'text-body-lg'
                case 'xl':
                    return 'text-body-xl'
                case 'title':
                    return 'text-body-title'
                case 'button':
                    return 'text-button'
                case 'logo':
                    return 'text-logo'
                default:
                    return 'text-body-md'
            }
        }

        const getSkeletonClass = (textStyle: TypographyTextStyle) => {
            switch (textStyle) {
                case 'text-heading-1':
                    return 'skeleton-heading-1'
                case 'text-heading-2':
                    return 'skeleton-heading-2'
                case 'text-heading-3':
                    return 'skeleton-heading-3'
                case 'text-heading-4':
                    return 'skeleton-heading-4'
                case 'text-heading-5':
                    return 'skeleton-heading-5'
                case 'text-body-1':
                    return 'skeleton-body-1'
                case 'text-body-2':
                    return 'skeleton-body-2'
                case 'text-body-3':
                    return 'skeleton-body-3'
                case 'text-body-4':
                    return 'skeleton-body-4'
                case 'text-body-5':
                    return 'skeleton-body-5'
                case 'text-body-xl':
                    return 'skeleton-body-xl'
                case 'text-body-sm':
                    return 'skeleton-body-sm'
                case 'text-body-md':
                    return 'skeleton-body-md'
                case 'text-button':
                    return 'skeleton-button'
                case 'text-logo':
                    return 'skeleton-logo'
                default:
                    return 'skeleton-body-md'
            }
        }

        const textStyle = defaultTextStyle ?? getTextStyle(variant)
        const skeletonClass = getSkeletonClass(textStyle)
        const getSkeletonWidth = () => {
            return skeletonLength + '%'
        }

        const classList = [
            className,
            transform,
            regular && 'font-normal',
            semiBold && 'font-semibold',
            bold && 'font-bold',
            extraBold && 'font-extrabold',
            color && colorClass[color],
            hover && hoverColorClass[color],
            alignClass[align],
        ]

        const content = (
            type: 'p' | 'span' | 'label' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
            defaultFont = fontMap.jbm,
        ) => {
            switch (type) {
                case 'h1':
                    return skeleton ? (
                        <Skeleton width={getSkeletonWidth()} className={skeletonClass} color={skeletonColor} />
                    ) : (
                        <h1
                            className={clsx(textStyle, classList, font ? fontMap[font] : defaultFont)}
                            ref={ref}
                            {...otherProps}
                        >
                            {children}
                        </h1>
                    )
                case 'h2':
                    return skeleton ? (
                        <Skeleton width={getSkeletonWidth()} className={skeletonClass} color={skeletonColor} />
                    ) : (
                        <h2
                            className={clsx(textStyle, classList, font ? fontMap[font] : defaultFont)}
                            ref={ref}
                            {...otherProps}
                        >
                            {children}
                        </h2>
                    )
                case 'h3':
                    return skeleton ? (
                        <Skeleton width={getSkeletonWidth()} className={skeletonClass} color={skeletonColor} />
                    ) : (
                        <h3
                            className={clsx(textStyle, classList, font ? fontMap[font] : defaultFont)}
                            ref={ref}
                            {...otherProps}
                        >
                            {children}
                        </h3>
                    )
                case 'h4':
                    return skeleton ? (
                        <Skeleton width={getSkeletonWidth()} className={skeletonClass} color={skeletonColor} />
                    ) : (
                        <h4
                            className={clsx(textStyle, classList, font ? fontMap[font] : defaultFont)}
                            ref={ref}
                            {...otherProps}
                        >
                            {children}
                        </h4>
                    )
                case 'h5':
                    return skeleton ? (
                        <Skeleton width={getSkeletonWidth()} className={skeletonClass} color={skeletonColor} />
                    ) : (
                        <h5
                            className={clsx(textStyle, classList, font ? fontMap[font] : defaultFont)}
                            ref={ref}
                            {...otherProps}
                        >
                            {children}
                        </h5>
                    )
                case 'p':
                    return skeleton ? (
                        <Skeleton width={getSkeletonWidth()} className={skeletonClass} color={skeletonColor} />
                    ) : (
                        <p
                            className={clsx(textStyle, classList, font ? fontMap[font] : defaultFont)}
                            ref={ref}
                            {...otherProps}
                        >
                            {children}
                        </p>
                    )
                case 'div':
                    return skeleton ? (
                        <Skeleton width={getSkeletonWidth()} className={skeletonClass} color={skeletonColor} />
                    ) : (
                        <div
                            className={clsx(textStyle, classList, font ? fontMap[font] : defaultFont)}
                            ref={ref}
                            {...otherProps}
                        >
                            {children}
                        </div>
                    )
                case 'label':
                    return skeleton ? (
                        <Skeleton width={getSkeletonWidth()} className={skeletonClass} color={skeletonColor} />
                    ) : (
                        <label
                            className={clsx(textStyle, classList, font ? fontMap[font] : defaultFont)}
                            ref={ref}
                            {...otherProps}
                        >
                            {children}
                        </label>
                    )
                case 'span':
                default:
                    return skeleton ? (
                        <Skeleton width={getSkeletonWidth()} className={skeletonClass} color={skeletonColor} />
                    ) : (
                        <span
                            className={clsx(textStyle, classList, font ? fontMap[font] : defaultFont)}
                            ref={ref}
                            {...otherProps}
                        >
                            {children}
                        </span>
                    )
            }
        }

        switch (variant) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
                return content(component ?? variant, fontMap.ppm)
            case 'logo':
                return content(component ?? 'span', fontMap.jbm)
            case 'b1':
            case 'b2':
            case 'b3':
            case 'b4':
            case 'b5':
            case 'title':
            case 'xl':
            case 'lg':
            case 'md':
            case 'sm':
            case 'button':
            default:
                return content(component ?? 'span', fontMap.jbm)
        }
    },
)

Typography.displayName = 'Typography'
