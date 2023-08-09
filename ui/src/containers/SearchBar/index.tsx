import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import lodash from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Flex, HighLightText, Image, TextInput, Typography } from '~/components'
import {
    CollectionSortingFields,
    SortingOrder,
    useListCollectionsQuery,
    useListLaunchpadsQuery,
} from '~/gql/generated/graphql'
import { getBrowserOS } from '~/utils/helpers'
import Link from 'next/link'

export interface SearchItemType {
    image: string | null
    title: string
    url: string
    type: 'launchpad' | 'collection'
}

export const SearchBar = () => {
    const ref = useRef<HTMLInputElement>(null)
    const [keyword, setKeyword] = useState<string>('')
    const [suffixText, setSuffixText] = useState<string>('')
    const [placeholder, setPlaceholder] = useState<string>('')
    const { debounce } = lodash
    const { t } = useTranslation('common')
    const keysPassed: {
        [key: string]: boolean
    } = {}

    const removeList = () => {
        setKeyword('')
        remove()
        launchpadsRemove()
    }
    const keydownFunction = useCallback((event: { key: string }) => {
        keysPassed[event.key] = true
        if (event.key === 'Escape') {
            ref.current?.blur()
            removeList()
        }
        if ((keysPassed['Meta'] && event.key === 'k') || (keysPassed['Control'] && event.key === 'k')) {
            ref.current?.focus()
        }
    }, [])

    const { data, refetch, remove, isLoading } = useListCollectionsQuery(
        {
            limit: 10,
            keyword,
            field: CollectionSortingFields.Name,
            order: SortingOrder.Asc,
        },
        {
            enabled: !!keyword,
        },
    )

    const {
        data: launchpadsData,
        remove: launchpadsRemove,
        isLoading: launchpadsIsLoading,
    } = useListLaunchpadsQuery(
        {
            limit: 10,
            keyword,
        },
        {
            enabled: !!keyword,
        },
    )

    const keyupFunction = useCallback((event: { key: string }) => {
        delete keysPassed[event.key]
    }, [])

    const onChange = useCallback((event: { target: { value: string } }) => {
        if (!event.target.value) {
            removeList()
        } else {
            debounce(() => {
                setKeyword(event.target.value)
                refetch()
            }, 800)()
        }
    }, [])

    const loading = isLoading || launchpadsIsLoading

    useEffect(() => {
        document.addEventListener('keydown', keydownFunction, false)
        document.addEventListener('keyup', keyupFunction, false)
        return () => {
            document.removeEventListener('keydown', keydownFunction, false)
            document.removeEventListener('keyup', keyupFunction, false)
        }
    }, [])

    const sortByMatchedName = (a: SearchItemType, b: SearchItemType) => {
        const aMatched = a.title.toLowerCase().match(new RegExp(`(${keyword.toLowerCase()})`, 'gi'))
        const bMatched = b.title.toLowerCase().match(new RegExp(`(${keyword.toLowerCase()})`, 'gi'))
        return (bMatched?.length ?? 0) - (aMatched?.length ?? 0)
    }

    const items = useMemo(() => {
        if (keyword.length === 0) return []
        const launchpads =
            launchpadsData?.launchpads.items.map(
                (item) =>
                    ({
                        image: item.imageUrl ?? null,
                        title: item.name ?? '',
                        url: '/launchpad/' + item.id,
                        type: 'launchpad',
                    } as SearchItemType),
            ) ?? []
        const collections =
            data?.collections.items.map(
                (item) =>
                    ({
                        image: item.imageUrl ?? null,
                        title: item.name ?? '',
                        url: '/collection/' + item.address,
                        type: 'collection',
                    } as SearchItemType),
            ) ?? []
        return [...launchpads, ...collections].sort(sortByMatchedName)
    }, [data, keyword, launchpadsData])

    useEffect(() => {
        setSuffixText(`${['ios', 'macos'].includes(getBrowserOS()) ? '⌘' : 'Ctrl'} + K`)
        setPlaceholder(t('input.globalSearch.placeholder') as string)
    }, [])
    const suffix = (
        <Typography variant="b3" className="select-none text-light-input-placeholder dark:text-dark-input-placeholder">
            {suffixText}
        </Typography>
    )
    return (
        <div className="relative">
            <TextInput
                onChange={onChange}
                ref={ref}
                placeholder={placeholder}
                suffix={suffix}
                onBlur={(event) => {
                    debounce(() => {
                        event.target.value = ''
                        removeList()
                    }, 200)()
                }}
                className={clsx('lg:bg-opacity-0', 'dark:lg:bg-opacity-0')}
            />
            {keyword.length > 0 &&
                (loading ? (
                    <div
                        className={clsx(
                            'absolute',
                            'top-[45px]',
                            'left-0',
                            'w-full',
                            'rounded',
                            'shadow-lg',
                            'scale-100',
                        )}
                    >
                        {[...Array(3)].map((_, key) => (
                            <Flex
                                key={key}
                                alignItems="center"
                                className={clsx(
                                    'p-4',
                                    'bg-light-card-background-hover dark:bg-dark-card-background',
                                    'cursor-pointer',
                                    'transition-colors',
                                    'duration-100',
                                    'hover:bg-light-background-hover',
                                    'dark:hover:bg-dark-card-background-hover',
                                )}
                            >
                                <Image src={''} alt="" className="h-12 w-12 rounded-md" skeleton={true} />
                                <div className="ml-4 w-8/12">
                                    <Typography variant="b3" skeleton={true} skeletonLength={100} />
                                </div>
                            </Flex>
                        ))}
                    </div>
                ) : (
                    <div
                        className={clsx(
                            'absolute top-12 left-0 w-full rounded-md shadow-lg',
                            'scale-100',
                            'bg-light-content-background',
                            'dark:bg-dark-content-background',
                        )}
                    >
                        {items.length > 0 ? (
                            items
                                .sort(sortByMatchedName)
                                .map((item, key) => <SearchItem key={key} keyword={keyword} item={item} />)
                        ) : (
                            <Flex
                                alignItems="center"
                                className={clsx(
                                    'p-5',
                                    'bg-light-content-background dark:bg-dark-card-background',
                                    'cursor-pointer',
                                    'transition-colors',
                                    'duration-100',
                                    'hover:bg-light-background-hover',
                                    'dark:hover:bg-dark-card-background-hover',
                                    'justify-center',
                                )}
                            >
                                <div className="">{t('empty.noCollections')}</div>
                            </Flex>
                        )}
                    </div>
                ))}
        </div>
    )
}

const SearchItem = React.memo(({ item, keyword }: { item: SearchItemType; keyword: string }) => {
    return (
        <Link href={item.url}>
            <Flex
                alignItems="center"
                className={clsx(
                    'p-4',
                    'bg-light-card-background dark:bg-dark-card-background',
                    'cursor-pointer',
                    'transition-colors',
                    'duration-100',
                    'hover:bg-light-background-hover',
                    'dark:hover:bg-dark-card-background-hover',
                )}
            >
                <Image src={item.image} alt={item.title} className="h-12 w-12 rounded-md" />
                <Flex className="ml-4" gap={1} alignItems="center">
                    <HighLightText variant="b3" text={item.title} highlight={keyword} />
                    <Typography variant="sm" color="tertiary">
                        ({item.type})
                    </Typography>
                </Flex>
            </Flex>
        </Link>
    )
})

SearchItem.displayName = 'SearchItem'
