/**
 * 一些可修改的常量
 */

import cssVar from '../style/var.scss'

export default {
    //移动端的最大宽度，默认为scss中的$max-mobile-width变量，该值的变动并不能影响样式
    maxMobileWidth: parseFloat(cssVar.maxMobileWidth),

    //redirect的路径名
    redirectPath: '/redirect'
}
