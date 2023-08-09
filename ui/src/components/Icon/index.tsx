import website from '@assets/icons/website.svg'
import discord from '@assets/icons/discord.svg'
import twitter from '@assets/icons/twitter.svg'
import wallet from '@assets/icons/wallet.svg'
import search from '@assets/icons/search.svg'
import menu from '@assets/icons/menu.svg'
import explore from '@assets/icons/explore.svg'
import launchpad from '@assets/icons/launchpad.svg'
import collections from '@assets/icons/collections.svg'
import rewards from '@assets/icons/rewards.svg'
import arrowRight from '@assets/icons/arrow-right.svg'
import sui from '@assets/icons/sui.svg'
import somis from '@assets/icons/somis.svg'
import list from '@assets/icons/list.svg'
import transfer from '@assets/icons/transfer.svg'
import cart from '@assets/icons/cart.svg'
import circlePlus from '@assets/icons/circle-plus.svg'
import offer from '@assets/icons/offer.svg'
import circleCross from '@assets/icons/circle-cross.svg'
import star from '@assets/icons/star.svg'
import externalLink from '@assets/icons/external-link.svg'
import arrow from '@assets/icons/arrow.svg'
import filter from '@assets/icons/filter.svg'
import sort from '@assets/icons/sort.svg'
import cross from '@assets/icons/cross.svg'
import camera from '@assets/icons/camera.svg'
import edit from '@assets/icons/edit.svg'
import check from '@assets/icons/check.svg'
import smallCross from '@assets/icons/small-cross.svg'
import somisBg from '@assets/icons/somis-bg.svg'
import somisBgDark from '@assets/icons/somis-bg-dark.svg'
import copy from '@assets/icons/copy.svg'
import minus from '@assets/icons/minus.svg'
import plus from '@assets/icons/plus.svg'
import powerOff from '@assets/icons/power-off.svg'
import userProfile from '@assets/icons/user-profile.svg'
import clock from '@assets/icons/clock.svg'
import activity from '@assets/icons/activity.svg'
import graph from '@assets/icons/graph.svg'
import listing from '@assets/icons/listing.svg'
import sweep from '@assets/icons/sweep.svg'
import nightmode from '@assets/icons/nightmode.svg'
import warning from '@assets/icons/warning.svg'
import ranking from '@assets/icons/ranking.svg'
import crew3 from '@assets/icons/crew3.svg'
import alert from '@assets/icons/alert.svg'
import instagram from '@assets/icons/instagram.svg'
import download from '@assets/icons/download.svg'
import bid from '@assets/icons/bid.svg'
import info from '@assets/icons/info.svg'
import merge from '@assets/icons/merge.svg'
import sitemap from '@assets/icons/sitemap.svg'
import grid from '@assets/icons/grid.svg'
import magic from '@assets/icons/magic.svg'

import { ReactSVG } from 'react-svg'
import { twMerge } from 'tailwind-merge'
import { loadSVG } from '~/utils/helpers'
import { useTheme } from 'next-themes'

export enum IconType {
    externalLink = 'externalLink',
    website = 'website',
    discord = 'discord',
    twitter = 'twitter',
    wallet = 'wallet',
    search = 'search',
    explore = 'explore',
    launchpad = 'launchpad',
    collections = 'collections',
    rewards = 'rewards',
    arrowRight = 'arrowRight',
    arrow = 'arrow',
    sui = 'sui',
    somis = 'somis',
    menu = 'menu',
    list = 'list',
    transfer = 'transfer',
    cart = 'cart',
    circlePlus = 'circlePlus',
    offer = 'offer',
    circleCross = 'circleCross',
    star = 'star',
    filter = 'filter',
    sort = 'sort',
    cross = 'cross',
    check = 'check',
    camera = 'camera',
    edit = 'edit',
    smallCross = 'smallCross',
    somisBg = 'somisBg',
    copy = 'copy',
    minus = 'minus',
    plus = 'plus',
    powerOff = 'powerOff',
    userProfile = 'userProfile',
    clock = 'clock',
    activity = 'activity',
    graph = 'graph',
    listing = 'listing',
    sweep = 'sweep',
    nightmode = 'nightmode',
    warning = 'warning',
    ranking = 'ranking',
    crew3 = 'crew3',
    alert = 'alert',
    instagram = 'instagram',
    download = 'download',
    bid = 'bid',
    info = 'info',
    merge = 'merge',
    sitemap = 'sitemap',
    grid = 'grid',
    magic = 'magic',
}

