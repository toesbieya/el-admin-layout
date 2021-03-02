export interface MenuItemMeta {
    title: string
    alwaysShow?: boolean
    sort?: number
    icon?: string
    affix?: boolean
}

export interface MenuItem {
    fullPath: string
    meta: MenuItemMeta
    children?: MenuItem[]
}

export interface StoreMenuItem extends MenuItem {
    parent: StoreMenuItem
    children?: StoreMenuItem[]
}
