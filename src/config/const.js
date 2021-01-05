/**
 * 一些可修改的常量
 */

import cssVar from '../style/var.scss'

//移动端的最大宽度，默认为scss中的$max-mobile-width变量，该值的变动并不能影响样式
let MAX_MOBILE_WIDTH = parseFloat(cssVar.maxMobileWidth)

//layout中渲染icon的方法
let ICON_RENDERER = (h, icon) => h('i', {class: `icon ${icon}`})

//redirect的路径名
let REDIRECT_PATH = '/redirect'

//获取每个路由对应的唯一key的方法
let ROUTER_KEY_GENERATOR = route => {
    const {name, path, fullPath, meta: {usePathKey, useFullPathKey} = {}} = route
    return usePathKey ? path : useFullPathKey ? fullPath : name
}

//获取路由标题的方法
let ROUTER_TITLE_GENERATOR = (route, currentRoute = route) => {
    const {title, dynamicTitle} = route.meta || {}

    return typeof dynamicTitle === 'function'
        ? dynamicTitle(currentRoute) || title
        : title
}

export default {
    get maxMobileWidth() {
        return MAX_MOBILE_WIDTH
    },
    set maxMobileWidth(val) {
        MAX_MOBILE_WIDTH = val
    },

    get iconRenderer() {
        return ICON_RENDERER
    },
    set iconRenderer(val) {
        ICON_RENDERER = val
    },

    get redirectPath() {
        return REDIRECT_PATH
    },
    set redirectPath(val) {
        REDIRECT_PATH = val
    },

    get routerKeyGenerator() {
        return ROUTER_KEY_GENERATOR
    },
    set routerKeyGenerator(val) {
        ROUTER_KEY_GENERATOR = val
    },

    get routerTitleGenerator() {
        return ROUTER_TITLE_GENERATOR
    },
    set routerTitleGenerator(val) {
        ROUTER_TITLE_GENERATOR = val
    }
}
