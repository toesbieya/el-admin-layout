/**
 * 路由页面的响应式数据
 */
import Vue from 'vue'
import {createGetters, createMutations} from "./util"

const state = {
    //路由过渡动画
    transition: {
        //当未启用多页签时的路由动画
        default: 'el-fade-in',
        //要访问的tab顺序高于上一个访问的tab时的路由动画
        next: 'left-out',
        //要访问的tab顺序不高于上一个访问的tab时的路由动画
        prev: 'right-out',
        //当前使用的路由动画
        curr: 'el-fade-in'
    },

    /*iframe的控制*/
    showIframe: false,
    currentIframe: '',
    iframeList: [],

    //是否显示页头
    showHeader: true,
    //是否显示页脚
    showFooter: true,
    //自定义渲染页头内容，(h) => VNode | VNode[]
    headerSlot: undefined,
    //自定义渲染页脚内容，(h) => VNode | VNode[]
    footerSlot: undefined
}

const store = Vue.observable(state)

export const getters = createGetters(store)

export const mutations = {
    ...createMutations(store),

    //修改transition时使用Object.assign
    transition(obj) {
        Object.assign(store.transition, obj)
    },

    addIframe(src) {
        !store.iframeList.includes(src) && store.iframeList.push(src)
    },
    delIframe(src) {
        const index = store.iframeList.findIndex(i => i === src)
        index > -1 && store.iframeList.splice(index, 1)
    },
    openIframe(src) {
        store.showIframe = true
        store.currentIframe = src
        mutations.addIframe(src)
    },
    closeIframe(src, del) {
        store.showIframe = false
        store.currentIframe = ''
        del && mutations.delIframe(src)
    }
}
