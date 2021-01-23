//TODO 为啥lib打包完100K，example打包完只有50K，挠头
import Layout from "../src/Layout.vue"
import {refreshPage, closeCurrentPage} from "../src/helper.js"

export * from "../src/config/index.js"
export * from "../src/store/index.js"

export {Layout, refreshPage, closeCurrentPage}

if (window && window.Vue) {
    window.Vue.component(Layout.name, Layout)
}

import "../src/style/index.scss"
import "../src/style/maxViewHeight.scss"
