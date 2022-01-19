import { CreateElement, VNode } from 'vue'
import { Route, RawLocation } from 'vue-router'
import { MenuItem, MenuItemMeta, StoreMenuItem } from './menu'
import { RouteMeta } from './route'

type Mutation<T> = (val: T) => void

type BaseMutations<T> = { [K in keyof T]: Mutation<T[K]> }


export interface AppGetters {
  isMobile: boolean
  title: string
  logo: string
  logoRoute: RawLocation
  onLogoClick: (e: Event) => any
  logoSlot: (h: CreateElement, param: { img?: VNode, title?: VNode, props: object }) => VNode | VNode[]
  showLogo: boolean
  activeRootMenu: string
  menus: StoreMenuItem[]
  loadingMenu: boolean
  struct: 'top-bottom' | 'left-right'
  navMode: 'aside' | 'mix' | 'head'
}

export interface AppMutations extends Omit<BaseMutations<AppGetters>, 'menus'> {
  menus(menus: MenuItem[]): void

  modifyMenuMeta(fullPath: string, meta: MenuItemMeta): void
}


export interface AsideGetters {
  show: boolean
  theme: 'light' | 'dark' | string
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
  menuIconSlot: (h: CreateElement, { menu: MenuItem, depth: number }) => VNode
  menuContentSlot: (h: CreateElement, { menu: MenuItem, depth: number }) => VNode
}

export interface AsideMutations extends BaseMutations<AsideGetters> {
  open(): void

  close(): void

  switch(action?: 'open' | 'close'): void
}


export interface DropdownItem {
  icon?: string
  content: string
  handler: (e: Event) => any
}

export interface HeaderGetters {
  theme: 'light' | 'dark' | string
  showCollapseIcon: boolean
  avatar: string
  username: string
  dropdownItems: DropdownItem[]
  dropdownItemsSlot: (h: CreateElement) => VNode[]
  leftSlot: (h: CreateElement, [logo, hamburger]: VNode[]) => VNode | VNode[]
  centerSlot: (h: CreateElement, [headMenu]: VNode[]) => VNode | VNode[]
  rightSlot: (h: CreateElement, [refreshBtn, dropdown]: VNode[]) => VNode | VNode[]
  menuIconSlot: (h: CreateElement, { menu: MenuItem, depth: number }) => VNode
  menuContentSlot: (h: CreateElement, { menu: MenuItem, depth: number }) => VNode
}

export interface HeaderMutations extends BaseMutations<HeaderGetters> {
}


export interface PageGetters {
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

export interface PageMutations extends BaseMutations<PageGetters> {
  addIframe(src: string): void

  delIframe(src: string): void

  openIframe(src: string): void

  closeIframe(src: string, del?: boolean): void
}


export interface View extends Route {
  meta: RouteMeta
}

export interface VisitedView extends View {
  key: string
  fixed: boolean
}

export interface TagsViewItemSlotData {
  key: string,
  active: boolean,
  on?: { [k: string]: Function },
  title: string,
  close?: Function
}

export interface TagsViewGetters {
  enabled: boolean
  enableCache: boolean
  enableChangeTransition: boolean
  itemSlot: (h: CreateElement, param: TagsViewItemSlotData) => VNode
  visitedViews: VisitedView[]
  cachedViews: string[]
}

export interface TagsViewMutations extends BaseMutations<TagsViewGetters> {
  addTagOnly(val: View, fixed: boolean): void

  addCacheOnly(val: View): void

  addTagAndCache(val: View, fixed: boolean): void

  delTagOnly(val: View): void

  delCacheOnly(val: View): void

  delTagAndCache(val: View): void

  delOtherTagAndCache(val: View): void

  delAllCache(): void

  delAllTagAndCache(): void
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

export function getMenuByFullPath(fullPath: string): StoreMenuItem | undefined

export function mapGetters<T, K extends keyof T>(getters: T, propsNames: K[]): { [k in K]: () => T[K] }
