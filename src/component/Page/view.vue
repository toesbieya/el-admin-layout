<script>
import {pageGetters, tagsViewGetters} from '../../store'
import {getRouterKey} from '../../config/logic'
import {isEmpty} from '../../util'

/**
 * 根据指定的key清除keep-alive组件内的缓存
 *
 * @param key {string}
 * @param instance {Vue} keep-alive组件实例
 */
function pruneCacheEntry(key, instance) {
    if (!instance) return

    const {cache, _vnode: current} = instance
    const entry = cache[key]

    if (entry && (!current || entry.tag !== current.tag)) {
        entry.componentInstance.$destroy()
    }

    delete cache[key]

    //keep-alive中的keys仅是用于max，所以直接清空
    instance.keys = []
}

/**
 * 获取组件构造器的id
 *
 * @param instance {Vue}
 * @returns {number}
 */
function getCtorId(instance) {
    const opt = instance.$vnode.componentOptions
    return opt && opt.Ctor.cid
}

export default {
    name: 'PageView',

    data() {
        return {
            renderView: true
        }
    },

    computed: {
        //当前路由的唯一标识
        routerViewKey() {
            return getRouterKey(this.$route)
        },

        //是否使用keep-alive
        useKeepAlive() {
            return tagsViewGetters.enabled && tagsViewGetters.enableCache
        },
        //传递给keep-alive组件的属性
        keepAliveData() {
            const timestamp = Date.now()
            //确保缓存控制数组变动时，keep-alive也会更新
            //因为会有关掉的页签非当前页签的情况，此时cachedViews虽然变化，但keep-alive不会更新
            const exclude = tagsViewGetters.cachedViews.map(key => key + timestamp)

            return {
                props: {exclude},
                on: {'hook:updated': this.onKeepAliveUpdated}
            }
        },
        //加速读取的缓存key哈希表
        cachedKeyMap() {
            return tagsViewGetters.cachedViews.reduce((map, key) => {
                map[key] = 1
                return map
            }, {})
        },

        //是否使用过渡动画
        useTransition() {
            return pageGetters.enableTransition
        },
        //过渡动画名称
        transitionName() {
            return pageGetters.transition.curr
        }
    },

    methods: {
        //获取keep-alive实例
        getKeepAliveInstance() {
            if (!this._vnode) return

            const vnode = this._vnode.children[0]

            //未被transition包裹时
            if (!pageGetters.enableTransition) {
                return vnode.componentInstance
            }

            return vnode.child._vnode.componentInstance
        },

        //在keep-alive更新后对其缓存做处理
        onKeepAliveUpdated() {
            const instance = this.getKeepAliveInstance()
            const {cache} = instance
            const hasTransition = pageGetters.enableTransition

            //由于keep-alive会缓存所有，所以需要清除不需要缓存的部分
            Object.keys(cache).forEach(key => {
                const routerKey = hasTransition
                    //被transition包裹时，key会加上一个前缀
                    ? key.replace(/__transition-(\d+)-/, '')
                    : key
                !this.cachedKeyMap[routerKey] && pruneCacheEntry(key, instance)

                //解决HMR无效
                if (process.env.NODE_ENV === 'development') {
                    if (cache[key]) {
                        const comp = cache[key].componentInstance
                        const lastCtorId = cache[key]._ctorId
                        const ctorId = (cache[key]._ctorId = getCtorId(comp))

                        if (!isEmpty(lastCtorId) && lastCtorId !== ctorId) {
                            pruneCacheEntry(key, instance)
                            this.rerenderRouterView()
                        }
                    }
                }
            })
        },

        //强制router-view重新渲染
        rerenderRouterView() {
            if (!this.renderView) return

            this.renderView = false
            this.$nextTick(() => this.renderView = true)
        }
    },

    render() {
        let view = this.renderView && <router-view key={this.routerViewKey}/>

        if (this.useKeepAlive) {
            view = <keep-alive {...this.keepAliveData}>{view}</keep-alive>
        }

        if (this.useTransition) {
            view = <transition name={this.transitionName} mode="out-in">{view}</transition>
        }

        return <div class="page-view">{view}</div>
    }
}
</script>
