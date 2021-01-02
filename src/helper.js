/**
 * 为避免循环依赖拆分出来的工具类
 */

import {Const} from "./config"
import {appGetters, tagsViewMutations} from "./store"

/**
 * 根据body宽度判断是否为移动端，是则返回true
 *
 * @return {boolean}
 */
export function isMobile() {
    const rect = document.body.getBoundingClientRect()
    return rect.width <= Const.maxMobileWidth
}

/**
 * 路由刷新
 *
 * @param router              vue-router实例
 * @param route               需要刷新的路由对象，默认为当前路由
 * @param replace {boolean}   是否使用replace进行跳转
 * @return {Promise}          返回vue-router跳转的结果
 */
export function refreshPage(router, route = router.currentRoute, replace = true) {
    tagsViewMutations.delCacheOnly(route)
    const to = `${Const.redirectPath}${route.fullPath}`
    return router[replace ? 'replace' : 'push'](to)
}

/**
 * 关闭当前页，如果传入next则跳转到next页面
 *
 * @param router                vue-router实例
 * @param next {string|route}   跳转的目标页面，作为第一个参数传入vue-router.replace
 * @return {undefined|Promise}  仅在next有值时，返回vue-router.replace的结果
 */
export function closeCurrentPage(router, next) {
    tagsViewMutations.delTagAndCache(router.currentRoute)
    if (next) {
        return router.replace(next)
    }
}

//获取侧边栏的菜单，如果是双层侧边栏导航时，获取的是子菜单
export function getSidebarMenus() {
    const menus = appGetters.menus

    if (!Array.isArray(menus)) {
        return []
    }

    //移动端时，侧边栏只会按侧边栏导航模式渲染
    if (appGetters.isMobile) {
        return menus
    }

    switch (appGetters.navMode) {
        case 'aside':
            return menus
        case 'head':
            return []
        case 'aside-two-part':
        case 'mix':
            const root = menus.find(i => i.fullPath === appGetters.activeRootMenu)
            return root ? root.children || [] : []
        default:
            return []
    }
}
