import Vue from 'vue'
import {createGetters, createMutations} from "./util"
import {isEmpty} from "el-admin-layout/src/util"
import {isMobile} from "el-admin-layout/src/helper"

//加速查找menu的哈希表：<k: menu.fullPath, v: menu>
const menuSearchMap = {}

const state = {
    //区分pc和移动端
    isMobile: isMobile(),

    //标题，目前只配合logo使用
    title: '',

    //logo地址
    logo: '',

    //点击logo后跳转的路由，会传递给<router-link>的to属性
    logoRoute: '/',

    //是否显示侧边栏或顶栏的logo
    showLogo: true,

    //当前激活的顶部菜单的fullPath
    activeRootMenu: '',

    //所有的树形菜单，每个元素为顶部菜单，顶部菜单的子级（如果有）为侧边栏菜单
    menus: [],

    //分层结构，上下（'top-bottom'）、左右（'left-right'）
    struct: 'left-right',

    //导航模式，'aside'、'head'、'mix'
    navMode: 'mix'
}

const store = Vue.observable(state)

//对菜单进行排序、增加parent属性，并将转换后的菜单节点放入查找表中
function transformMenu(menus, parent) {
    if (!menus) return

    const copy = menus.map(menu => ({...menu}))

    copy.sort((pre, next) => {
        pre = getSortValue(pre)
        next = getSortValue(next)
        if (pre < next) return -1
        if (pre === next) return 0
        return 1
    })

    copy.forEach(menu => {
        menu.parent = parent
        menuSearchMap[menu.fullPath] = menu

        if (menu.children) {
            menu.children = transformMenu(menu.children, menu)
        }
    })

    return copy
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

export const getters = createGetters(store)

export const mutations = {
    ...createMutations(store),

    menus(v) {
        if (!Array.isArray(v)) {
            return store.menus = []
        }

        store.menus = transformMenu(v)
    }
}

//根据菜单的fullPath快速查找菜单
export function getMenuByFullPath(fullPath) {
    return menuSearchMap[fullPath]
}
