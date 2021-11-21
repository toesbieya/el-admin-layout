<script>
/**
 * 页签栏
 */

import {
  appGetters,
  pageGetters,
  pageMutations,
  tagsViewGetters,
  tagsViewMutations
} from '../../store'
import useContextMenu from '../../component/ContextMenu/functionalUse'
import HorizontalScroller from '../../component/HorizontalScroller'
import { refreshPage } from '../../helper'
import { getRouterKey, getRouterTitle, isRedirectRouter } from '../../config/logic'
import { isAffix, getAffixTagsFromMenuTree, renderDefaultStyleTag } from './util'

export default {
  name: 'TagsView',

  data() {
    return {
      // 当前激活的页签的key，随路由变化
      activeKey: '',

      // 当前选中的页签
      selectedTag: undefined,

      // 页签右键菜单的属性
      contextMenu: {
        show: false,
        top: 0,
        left: 0
      }
    }
  },

  computed: {
    contextMenuItems() {
      const { visitedViews } = tagsViewGetters
      const closeable = visitedViews.length > 1 && !isAffix(this.selectedTag)

      return [
        { content: '刷新', click: this.refreshSelectedTag },
        { content: closeable && '关闭', click: this.closeSelectedTag },
        { content: '关闭其他', click: this.closeOthersTags },
        { content: '关闭全部', click: this.closeAllTags }
      ].filter(i => i.content)
    },

    // 避免HorizontalScroller在右键时触发$forceUpdate
    // https://segmentfault.com/q/1010000040171066
    tagsSlot() {
      return this._u([{
        key: 'default',
        fn: this.renderTags,
        proxy: true
      }])
    }
  },

  watch: {
    $route(to, from) {
      tagsViewGetters.enableChangeTransition && this.decideRouteTransition(to, from)

      // 如果是刷新的话，不需要进行后续操作
      if (isRedirectRouter(to)) return

      this.setActiveKey(to)
      this.addTag(to)
      this.$nextTick(this.moveToCurrentTag)
    }
  },

  methods: {
    /**
     * 根据路由设置当前激活的页签key
     * @param route {import('vue-router').Route}
     */
    setActiveKey(route) {
      this.activeKey = getRouterKey(route)
    },

    /**
     * 根据访问的tab页的左右顺序来确定路由动画
     * @param to {import('vue-router').Route}
     * @param from {import('vue-router').Route}
     */
    decideRouteTransition(to, from) {
      const { next, prev } = pageGetters.transition
      const { visitedViews } = tagsViewGetters
      const fromKey = getRouterKey(from)
      const toKey = getRouterKey(to)

      // 这里认为页签数量不会太多，所以为了可读性使用两次循环查找
      const fromIndex = visitedViews.findIndex(i => i.key === fromKey)
      const toIndex = visitedViews.findIndex(i => i.key === toKey)

      let transitionName = prev

      // 新开tab也认为顺序高于上一个tab
      if (toIndex === -1 || fromIndex < toIndex) {
        transitionName = next
      }

      pageMutations.transition({ curr: transitionName })
    },

    // 初始化固定显示的页签
    initTags() {
      // TODO 如果页签栏初始化后菜单未加载，则固定页签会出问题
      // 添加所有固定显示的页签
      getAffixTagsFromMenuTree(this.$router, appGetters.menus).forEach(tagsViewMutations.addTagOnly)

      // 将当前路由对象添加为页签
      this.addTag(this.$route)
    },
    /**
     * 尝试将路由对象添加为tab页
     * @param route {import('vue-router').Route}
     */
    addTag(route) {
      tagsViewMutations.addTagAndCache({
        ...route,
        meta: {
          ...route.meta,
          title: getRouterTitle(route)
        }
      })
    },
    // 横向滚动条移动至当前tab
    moveToCurrentTag() {
      const { scroller } = this.$refs
      const cur =
        Array
          .from(scroller.$el.children)
          .find(el => el.classList.contains('active'))
      cur && scroller.moveToTarget(cur)
    },
    /**
     * 激活末尾页签
     * @param refresh {boolean=} 目标路由是当前路由时是否需要刷新
     * @return {Promise<Route>}
     */
    gotoLastTag(refresh = false) {
      const views = tagsViewGetters.visitedViews
      const router = this.$router

      if (views.length === 0) {
        return router.push('/')
      }

      const latest = views[views.length - 1]

      // 目标路由是当前路由时需要刷新，否则直接跳转
      this.activeKey === latest.key
        ? refresh && refreshPage(router)
        // 需要套一层$nextTick，否则tagsViewStore.visitedViews可能只会变动一次
        : this.$nextTick(() => router.push(latest))
    },

    /**
     * 刷新所选页签
     * @param view {View}
     */
    refreshSelectedTag(view = this.selectedTag) {
      refreshPage(this.$router, view)
    },
    /**
     * 关闭所选页签
     * @param view {VisitedView}
     */
    closeSelectedTag(view = this.selectedTag) {
      if (tagsViewGetters.visitedViews.length <= 1 || isAffix(view)) return

      tagsViewMutations.delTagAndCache(view)
      this.activeKey === view.key && this.gotoLastTag()
    },
    // 关闭除激活、固定页签以外的所有页签
    closeOthersTags() {
      tagsViewMutations.delOtherTagAndCache(this.selectedTag)
      this.gotoLastTag()
    },
    // 关闭除固定页签以外的所有页签
    closeAllTags() {
      tagsViewMutations.delAllTagAndCache()
      this.gotoLastTag(true)
    },
    /**
     * 在页签上打开右键菜单
     * @param tag {VisitedView}
     * @param e {MouseEvent}
     */
    openContextMenu(tag, e) {
      e.preventDefault()

      // 销毁之前的右键菜单实例
      this.$contextmenu && this.$contextmenu()

      this.selectedTag = tag

      this.$contextmenu = useContextMenu(this.contextMenuItems, {
        left: e.clientX + 15,
        top: e.clientY + 5
      })
    },

    renderTags() {
      const { $createElement: h, $router, activeKey } = this
      const { itemSlot, visitedViews } = tagsViewGetters
      const renderFn = itemSlot || renderDefaultStyleTag

      return visitedViews.map(view => {
        const active = activeKey === view.key
        const showClose = !isAffix(view) && visitedViews.length > 1
        const on = {
          contextmenu: e => this.openContextMenu(view, e)
        }
        const onClose = e => {
          // 需要阻止事件冒泡，不然会触发tag的click事件
          e.stopPropagation()
          this.closeSelectedTag(view)
        }

        // 非激活页签时，绑定点击事件，点击跳转到页签对应的路由
        if (!active) {
          on.click = () => $router.push(view, () => undefined)
        }

        return renderFn(h, {
          key: view.key,
          active,
          on,
          title: view.meta.title,
          close: showClose && onClose
        })
      })
    }
  },

  mounted() {
    this.setActiveKey(this.$route)
    this.initTags()
  },

  render() {
    return (
      <nav class="tags-view">
        <HorizontalScroller ref="scroller" scopedSlots={this.tagsSlot}/>
      </nav>
    )
  }
}
</script>
