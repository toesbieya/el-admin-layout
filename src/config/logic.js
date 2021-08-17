/**
 * 一些可能后续会修改的公用逻辑
 */

import Const from './const'

/**
 * 获取每个路由对应的唯一key
 * @param route {Route}
 * @returns {string}
 */
export function getRouterKey(route) {
    const {name, path, fullPath, meta: {usePathKey, useFullPathKey} = {}} = route
    return usePathKey
        ? path
        : useFullPathKey
            ? fullPath
            : name || fullPath
}

/**
 * 获取路由标题
 * @param route {Route}
 * @returns {string}
 */
export function getRouterTitle(route) {
    const {title, dynamicTitle} = route.meta || {}

    return typeof dynamicTitle === 'function'
        ? dynamicTitle(route) || title
        : title
}

/**
 * 获取路由对应的激活菜单index
 * @param route {Route}
 * @returns {string}
 */
export function getRouterActiveMenu(route) {
    const {path, meta: {activeMenu} = {}} = route

    return activeMenu || path
}

/**
 * 判断路由是否为redirect路由，是则返回true
 * @param route {Route}
 * @returns {boolean}
 */
export function isRedirectRouter(route) {
    const [first] = route.matched
    return first && first.path === Const.redirectPath
}
