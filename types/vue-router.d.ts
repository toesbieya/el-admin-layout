import {RouteMeta} from "./route";

declare module 'vue-router/types/router' {
    interface RouteConfigSingleView {
        meta: RouteMeta
    }
}
