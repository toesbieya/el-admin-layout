<template>
  <div class="breadcrumb">
    <transition-group name="breadcrumb">
      <div
        v-for="{fullPath, meta: {title}} in linkableItems"
        :key="fullPath"
        class="breadcrumb-item is-link"
      >
        <span class="breadcrumb-inner" @click="() => onClick(fullPath)">{{ title }}</span>
        <span class="breadcrumb-separator">/</span>
      </div>

      <div v-if="lastItem" :key="lastItem.fullPath" class="breadcrumb-item">
        <span class="breadcrumb-inner">{{ lastItem.meta.title }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script>
/**
 * 面包屑，用于页面（Page）的页头
 */

import { getMenuByFullPath } from '../../store'
import { getRouterKey, getRouterTitle, isRedirectRouter } from '../../config/logic'

export default {
  name: 'Breadcrumb',

  data() {
    return {
      items: []
    }
  },

  computed: {
    // 可点击的面包屑项
    linkableItems() {
      return this.items.slice(0, -1)
    },

    // 最后一个面包屑项，不可点击
    lastItem() {
      const { items } = this
      return items.length === 0 ? undefined : items[items.length - 1]
    }
  },

  watch: {
    $route: {
      handler(to) {
        if (isRedirectRouter(to)) return

        const result = this.generateBreadcrumb(to)
        if (result.length !== 0) {
          this.items = result
        }
      },
      immediate: true
    }
  },

  methods: {
    // 点击面包屑时进行跳转，不做刷新处理
    onClick(fullPath) {
      let menu = getMenuByFullPath(fullPath)
      if (!menu) return

      // 找到其叶子菜单
      while (menu.children && menu.children.length >= 1) {
        menu = menu.children[0]
      }

      const { route } = this.$router.resolve(menu.fullPath)

      // 不刷新
      if (getRouterKey(route) !== getRouterKey(this.$route)) {
        this.$router.push(route)
      }
    },

    /**
     * 根据路由生成面包屑
     *
     * @param route {import('vue-router').Route}
     * @return {import('types/menu').MenuItem[]}
     */
    generateBreadcrumb(route) {
      const { path, fullPath, meta: { activeMenu } } = route

      // 使用route.path而非fullPath进行匹配
      const menuFullPath = activeMenu || path
      const menu = getMenuByFullPath(menuFullPath)

      // 没有匹配的菜单
      if (!menu) return []

      // 将菜单的所有父级放入数组
      const items = [menu]
      let parent = menu.parent
      while (parent) {
        items.unshift(parent)
        parent = parent.parent
      }

      // 使用了activeMenu的还需要拼接上自己的标题
      if (activeMenu) {
        items.push({
          fullPath,
          meta: { title: getRouterTitle(route) }
        })
      }

      return items
    }
  }
}
</script>