interface Props {
    icon: IconType
    showHoverColor?: boolean
    height?: number
    width?: number
    className?: string | string[]
    colorClass?: string | string[]
    beforeInjection?: (svg: SVGElement) => void
}

export const Icon = ({ icon, className, colorClass, width, height, showHoverColor, beforeInjection }: Props) => {
    const { theme } = useTheme()
    const iconMap = {
        externalLink: externalLink,
        website: website,
        discord: discord,
        twitter: twitter,
        wallet: wallet,
        search: search,
        explore: explore,
        launchpad: launchpad,
        collections: collections,
        rewards: rewards,
        arrow: arrow,
        arrowRight: arrowRight,
        menu: menu,
        sui: sui,
        somis: somis,
        list: list,
        transfer: transfer,
        cart: cart,
        circlePlus: circlePlus,
        offer: offer,
        circleCross: circleCross,
        star: star,
        filter: filter,
        sort: sort,
        cross: cross,
        camera: camera,
        edit: edit,
        check: check,
        smallCross: smallCross,
        copy: copy,
        minus: minus,
        plus: plus,
        powerOff: powerOff,
        userProfile: userProfile,
        somisBg: theme === 'dark' ? somisBgDark : somisBg,
        clock: clock,
        activity: activity,
        graph: graph,
        listing: listing,
        sweep: sweep,
        nightmode: nightmode,
        warning: warning,
        ranking: ranking,
        crew3: crew3,
        alert: alert,
        instagram: instagram,
        download: download,
        bid: bid,
        info: info,
        merge: merge,
        sitemap: sitemap,
        grid: grid,
        magic: magic,
    }

    const iconColorClassMapping = (): string[] => {
        switch (icon) {
            case 'website':
            case 'ranking':
            case 'instagram':
                return ['stroke-light', 'dark:stroke-dark']
            case 'explore':
                return ['fill-light', 'dark:fill-dark', 'stroke-light', 'dark:stroke-dark']
            case 'somisBg':
                return []
            default:
                return ['fill-light', 'dark:fill-dark']
        }
    }

    const iconHoverColorClassMapping = (): string[] => {
        switch (icon) {
            case 'website':
                return [
                    'hover:stroke-light-hover',
                    'dark:hover:stroke-dark-hover',
                    'group-hover:stroke-light-hover',
                    'dark:group-hover:stroke-dark-hover',
                ]
            case 'explore':
                return [
                    'hover:fill-light-hover',
                    'dark:hover:fill-dark-hover',
                    'hover:stroke-light-hover',
                    'dark:hover:stroke-dark-hover',
                    'group-hover:fill-light-hover',
                    'dark:group-hover:fill-dark-hover',
                    'group-hover:stroke-light-hover',
                    'dark:group-hover:stroke-dark-hover',
                ]
            default:
                return [
                    'hover:fill-light-hover',
                    'dark:hover:fill-dark-hover',
                    'group-hover:fill-light-hover',
                    'dark:group-hover:fill-dark-hover',
                ]
        }
    }
    return (
        <ReactSVG
            beforeInjection={(svg) => {
                if (width) {
                    svg.setAttribute('width', width.toString())
                }
                if (height) {
                    svg.setAttribute('height', height.toString())
                }
                beforeInjection && beforeInjection(svg)
            }}
            src={loadSVG(iconMap[icon])}
            className={twMerge(
                colorClass ? colorClass : iconColorClassMapping(),
                showHoverColor && iconHoverColorClassMapping(),
                className,
            )}
        />
    )
}
