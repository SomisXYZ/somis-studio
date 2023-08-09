import { useCallback, useRef, useState, useEffect } from 'react'
import lodash from 'lodash'
import { Flex, HighLightText, IconType, LinkIcon, Typography } from '~/components'
import useTranslation from 'next-translate/useTranslation'
import {
    CollectionSortingFields,
    SortingOrder,
    useListCollectionsQuery,
    useListLaunchpadsQuery,
} from '~/gql/generated/graphql'
import clsx from 'clsx'
import styles from './MobileSearchPage.module.scss'
import { useAtom } from 'jotai'
import { MobileSearchPageAtom } from './MobileMenu'
import { CSSTransition } from 'react-transition-group'
import { useOnScroll, useWindowSize } from '~/hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SearchItemType } from '../SearchBar'
import { JetBrainsMono } from '~/components/Typography/fonts'

export const MobileSearchPage = () => {
    const [showSearch, setShowSearch] = useAtom(MobileSearchPageAtom)
    const ref = useRef<HTMLInputElement>(null)
    const [keyword, setKeyword] = useState<string>('')
    const { debounce } = lodash
    const { t } = useTranslation('common')
    const { height } = useWindowSize()
    const [items, setItems] = useState<SearchItemType[]>([])
    const router = useRouter()
    const [top, setTop] = useState(0)
    const { scrollTop } = useOnScroll()

    const removeList = () => {
        setKeyword('')
        setItems([])
    }

    const { data } = useListCollectionsQuery(
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

    const { data: launchpadData } = useListLaunchpadsQuery(
        {
            limit: 10,
            keyword,
        },
        {
            enabled: !!keyword,
        },
    )

    const sortByMatchedName = (a: SearchItemType, b: SearchItemType) => {
        const aMatched = a.title.toLowerCase().match(new RegExp(`(${keyword.toLowerCase()})`, 'gi'))
        const bMatched = b.title.toLowerCase().match(new RegExp(`(${keyword.toLowerCase()})`, 'gi'))
        return (bMatched?.length ?? 0) - (aMatched?.length ?? 0)
    }

    const onChange = useCallback((event: { target: { value: string } }) => {
        if (!event.target.value || event.target.value === '') {
            removeList()
        } else {
            debounce(() => {
                setKeyword(event.target.value)
            }, 800)()
        }
    }, [])

    useEffect(() => {
        setShowSearch(false)
    }, [router])

    useEffect(() => {
        removeList()
        if (showSearch) {
            const timer = setTimeout(() => {
                ref.current?.focus()
            }, 500)

            return () => {
                clearTimeout(timer)
            }
        }
    }, [showSearch])
    useEffect(() => {
        if (!keyword) setItems([])
        else {
            const launchpads: SearchItemType[] =
                launchpadData?.launchpads.items.map(
                    (item) =>
                        ({
                            image: item.imageUrl ?? null,
                            title: item.name ?? '',
                            url: '/launchpad/' + item.id,
                            type: 'launchpad',
                        } as SearchItemType),
                ) ?? []
            const collections: SearchItemType[] =
                data?.collections.items.map(
                    (item) =>
                        ({
                            image: item.imageUrl ?? null,
                            title: item.name ?? '',
                            url: '/collection/' + item.address,
                            type: 'collection',
                        } as SearchItemType),
                ) ?? []
            setItems(launchpads.concat(collections).sort(sortByMatchedName))
        }
    }, [data, launchpadData])

    const SearchResult = () => {
        return (
            <Flex
                gap={2}
                flexDirection="column"
                className={clsx('bg-light-background', 'dark:bg-dark-background', 'mt-2', 'px-4', 'overflow-y-auto')}
            >
                {items.sort(sortByMatchedName).map((item, key) => {
                    return (
                        <Link
                            passHref
                            href={item.url}
                            key={key}
                            onClick={() => {
                                setShowSearch(false)
                                router.push(item.url)
                            }}
                            className={clsx('w-full', 'px-3', 'py-6', 'cursor-pointer', 'border-b', 'color-border')}
                        >
                            <Flex gap={4}>
                                <img src={item.image ?? ''} className={clsx('w-8')} alt={item.title} />
                                <Flex className="ml-4" gap={1} alignItems="center">
                                    <HighLightText variant="b3" text={item.title} highlight={keyword} />
                                    <Typography variant="sm" color="tertiary">
                                        ({item.type})
                                    </Typography>
                                </Flex>
                            </Flex>
                        </Link>
                    )
                })}
            </Flex>
        )
    }

    // REMARK: This is a hack to fix the position of the search bar in safari
    useEffect(() => {
        setTop(document.getElementById('navbar')?.getBoundingClientRect().y ?? 0)
    }, [scrollTop])

    return (
        <CSSTransition
            in={showSearch}
            timeout={300}
            classNames={{
                enterActive: styles['slide-enter-active'],
                enterDone: styles['slide-enter-done'],
                exitActive: styles['slide-exit-done'],
                exitDone: styles['slide-exit-done'],
            }}
            unmountOnExit
        >
            <Flex
                flexDirection="column"
                justifyContent="between"
                fullWidth
                style={{
                    height: keyword && height ? height + 16 : '4rem',
                    top,
                }}
                className={clsx(styles['mobile-search'], 'bg-light-background', 'dark:bg-dark-background', 'z-[999]')}
            >
                <Flex
                    justifyContent="start"
                    flexDirection="row"
                    gap={2}
                    className={clsx(
                        'bg-light-background',
                        'dark:bg-dark-background',
                        'border-b',
                        'color-border',
                        'pb-4',
                    )}
                >
                    <LinkIcon
                        icon={IconType.arrow}
                        className={clsx('rotate-[270deg]', 'text-body-md', 'p-2', 'cursor-pointer')}
                        onClick={() => {
                            setShowSearch(false)
                        }}
                    />
                    <input
                        ref={ref}
                        className={clsx(
                            JetBrainsMono.className,
                            'text-body-md',
                            'bg-light-background',
                            'dark:bg-dark-background',
                            'focus-visible:outline-none',
                            'w-10/12',
                        )}
                        placeholder={t('input.globalSearch.placeholder')}
                        defaultValue={keyword}
                        onChange={onChange}
                    />
                </Flex>
                {keyword && (
                    <>
                        {items.length > 0 ? SearchResult() : <EmptySearchResult />}
                        <div className={clsx('bg-light-background', 'dark:bg-dark-background', 'grow')}></div>
                    </>
                )}
            </Flex>
        </CSSTransition>
    )
}

const EmptySearchResult = () => {
    const { t } = useTranslation('common')
    return (
        <Flex
            alignItems="center"
            className={clsx('p-5', 'cursor-pointer', 'transition-colors', 'duration-100', 'justify-center')}
        >
            <div className="">{t('empty.noCollections')}</div>
        </Flex>
    )
}
