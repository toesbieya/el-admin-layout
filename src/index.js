import Layout from './component/Layout'
import Breadcrumb from './component/Breadcrumb'
import CachedRouterView from './component/CachedRouterView'
import ContextMenu from './component/ContextMenu'
import useContextMenu from './component/ContextMenu/functionalUse'
import NavMenu from './component/NavMenu'

export default Layout
export {
  Layout,
  Breadcrumb,
  CachedRouterView,
  ContextMenu,
  useContextMenu,
  NavMenu
}

export * from './config'
export * from './store'

export { refreshPage, closeCurrentPage } from './helper'
