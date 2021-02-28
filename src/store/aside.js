/**
 * 侧边栏的响应式数据
 */
import Vue from 'vue'
import {getters as appGetters} from "./app"
import {createGetters, createMutations} from "./util"
import cssVar from "../style/var.scss"

const state = {
    //抽屉模式时的显隐
    show: false,

    //主题，light 或 dark
    theme: 'light',

    //手风琴效果
    uniqueOpen: true,

    //是否折叠
    collapse: false,

    //折叠时显示上级
    showParentOnCollapse: false,

    //自动隐藏
    autoHide: false,

    //是否在没有菜单时也渲染侧边栏
    alwaysRender: false,

    //在侧边栏渲染前对菜单数据进行操作的函数（menus => changedMenus:array），需要返回修改后的菜单数组！
    postMenus: null,

    //传递给nav-menu，子菜单的单位缩进距离
    inlineIndent: parseFloat(cssVar.menuPadding),

    //侧边栏菜单变化时的过渡动画名称，最终传递给transition的name属性，为空时不使用过渡动画
    switchTransitionName: 'sidebar'
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
                let open = true
                if (appGetters.isMobile) {
                    open = !store.show
                }
                else open = store.collapse
                return open ? mutations.open() : mutations.close()
        }
    }
}
