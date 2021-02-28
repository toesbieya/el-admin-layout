import Vue from 'vue'
import {createGetters, createMutations} from "./util"

const state = {
    //主题，light 或 dark
    theme: 'light',

    //头像地址
    avatar: '',

    //用户名称
    username: '',

    //自定义下拉菜单项，{icon:图标, content:菜单内容, handler:点击时触发的方法}
    dropdownItems: []
}

const store = Vue.observable(state)

export const getters = createGetters(store)

export const mutations = createMutations(store)
