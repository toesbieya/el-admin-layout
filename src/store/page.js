/**
 * 路由页面的响应式数据
 */
import Vue from 'vue'
import {createGetters, createMutations, bindThis} from "./util"

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

    //是否显示侧边栏或顶栏的logo
    showLogo: true,
    //分层结构，上下（'top-bottom'）、左右（'left-right'）
    position: 'left-right',
    //是否显示页头
    showHeader: true,
    //是否显示页脚
    showFooter: true
}

const store = Vue.observable(state)

export const getters = createGetters(store)

export const mutations = bindThis({
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
    openIframe({src}) {
        store.showIframe = true
        store.currentIframe = src
        this.addIframe(src)
    },
    closeIframe({src, del}) {
        store.showIframe = false
        store.currentIframe = ''
        del && this.delIframe(src)
    }
})
