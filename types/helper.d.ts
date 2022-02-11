import VueRouter, { Route, RawLocation } from 'vue-router'

export function refreshPage(router: VueRouter, route?: Route, replace?: boolean): Promise<Route>

export function closeCurrentPage(router: VueRouter): void
export function closeCurrentPage(router: VueRouter, next: RawLocation): Promise<Route>
