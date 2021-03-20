import Vue from 'vue'
import {createGetters, createMutations} from "./util"
import {isMobile} from "../helper"

const state = {
    //区分pc和移动端
    isMobile: isMobile(),

    //标题，目前只配合logo使用
    title: '',

    //logo地址
    logo: '',

    //点击logo后跳转的路由，作为router.push/replace的第一个参数
    logoRoute: '/',

    //点击logo容器时触发，会替换原有的逻辑，(e) => any
    onLogoClick: undefined,

    //自定义渲染logo，(h, {img, title, props}) => VNode | VNode[]
    logoSlot: undefined,

    //是否显示侧边栏或顶栏的logo
    showLogo: true,

    //当前激活的顶部菜单的fullPath
    activeRootMenu: '',

    //所有的树形菜单，mix导航模式时，每个元素为顶部菜单，顶部菜单的子级（如果有）为侧边栏菜单
    menus: [],

    //是否正在加载菜单，会让侧边栏菜单和顶栏菜单呈现加载状态
    loadingMenu: false,

    //分层结构，上下（'top-bottom'）、左右（'left-right'）
    struct: 'left-right',

    //导航模式，'aside'、'head'、'mix'
    navMode: 'mix'
}

const store = Vue.observable(state)

//加速查找menu的哈希表：<k: menu.fullPath, v: menu>
let MenuSearchMap = Object.create(null)

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
        MenuSearchMap[menu.fullPath] = menu

        if (menu.children) {
            menu.children = transformMenu(menu.children, menu)
        }
    })

    return copy
}

//菜单排序值的空值处理
function getSortValue(item) {
    const sort = deepGetSortValue(item)
    return sort == null ? 10000 : sort
}

//获取菜单的排序值
function deepGetSortValue(item) {
    const {children = [], meta: {sort} = {}} = item

    if (sort == null) return sort

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
        //每次更新菜单时都需要清空加速表
        MenuSearchMap = Object.create(null)

        if (!Array.isArray(v)) {
            return store.menus = []
        }

        store.menus = transformMenu(v)
    },

    /**
     * 修改某一个菜单的meta属性
     *
     * @param fullPath {string} 菜单的fullPath
     * @param meta {MenuItemMeta}
     */
    modifyMenuMeta(fullPath, meta) {
        const menu = getMenuByFullPath(fullPath)
        if (!menu) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn(`[appMutations.modifyMenu] 没有fullPath为${fullPath}的菜单`)
            }
            return
        }

        menu.meta = {...menu.meta, ...meta}
    }
}

//根据菜单的fullPath快速查找菜单
export function getMenuByFullPath(fullPath) {
    return MenuSearchMap[fullPath]
}
