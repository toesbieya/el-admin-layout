/**
 * 自行实现缓存控制的router-view，不支持嵌套路由
 */

/**
 * 根据指定的key清除keep-alive组件内的缓存
 *
 * @param key {string}
 * @param instance {Vue} keep-alive组件实例
 */
function pruneCacheEntry(key, instance) {
  if (!instance) return

  const { cache, _vnode: current } = instance
  const entry = cache[key]

  if (entry && (!current || entry.tag !== current.tag)) {
    entry.componentInstance.$destroy()
  }

  delete cache[key]

  // keep-alive中的keys仅是用于max，所以直接清空
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
  name: 'CachedRouterView',

  inheritAttrs: true,

  props: {
    // 是否启用缓存功能
    cacheable: { type: Boolean, default: true },

    // 包裹路由页面的容器标签名，为空时不做包裹
    tag: { type: String, default: 'div' },

    // <transition/>的props，为空时不使用transition
    transitionProps: Object,

    // 获取路由唯一标识的函数，传入当前路由(this.$route)，返回一个字符串
    keyFn: Function,

    // 需要缓存的路由标识列表
    includes: { type: Array, default: () => [] },

    // 是否开启对缓存下的路由页面热更新的支持
    hmr: Boolean
  },

  data() {
    return {
      renderView: true
    }
  },

  computed: {
    // 当前路由的唯一标识
    routerViewKey() {
      return this.$props.keyFn(this.$route)
    },
    // 加速读取的缓存key哈希表
    cachedKeyMap() {
      return this.$props.includes.reduce((map, key) => {
        map[key] = 1
        return map
      }, {})
    }
  },

  methods: {
    // 获取keep-alive实例
    getKeepAliveInstance() {
      const {_vnode} = this
      if (!_vnode) return

      let vnode = this.tag ? _vnode.children[0] : _vnode
      // 是否被transition包裹
      const wrappedByTransition = vnode.componentOptions.tag === 'transition'

      if (wrappedByTransition) {
        vnode = vnode.child._vnode
      }

      return { instance: vnode.componentInstance, wrappedByTransition }
    },

    // 在keep-alive更新后对其缓存做处理
    onKeepAliveUpdated() {
      const { instance, wrappedByTransition } = this.getKeepAliveInstance()
      const { cache } = instance

      // 由于keep-alive会缓存所有，所以需要清除不需要缓存的部分
      Object.keys(cache).forEach(key => {
        // transition会修改子级vnode的key
        // https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/components/transition.js#L146
        const cachedKey = wrappedByTransition
          ? key.replace(/__transition-(\d+)-/, '')
          : key
        !this.cachedKeyMap[cachedKey] && pruneCacheEntry(key, instance)

        // 解决HMR无效
        if (this.hmr && cache[key]) {
          const comp = cache[key].componentInstance
          const lastCtorId = cache[key]._ctorId
          const ctorId = (cache[key]._ctorId = getCtorId(comp))

          if (lastCtorId != null && lastCtorId !== ctorId) {
            pruneCacheEntry(key, instance)
            this.rerenderRouterView()
          }
        }
      })
    },

    // 强制router-view重新渲染
    rerenderRouterView() {
      if (!this.renderView) return

      this.renderView = false
      this.$nextTick(() => this.renderView = true)
    }
  },

  render(h) {
    const { cacheable, transitionProps, tag, includes } = this.$props

    // 确保缓存控制数组变动时，keep-alive也会更新
    // 因为会有关掉的页签非当前页签的情况，此时cachedViews虽然变化，但keep-alive不会更新
    this.$_tmp_ = includes.length

    let view = this.renderView && h('router-view', { key: this.routerViewKey })

    if (cacheable) {
      // 每次都传递一个全新的props，保证render时keep-alive也render
      const data = {
        on: { 'hook:updated': this.onKeepAliveUpdated }
      }
      view = h('keep-alive', data, [view])
    }

    if (transitionProps) {
      view = h('transition', { props: transitionProps }, [view])
    }

    return tag ? h(tag, [view]) : view
  }
}
