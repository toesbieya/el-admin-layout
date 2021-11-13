import VueRouter, { Route, RawLocation } from 'vue-router'

export declare const refreshPage: {
  (router: VueRouter, route?: Route, replace?: boolean): Promise<Route>
}
export declare const closeCurrentPage: {
  (router: VueRouter): void

  (router: VueRouter, next: RawLocation): Promise<Route>
}
