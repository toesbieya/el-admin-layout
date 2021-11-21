import { getRouterTitle } from '../../config/logic'

/**
 * 判断页签是否固定
 *
 * @param view {View}
 * @return {boolean} 是固定页签则返回true，否则false
 */
export function isAffix(view) {
  return view ? view.meta.affix : false
}

/**
 * 从菜单树中获取所有需要固定显示的页签
 *
 * @param router {VueRouter}       - 路由实例
 * @param menus {StoreMenuItem[]}  - appStore中的菜单
 * @return {View[]}
 */
export function getAffixTagsFromMenuTree(router, menus) {
  return menus.reduce((affixTags, menu) => {
    const { fullPath, children, meta } = menu

    if (meta.affix === true) {
      const { route } = router.resolve(fullPath)

      affixTags.push({
        ...route,
        meta: {
          affix: true,
          ...route.meta,
          title: getRouterTitle(route)
        }
      })
    }

    if (children) {
      const tempTags = getAffixTagsFromMenuTree(router, children)
      tempTags.length && affixTags.push(...tempTags)
    }

    return affixTags
  }, [])
}

/**
 * 渲染默认样式的页签
 *
 * @param h {import('vue').CreateElement}  - 渲染函数
 * @param key {string}                     - vnode的key值
 * @param active {boolean=}                - 是否激活
 * @param on {{[k:string]:function}?}      - 绑定的事件监听器
 * @param title {string}                   - 页签文字
 * @param close {function?}                - 点击关闭按钮时触发的函数
 * @return {import('vue').VNode}
 */
export function renderDefaultStyleTag(h, { key, active = false, on, title, close }) {
  const className = `tags-view-item${active ? ' active' : ''}`

  return (
    <div key={key} class={className} {...{ on }}>
      <div class="tags-view-item__dot"/>
      <span>{title}</span>
      {close && <i class="el-icon-close" on-click={close}/>}
    </div>
  )
}
