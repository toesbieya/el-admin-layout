/**
 * 用于打包umd的构建入口，输出到dist/index.umd.min.js
 */

import Layout from '../src/component/Layout/index'
import {refreshPage, closeCurrentPage} from '../src/helper.js'

export * from '../src/config/index.js'
export * from '../src/store/index.js'

export {Layout, refreshPage, closeCurrentPage}

if (window && window.Vue) {
    window.Vue.component(Layout.name, Layout)
}
