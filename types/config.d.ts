import Vue, { ComponentOptions, AsyncComponent } from 'vue'
import { RouteConfig } from 'vue-router'

type Component = ComponentOptions<Vue> | typeof Vue | AsyncComponent

export declare const Const: {
  maxMobileWidth: number
  redirectPath: string
  enableLayoutSlot: boolean
  enableCachedPageHMR: boolean
}

export function injectDefaultRoute(layout: Component): RouteConfig[]
