/**
 * 一些可修改的常量
 */

//移动端的最大宽度，修改时需要同时修改scss中的$max-mobile-width变量
let MAX_MOBILE_WIDTH = 500

//layout中渲染icon的方法
let ICON_RENDERER = (h, icon) => h('i', {class: `icon ${icon}`})

//redirect的路径名
let REDIRECT_PATH = '/redirect'

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
    }
}
