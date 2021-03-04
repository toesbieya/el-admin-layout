import {isEmpty} from "@example/common/util"

//获取高亮菜单的sub-menu
function getSubHighlightMenu(searchWord, children, parent) {
    const result = []

    children.forEach(child => {
        if (child.meta.title.includes(searchWord)) {
            parent && result.push(parent)
        }

        if (child.children) {
            result.push(...getSubHighlightMenu(searchWord, child.children, child))
        }
    })

    return [...new Set(result)]
}

//根据搜索词过滤菜单
export function filterMenuBySearchWord(menus, searchWord) {
    if (!menus) return

    return menus
        .map(menu => ({...menu}))
        .filter(menu => {
            //如果匹配，那么其子节点无需再判断
            if (menu.meta.title.includes(searchWord)) {
                return true
            }

            const children = filterMenuBySearchWord(menu.children, searchWord)

            if (children) menu.children = children

            return children && children.length > 0
        })
}

//根据查找结果展开菜单
export function expandAfterSearch(elMenu, searchWord, filteredMenus) {
    //清空搜索词时还原原本展开的菜单
    if (isEmpty(searchWord)) {
        elMenu.openedMenus = []
        return elMenu.initOpenedMenu()
    }

    const {openedMenus, submenus} = elMenu
    const expandMenus = getSubHighlightMenu(searchWord, filteredMenus)

    //不调用el-menu的open方法是为了避免uniqueOpened
    for (const {fullPath} of expandMenus) {
        const sub = submenus[fullPath]

        if (!sub || openedMenus.includes(sub.index)) continue

        sub.indexPath.forEach(i => {
            !openedMenus.includes(i) && openedMenus.push(i)
        })
    }
}
