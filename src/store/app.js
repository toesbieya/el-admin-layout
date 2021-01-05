import Vue from 'vue'
import {createGetters, createMutations} from "./util"
import {isEmpty, debounce} from "el-admin-layout/src/util"
import {isMobile} from "el-admin-layout/src/helper"

//加速查找menu的哈希表：<k: menu.fullPath, v: menu>
const menuSearchMap = {}

const state = {
    //区分pc和移动端
    isMobile: isMobile(),

    //标题和logo地址
    title: '',
    logo: '',

    //当前激活的顶部菜单的fullPath
    activeRootMenu: '',

    //所有的树形菜单，每个元素为顶部菜单，顶部菜单的子级（如果有）为侧边栏菜单
    menus: [],

    //导航模式，'aside'、'aside-two-part'、'head'、'mix'
    navMode: 'mix'
}

const store = Vue.observable(state)

export const getters = createGetters(store)

export const mutations = {
    ...createMutations(store),

    menus(v) {
        if (!Array.isArray(v) || v.length === 0) {
            store.menus = []
        }

        transformMenu(v)

        store.menus = v
    }
}

export function getMenuByFullPath(fullPath) {
    return menuSearchMap[fullPath]
}

//对菜单进行排序、增加parent属性，并将转换后的菜单节点放入查找表中
function transformMenu(menus, parent) {
    menus.sort((pre, next) => {
        pre = getSortValue(pre)
        next = getSortValue(next)
        if (pre < next) return -1
        if (pre === next) return 0
        return 1
    })

    menus.forEach(menu => {
        menu.parent = parent
        menuSearchMap[menu.fullPath] = menu
        menu.children && transformMenu(menu.children, menu)
    })
}

//菜单排序值的空值处理
function getSortValue(item) {
    const sort = deepGetSortValue(item)
    return isEmpty(sort) ? 10000 : sort
}

//获取菜单的排序值
function deepGetSortValue(item) {
    const {children = [], meta: {hidden, sort} = {}} = item

    if (hidden) return null

    if (!isEmpty(sort)) return sort

    //如果只有一个子节点，那么取子节点的排序值
    if (children.length === 1) {
        return deepGetSortValue(children[0])
    }

    return null
}

window.addEventListener('resize', debounce(() => {
    !document.hidden && mutations.isMobile(isMobile())
}))
