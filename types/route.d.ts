import {Route} from 'vue-router'

export interface RouteMeta {
    [k: string]: any

    title?: string
    dynamicTitle?: (route: Route) => string
    pageHeader?: boolean
    pageFooter?: boolean
    noCache?: boolean
    activeMenu?: string
    iframe?: string
    usePathKey?: boolean
    useFullPathKey?: boolean
}
