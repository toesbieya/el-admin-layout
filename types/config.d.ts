import Vue, {ComponentOptions, AsyncComponent} from 'vue'
import {RouteConfig} from "vue-router"

type Component = ComponentOptions<Vue> | typeof Vue | AsyncComponent

interface Const {
    maxMobileWidth: number
    redirectPath: string
}

interface InjectDefaultRoute {
    (layout: Component): RouteConfig[]
}

export const Const: Const
export const injectDefaultRoute: InjectDefaultRoute
