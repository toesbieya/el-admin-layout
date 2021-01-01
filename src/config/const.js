/**
 * 一些常量设置，非响应式
 */

import cssVar from '../style/var.scss'

//移动端的最大宽度，默认为scss中的$max-mobile-width变量，该值的变动并不能影响样式
let MAX_MOBILE_WIDTH = cssVar.maxMobileWidth

//layout中渲染icon的方法
let ICON_RENDERER = (h, icon) => h('i', {class: `icon ${icon}`})

//redirect的路径名
let REDIRECT_PATH = '/redirect'

//获取每个路由对应的唯一key的方法
let ROUTER_KEY_GENERATOR = route => {
    const {name, path, fullPath, meta: {usePathKey, useFullPathKey} = {}} = route
    return usePathKey ? path : useFullPathKey ? fullPath : name
}

export function getMaxMobileWidth() {
    return MAX_MOBILE_WIDTH
}

export function setMaxMobileWidth(val) {
    MAX_MOBILE_WIDTH = val
}

export function getIconRenderer() {
    return ICON_RENDERER
}

export function setIconRenderer(val) {
    ICON_RENDERER = val
}

export function getRedirectPath() {
    return REDIRECT_PATH
}

export function setRedirectPath(val) {
    REDIRECT_PATH = val
}

export function getRouterKeyGenerator() {
    return ROUTER_KEY_GENERATOR
}

export function setRouterKeyGenerator(val) {
    ROUTER_KEY_GENERATOR = val
}
