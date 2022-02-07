import { getRouterTitle } from '../../config/logic'

/**
 * 从菜单树中获取所有需要固定显示的页签
 *
 * @param router {import('vue-router').VueRouter}  - 路由实例
 * @param menus {import('types').StoreMenuItem[]}  - appStore中的菜单
 * @return {import('types/store').View[]}
 */
export function getAffixTagsFromMenuTree(router, menus) {
  return menus.reduce((result, menu) => {
    const { fullPath, children, meta } = menu

    if (meta.affix === true) {
      const { route } = router.resolve(fullPath)

      result.push({
        ...route,
        meta: {
          ...route.meta,
          title: getRouterTitle(route)
        }
      })
    }

    if (children) {
      const tempTags = getAffixTagsFromMenuTree(router, children)
      tempTags.length && result.push(...tempTags)
    }

    return result
  }, [])
}
