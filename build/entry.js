import Layout from "../src/component/Layout/index"
import {refreshPage, closeCurrentPage} from "../src/helper.js"

export * from "../src/config/index.js"
export * from "../src/store/index.js"

export {Layout, refreshPage, closeCurrentPage}

if (window && window.Vue) {
    window.Vue.component(Layout.name, Layout)
}

import "../src/style/index.scss"
import "../src/style/maxViewHeight.scss"
