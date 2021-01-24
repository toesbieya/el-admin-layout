/**
 * 多页签的响应式数据
 */
import Vue from 'vue'
import {getters as pageGetters, mutations as pageMutations} from "./page"
import {createGetters, createMutations, bindThis} from "./util"
import {isEmpty} from "el-admin-layout/src/util"
import {getRouterKey} from "el-admin-layout/src/config/logic"

const state = {
    //是否启用
    enabled: true,
    //是否启用缓存功能
    enableCache: true,

    //显示的页签
    visitedViews: [],

    //缓存的页签，用于<keep-router-view-alive/>:include
    cachedViews: []
}

const store = Vue.observable(state)

export const getters = createGetters(store)

export const mutations = bindThis({
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
            this.delAllTagAndCache()
        }
    },

    /**
     * 多页签缓存功能的启用/停用
     * 停用时会移除所有缓存
     * @param v
     */
    enableCache(v) {
        store.enableCache = v
        !v && this.delAllCache()
    },

    /**
     * 在页签栏上添加一个页签，没有标题、已存在的不会重复添加
     * @param view
     */
    addTagOnly(view) {
        if (!view.meta || isEmpty(view.meta.title)) {
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
     * @param view
     */
    addCacheOnly(view) {
        const {noCache} = view.meta || {}

        const key = getRouterKey(view)

        if (noCache === true || store.cachedViews.includes(key)) {
            return
        }

        store.cachedViews.push(key)
    },

    /**
     * 同时调用{@link #addTagOnly}、{@link #addCacheOnly}
     * @param view
     */
    addTagAndCache(view) {
        this.addTagOnly(view)
        this.addCacheOnly(view)
    },

    /**
     * 从页签栏中移除一个页签
     * @param view
     */
    delTagOnly(view) {
        const key = getRouterKey(view)
        const index = store.visitedViews.findIndex(i => i.key === key)
        index > -1 && store.visitedViews.splice(index, 1)
    },

    /**
     * 删除对应的缓存
     * @param view
     */
    delCacheOnly(view) {
        const key = getRouterKey(view)
        const index = store.cachedViews.indexOf(key)
        index > -1 && store.cachedViews.splice(index, 1)

        //移除iframe
        const iframe = view.meta && view.meta.iframe
        iframe && pageMutations.delIframe(iframe)
    },

    /**
     * 同时调用{@link #delTagOnly}、{@link #delCacheOnly}
     * @param view
     */
    delTagAndCache(view) {
        this.delTagOnly(view)
        this.delCacheOnly(view)
    },

    /**
     * 从页签栏上移除其他的非固定页签以及其他的缓存
     * @param view
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
        store.visitedViews = store.visitedViews.filter(v => v.meta && v.meta.affix)
        this.delAllCache()
    }
})
