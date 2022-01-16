<script>
import { Const } from '../../config'
import Aside from '../Aside'
import Header from '../Header'
import TagsView from '../TagsView'
import Page from '../Page'
import {
  appGetters,
  appMutations,
  asideMutations,
  headerMutations,
  tagsViewGetters,
  tagsViewMutations,
  pageMutations
} from '../../store'
import { isMobile } from '../../helper'
import { debounce } from '../../util'

export default {
  name: 'ElAdminLayout',

  data() {
    return {
      /**
       * 上一次的$scopedSlots
       *
       * @type {Vue.$scopedSlots}
       */
      $_cachedScopedSlots: Object.create(null),

      /**
       * 用于加速根据插槽名查找store mutation的缓存map
       */
      $_slotMutationsMap: Object.create(null)
    }
  },

  computed: {
    // 是否需要渲染侧边栏
    renderAside() {
      const { isMobile, navMode } = appGetters
      return isMobile || ['aside', 'mix'].includes(navMode)
    }
  },

  methods: {
    // render时调用，根据插槽的变化修改store数据
    mutateStoreSlot() {
      const cache = this.$data.$_cachedScopedSlots
      const curr = this.$scopedSlots

      // 减少的
      Object.keys(cache).forEach(slotName => {
        // 缓存中有，本次没有
        if (!curr[slotName]) {
          const f = this.getMutationBySlot(slotName)
          f(undefined)
        }
      })

      // 新增的
      Object.keys(curr).forEach(slotName => {
        // 本次有，缓存中没有
        if (!cache[slotName]) {
          const f = this.getMutationBySlot(slotName)
          // scopedSlots: (props) => VNode
          // render: (h, props) => VNode
          f((h, props) => curr[slotName](props))
        }
      })

      this.$data.$_cachedScopedSlots = curr
    },
    getMutations(prefix) {
      switch (prefix) {
        case 'aside':
          return asideMutations
        case 'header':
          return headerMutations
        case 'page':
          return pageMutations
      }
    },
    getMutationBySlot(slot) {
      const cache = this.$data.$_slotMutationsMap

      if (cache[slot]) return cache[slot]

      // 不规则的
      if (slot === 'logo') {
        cache[slot] = appMutations.logoSlot
        return cache[slot]
      }
      if (slot === 'tags-view-item') {
        cache[slot] = tagsViewMutations.itemSlot
        return cache[slot]
      }

      const arr = slot.split('-')
      const mutations = this.getMutations(arr[0])

      // aside -> asideMutations.defaultSlot
      if (arr.length === 1) {
        cache[slot] = mutations.defaultSlot
        return cache[slot]
      }

      // aside-header -> asideMutations.headerSlot
      // aside-menu-icon -> asideMutations.menuIconSlot
      let method = arr[1]
      for (let i = 2, len = arr.length; i < len; i++) {
        const token = arr[i]
        method += token[0].toUpperCase() + [...token.slice(1)].join('')
      }

      return (cache[slot] = mutations[method += 'Slot'])
    }
  },

  mounted() {
    this.$_resize = debounce(() => {
      !document.hidden && appMutations.isMobile(isMobile())
    })
    window.addEventListener('resize', this.$_resize)
  },

  beforeDestroy() {
    if (this.$_resize) {
      window.removeEventListener('resize', this.$_resize)
      delete this.$_resize
    }

    this.$data.$_cachedScopedSlots = undefined
    this.$data.$_slotMutationsMap = undefined
  },

  render() {
    Const.enableLayoutSlot && this.mutateStoreSlot()

    const hasTagView = tagsViewGetters.enabled

    const classList = [
      'el-admin-layout',
      'has-header',
      hasTagView && 'has-tags-view',
      appGetters.struct
    ]

    return (
      <div class={classList}>
        <Header ref="header"/>

        {hasTagView && <TagsView ref="tags-view"/>}

        {this.renderAside && <Aside ref="aside"/>}

        <Page ref="page"/>
      </div>
    )
  }
}
</script>
