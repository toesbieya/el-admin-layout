<script>
/**
 * 能够缓存多种路由页面的keep-alive，用于页面内容（PageView）
 * 借鉴[vue-router-tab](https://github.com/bhuh12/vue-router-tab)
 */

import {isEmpty} from '../../util'
import {getRouterKey} from '../../config/logic'

//添加到组件实例的componentOptions对象的缓存标识的属性名
const KEY = '_routerViewKey'

/**
 * @param children {import('vue').VNode[]}
 * @return {VNode}
 */
function getFirstComponentChild(children) {
    if (Array.isArray(children)) {
        return children.find(c => c && (c.componentOptions || c.isComment && c.asyncFactory))
    }
}

/**
 * 根据指定的key移除缓存，会调用组件的$destroy方法
 *
 * @param cache {Object} 缓存map，<k:缓存key, v:缓存VNode>
 * @param key {string}
 */
function removeCache(cache, key) {
    const cached = cache[key]
    cached && cached.componentInstance && cached.componentInstance.$destroy()
    delete cache[key]
}

/**
 * 没有key时生成，否则返回已有的key
 * 将key保存到componentOptions是因为有的key会根据生成
 *
 * @param route {import('vue-router').Route}                  当前路由(vue-router.currentRoute)
 * @param componentOptions {import('vue').ComponentOptions}   组件实例的componentOptions对象
 * @returns {string}
 */
function getCacheKey(route, componentOptions) {
    if (KEY in componentOptions) return componentOptions[KEY]

    const key = getRouterKey(route)

    if (key) componentOptions[KEY] = key

    return key
}

/**
 * 获取组件构造器的id
 *
 * @param opts {import('vue').ComponentOptions} 组件实例的componentOptions对象
 * @returns {*}
 */
function getCtorId(opts) {
    return opts && opts.Ctor.cid
}

export default {
    name: 'KeepViewAlive',

    abstract: true,

    props: {include: Array},

    watch: {
        include: {
            deep: true,
            handler(val) {
                const {cache, $route} = this
                for (const [k, v] of Object.entries(cache)) {
                    const cacheKey = getCacheKey($route, v.componentOptions)
                    if (!val || !val.includes(cacheKey)) {
                        removeCache(cache, k)
                    }
                }
            }
        }
    },

    created() {
        //缓存map，<k:缓存key, v:缓存VNode>
        this.cache = Object.create(null)
    },

    beforeDestroy() {
        for (const key of Object.keys(this.cache)) {
            removeCache(this.cache, key)
        }
    },

    render() {
        const slot = this.$slots.default
        const vnode = getFirstComponentChild(slot)

        let componentOptions = vnode && vnode.componentOptions

        if (componentOptions) {
            //忽略<transition/>组件
            const child = componentOptions.tag === 'transition' ? componentOptions.children[0] : vnode
            componentOptions = child && child.componentOptions

            if (componentOptions) {
                const key = getCacheKey(this.$route, componentOptions)
                const {include, cache} = this

                //无需缓存时退出
                if (isEmpty(key) || include && !include.includes(key)) {
                    return vnode
                }

                const cachedVNode = cache[key]

                //命中缓存
                if (cachedVNode) {
                    // 开发时的HMR问题
                    if (process.env.NODE_ENV === 'development') {
                        const ctorId = getCtorId(componentOptions)
                        const lastCtorId = cache[key]._ctorId

                        if (lastCtorId !== ctorId) {
                            removeCache(cache, key)
                            cache[key] = child
                        }
                    }

                    child.componentInstance = cachedVNode.componentInstance
                }
                else cache[key] = child

                if (process.env.NODE_ENV === 'development') {
                    child._ctorId = getCtorId(componentOptions)
                }

                child.data.keepAlive = true
            }
        }

        return vnode || (slot && slot[0])
    }
}
</script>
