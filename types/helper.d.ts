import VueRouter, {Route, RawLocation} from "vue-router";

interface RefreshPage {
    (router: VueRouter, route?: Route, replace?: boolean): Promise<Route>
}

interface CloseCurrentPage {
    (router: VueRouter): void

    (router: VueRouter, next: RawLocation): Promise<Route>
}

export const refreshPage: RefreshPage
export const closeCurrentPage: CloseCurrentPage
