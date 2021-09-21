import {CreateElement, VNode} from 'vue'
import {Route, RawLocation} from 'vue-router'
import {MenuItem, MenuItemMeta, StoreMenuItem} from './menu'
import {RouteMeta} from './route'

type Mutation<T> = (val: T) => void


interface AppGetters {
    isMobile: boolean
    title: string
    logo: string
    logoRoute: RawLocation
    onLogoClick: (e: Event) => any
    logoSlot: (h: CreateElement, param?: { img: VNode, title: VNode, props: object }) => VNode | VNode[]
    showLogo: boolean
    activeRootMenu: string
    menus: StoreMenuItem[]
    loadingMenu: boolean
    struct: 'top-bottom' | 'left-right'
    navMode: 'aside' | 'mix' | 'head'
}

type BaseAppMutations = { [K in keyof AppGetters]: Mutation<AppGetters[K]> }

type AppMutations = Omit<BaseAppMutations, 'menus'> & {
    menus: Mutation<MenuItem[]>
    modifyMenuMeta: (fullPath: string, meta: MenuItemMeta) => void
}


interface AsideGetters {
    show: boolean
    theme: 'light' | 'dark'
    uniqueOpen: boolean
    collapse: boolean
    showParentOnCollapse: boolean
    showHamburger: boolean
    autoHide: boolean
    alwaysRender: boolean
    postMenus: (menus: StoreMenuItem[]) => MenuItem[]
    inlineIndent: number
    switchTransitionName: string
    defaultOpeneds: string[]
    defaultSlot: (h: CreateElement) => VNode
    headerSlot: (h: CreateElement, logo: VNode) => VNode | VNode[]
    footerSlot: (h: CreateElement, hamburger: VNode) => VNode | VNode[]
    menuIconSlot: (h: CreateElement, {menu: MenuItem, depth: number}) => VNode
    menuContentSlot: (h: CreateElement, {menu: MenuItem, depth: number}) => VNode
}

type BaseAsideMutations = { [K in keyof AsideGetters]: Mutation<AsideGetters[K]> }

type AsideMutations = BaseAsideMutations & {
    open(): void
    close(): void
    switch(action?: 'open' | 'close'): void
}


interface DropdownItem {
    icon?: string
    content: string
    handler: (e: Event) => any
}

interface HeaderGetters {
    theme: 'light' | 'dark'
    showCollapseIcon: boolean
    avatar: string
    username: string
    dropdownItems: DropdownItem[]
    dropdownItemsSlot: (h: CreateElement) => VNode[]
    leftSlot: (h: CreateElement, [logo, hamburger]: VNode[]) => VNode | VNode[]
    centerSlot: (h: CreateElement, [headMenu]: VNode[]) => VNode | VNode[]
    rightSlot: (h: CreateElement, [refreshBtn, dropdown]: VNode[]) => VNode | VNode[]
    menuIconSlot: (h: CreateElement, {menu: MenuItem, depth: number}) => VNode
    menuContentSlot: (h: CreateElement, {menu: MenuItem, depth: number}) => VNode
}

type HeaderMutations = { [K in keyof HeaderGetters]: Mutation<HeaderGetters[K]> }


interface PageGetters {
    enableTransition: boolean;
    transition: {
        default?: string
        next?: string
        prev?: string
        curr?: string
    }
    showIframe: boolean
    currentIframe: string
    iframeList: string[]
    showHeader: boolean
    showFooter: boolean
    headerSlot: (h: CreateElement) => VNode | VNode[]
    footerSlot: (h: CreateElement) => VNode | VNode[]
}

type BasePageMutations = { [K in keyof PageGetters]: Mutation<PageGetters[K]> }

type PageMutations = BasePageMutations & {
    addIframe: (src: string) => void
    delIframe: (src: string) => void
    openIframe: (src: string) => void
    closeIframe: (src: string, del?: boolean) => void
}


interface View extends Route {
    meta: RouteMeta
}

interface VisitedView extends View {
    key: string
}

interface TagsViewGetters {
    enabled: boolean
    enableCache: boolean
    enableChangeTransition: boolean
    itemSlot: (h: CreateElement, param?: { key: string, active: boolean, on?: { [k: string]: Function }, title: string, close?: Function }) => VNode
    visitedViews: VisitedView[]
    cachedViews: string[]
}

type BaseTagsViewMutations = { [K in keyof TagsViewGetters]: Mutation<TagsViewGetters[K]> }

type TagsViewMutations = BaseTagsViewMutations & {
    addTagOnly: Mutation<View>
    addCacheOnly: Mutation<View>
    addTagAndCache: Mutation<View>
    delTagOnly: Mutation<View>
    delCacheOnly: Mutation<View>
    delTagAndCache: Mutation<View>
    delOtherTagAndCache: Mutation<View>
    delAllCache: () => void
    delAllTagAndCache: () => void
}


export declare const appGetters: AppGetters
export declare const appMutations: AppMutations
export declare const asideGetters: AsideGetters
export declare const asideMutations: AsideMutations
export declare const headerGetters: HeaderGetters
export declare const headerMutations: HeaderMutations
export declare const pageGetters: PageGetters
export declare const pageMutations: PageMutations
export declare const tagsViewGetters: TagsViewGetters
export declare const tagsViewMutations: TagsViewMutations
