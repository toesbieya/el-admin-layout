/**
 * 多页签的响应式数据
 */
import Vue from 'vue'
import {getters as pageGetters, mutations as pageMutations} from './page'
import {createGetters, createMutations} from './util'
import {isEmpty} from '../util'
import {getRouterKey} from '../config/logic'

const state = {
    //是否启用
    enabled: true,
    //是否启用缓存功能
    enableCache: true,
    //是否启用根据页签顺序来确定过渡动画的功能
    enableChangeTransition: true,

    //显示的页签
    visitedViews: [],

    //需要缓存的页签key的数组，用于<keep-router-view-alive/>:include
    cachedViews: []
}

const store = Vue.observable(state)

export const getters = createGetters(store)

export const mutations = {
    ...createMutations(store),

    /**
     * 多页签的启用/停用
     * 停用时会移除所有缓存，并且重置路由过渡动画
     * @param v {boolean} 启用为true，停用为false
     */
    enabled(v) {
        store.enabled = v

        if (!v) {
            pageMutations.transition({curr: pageGetters.transition.default})
            mutations.delAllTagAndCache()
        }
    },

    /**
     * 多页签缓存功能的启用/停用
     * 停用时会移除所有缓存
     * @param v {boolean}
     */
    enableCache(v) {
        store.enableCache = v
        !v && mutations.delAllCache()
    },

    /**
     * 根据页签顺序来确定过渡动画功能的启用/停用
     * 停用时会将pageGetters.transition.curr设为为默认值
     * @param v {boolean}
     */
    enableChangeTransition(v) {
        store.enableChangeTransition = v
        pageMutations.transition({curr: pageGetters.transition.default})
    },

    /**
     * 在页签栏上添加一个页签，没有标题、已存在的不会重复添加
     * @param view {View}
     */
    addTagOnly(view) {
        if (isEmpty(view.meta.title)) {
            return
        }

        const key = getRouterKey(view)

        if (store.visitedViews.some(v => v.key === key)) {
            return
        }

        //增加key属性
        store.visitedViews.push({...view, key})
    },

    /**
     * 将传入的页签加入缓存中
     * 以下调用无效：设置了不缓存、已缓存
     * @param view {View}
     */
    addCacheOnly(view) {
        const {noCache} = view.meta

        const key = getRouterKey(view)

        if (noCache === true || store.cachedViews.includes(key)) {
            return
        }

        store.cachedViews.push(key)
    },

    /**
     * 同时调用{@link #addTagOnly}、{@link #addCacheOnly}
     * @param view {View}
     */
    addTagAndCache(view) {
        mutations.addTagOnly(view)
        mutations.addCacheOnly(view)
    },

    /**
     * 从页签栏中移除一个页签
     * @param view {View}
     */
    delTagOnly(view) {
        const key = getRouterKey(view)
        const index = store.visitedViews.findIndex(i => i.key === key)
        index > -1 && store.visitedViews.splice(index, 1)
    },

    /**
     * 删除对应的缓存
     * @param view {View}
     */
    delCacheOnly(view) {
        const key = getRouterKey(view)
        const index = store.cachedViews.indexOf(key)
        index > -1 && store.cachedViews.splice(index, 1)

        //移除iframe
        const {iframe} = view.meta
        iframe && pageMutations.delIframe(iframe)
    },

    /**
     * 同时调用{@link #delTagOnly}、{@link #delCacheOnly}
     * @param view {View}
     */
    delTagAndCache(view) {
        mutations.delTagOnly(view)
        mutations.delCacheOnly(view)
    },

    /**
     * 从页签栏上移除其他的非固定页签以及其他的缓存
     * @param view {View}
     */
    delOtherTagAndCache(view) {
        //记录被移除的iframe
        const removeIframe = []

        const key = getRouterKey(view)
        const cachedKey = store.cachedViews.find(i => i === key)

        store.visitedViews = store.visitedViews.filter(v => {
            if (v.meta.affix || v.key === key) {
                return true
            }

            v.meta.iframe && removeIframe.push(v.meta.iframe)

            return false
        })
        store.cachedViews = cachedKey ? [cachedKey] : []

        pageMutations.iframeList(pageGetters.iframeList.filter(i => !removeIframe.includes(i)))
    },

    /**
     * 移除所有缓存
     */
    delAllCache() {
        store.cachedViews = []
        pageMutations.iframeList([])
    },

    /**
     * 从页签栏上移除所有非固定页签，并且移除所有缓存
     */
    delAllTagAndCache() {
        store.visitedViews = store.visitedViews.filter(v => v.meta.affix)
        mutations.delAllCache()
    }
}
