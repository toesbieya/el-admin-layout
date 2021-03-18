/**
 * 侧边栏的响应式数据
 */
import Vue from 'vue'
import {getters as appGetters} from "./app"
import {createGetters, createMutations} from "./util"

const state = {
    //抽屉模式时的显隐
    show: false,

    //主题，light 或 dark
    theme: 'dark',

    //手风琴效果
    uniqueOpen: true,

    //是否折叠
    collapse: false,

    //折叠时显示上级
    showParentOnCollapse: false,

    //是否显示汉堡包
    showHamburger: true,

    //自动隐藏
    autoHide: false,

    //是否在没有菜单时也渲染侧边栏
    alwaysRender: false,

    //在侧边栏渲染前对菜单数据进行操作的函数（menus => changedMenus:array），需要返回修改后的菜单数组！
    postMenus: null,

    //传递给nav-menu，子菜单的单位缩进距离，默认为var.scss中的$menu-padding
    inlineIndent: 26,

    //侧边栏菜单变化时的过渡动画名称，最终传递给transition的name属性，为空时不使用过渡动画
    switchTransitionName: 'sidebar',

    //默认展开的菜单的fullPath数组
    defaultOpeneds: [],

    //自定义渲染侧边栏内容，(h) => VNode
    defaultSlot: undefined,
    //自定义渲染侧边栏头部内容，(h, logo) => VNode | VNode[]
    headerSlot: undefined,
    //自定义渲染侧边栏底部内容，(h, hamburger) => VNode | VNode[]
    footerSlot: undefined,

    //自定义渲染菜单图标，(h, {menu, depth}) => VNode
    menuIconSlot: undefined,
    //自定义渲染菜单内容，(h, {menu, depth}) => VNode
    menuContentSlot: undefined
}

const store = Vue.observable(state)

export const getters = createGetters(store)

export const mutations = {
    ...createMutations(store),

    /*移动端或设置了侧边栏自动隐藏时打开关闭抽屉，否则展开折叠*/
    open() {
        if (appGetters.isMobile || store.autoHide) {
            store.show = true
        }
        else store.collapse = false
    },
    close() {
        if (appGetters.isMobile || store.autoHide) {
            store.show = false
        }
        else store.collapse = true
    },
    //切换侧边栏的状态
    switch(action) {
        switch (action) {
            case 'open':
                return mutations.open()
            case 'close':
                return mutations.close()
            default :
                const open =
                    appGetters.isMobile
                        ? !store.show
                        : store.collapse
                open ? mutations.open() : mutations.close()
        }
    }
}
