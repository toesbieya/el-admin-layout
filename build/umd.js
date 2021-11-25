/**
 * 用于打包umd的构建入口，输出到dist/index.umd.min.js
 */

import Layout from '../src/component/Layout/index'
import Breadcrumb from '../src/component/Breadcrumb'
import CachedRouterView from '../src/component/CachedRouterView'
import ContextMenu from '../src/component/ContextMenu'
import useContextMenu from '../src/component/ContextMenu/functionalUse'
import NavMenu from '../src/component/NavMenu'

export {
  Layout,
  Breadcrumb,
  CachedRouterView,
  ContextMenu,
  useContextMenu,
  NavMenu
}

export * from '../src/config/index.js'
export * from '../src/store/index.js'

export { refreshPage, closeCurrentPage } from '../src/helper.js'

if (window && window.Vue) {
  window.Vue.component(Layout.name, Layout)
}
