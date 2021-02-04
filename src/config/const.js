/**
 * 一些可修改的常量
 */

import cssVar from '../style/var.scss'

//移动端的最大宽度，默认为scss中的$max-mobile-width变量，该值的变动并不能影响样式
let MAX_MOBILE_WIDTH = parseFloat(cssVar.maxMobileWidth)

//redirect的路径名
let REDIRECT_PATH = '/redirect'

export default {
    get maxMobileWidth() {
        return MAX_MOBILE_WIDTH
    },
    set maxMobileWidth(val) {
        MAX_MOBILE_WIDTH = val
    },

    get redirectPath() {
        return REDIRECT_PATH
    },
    set redirectPath(val) {
        REDIRECT_PATH = val
    }
}
