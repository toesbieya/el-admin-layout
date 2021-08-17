import Vue from 'vue'
import {createGetters, createMutations} from './util'

const state = {
    //主题，light 或 dark
    theme: 'light',

    //头像地址
    avatar: '',

    //用户名称
    username: '',

    //下拉菜单项，{icon:图标, content:菜单内容, handler:点击时触发的方法}
    dropdownItems: [],

    //自定义渲染下拉菜单项，(h) => VNode[]
    dropdownItemsSlot: undefined,
    //自定义渲染左侧内容，(h, [logo, hamburger]) => VNode | VNode[]
    leftSlot: undefined,
    //自定义渲染中部内容，(h, [headMenu]) => VNode | VNode[]
    centerSlot: undefined,
    //自定义渲染右侧内容，(h, [refreshBtn, dropdown]) => VNode | VNode[]
    rightSlot: undefined,
    //自定义渲染菜单图标，(h, {menu, depth}) => VNode
    menuIconSlot: undefined,
    //自定义渲染菜单内容，(h, {menu, depth}) => VNode
    menuContentSlot: undefined
}

const store = Vue.observable(state)

export const getters = createGetters(store)

export const mutations = createMutations(store)
