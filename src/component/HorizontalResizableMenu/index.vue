<script lang="jsx">
/**
 * 顶部菜单，参考了ant design的响应式设计
 */

import Vue from 'vue'
import menuMixin from '../../mixin/menu'
import { appGetters, appMutations, headerGetters } from '../../store'
import NavMenu from '../../component/NavMenu'
import LoadingSpinner from '../../component/LoadingSpinner'
import GhostMenu from './GhostMenu'
import { getRouterActiveMenu } from '../../config/logic'
import { getMenuByFullPath } from '../../store'
import { findFirstLeaf } from '../../util'

export default {
  name: 'HorizontalResizableMenu',

  mixins: [menuMixin],

  data() {
    return {
      // 最后一个不被隐藏的顶部菜单的数组下标
      // 为undefined时，说明不需要隐藏菜单，为-1时，说明需要隐藏全部菜单
      lastVisibleIndex: undefined,

      // 用于生成el-submenu的key
      seed: 0
    }
  },

  computed: {
    // 原始的菜单数组
    menus() {
      const { menus, navMode } = appGetters

      switch (navMode) {
        case 'head' :
          return menus
        case 'mix':
          return menus.map(menu => ({ ...menu, children: undefined }))
        default:
          return []
      }
    },
    // 实际用于渲染的菜单数组（仿antd的自适应宽度）
    realMenus() {
      const { lastVisibleIndex, menus, seed } = this

      // 不需要隐藏菜单
      if (lastVisibleIndex === undefined) {
        return menus
      }

      const fullPath = `_${seed}`

      // 隐藏全部菜单
      if (lastVisibleIndex === -1) {
        return [{ fullPath, meta: { icon: 'el-icon-menu' }, children: menus }]
      }

      const visible = menus.slice(0, lastVisibleIndex + 1)
      const hidden = menus.slice(lastVisibleIndex + 1)

      visible.push({ fullPath, meta: { title: '...' }, children: hidden })

      return visible
    },
    // 是否有dom，加载中、无菜单时没有
    hasDom() {
      return !appGetters.loadingMenu && this.menus.length > 0
    }
  },

  watch: {
    // 路由变化时设置高亮菜单
    $route: {
      immediate: true,
      handler(to) {
        if (this.setActiveRootMenu(to)) {
          this.setActiveMenu(appGetters.navMode, to)
        }
      }
    },
    // 顶部菜单变化时设置高亮菜单
    realMenus: {
      immediate: true,
      handler(v) {
        if (!this.hasDom) return

        this.setActiveMenu(undefined, undefined, false)
        this.setDefaultActiveMenu(v)
      }
    },
    // 有dom时才进行自适应处理
    hasDom: {
      immediate: true,
      async handler(value) {
        // 等待mounted
        await this.$nextTick()

        value ? this.startObserver() : this.stopObserver()
      }
    },
    // 变动时修改种子，避免组件不更新
    lastVisibleIndex() {
      this.seed++
    }
  },

  methods: {
    // 路由变化时设置高亮根节点菜单，有匹配菜单时返回true
    setActiveRootMenu({ path, meta: { activeMenu } }) {
      // 优先使用activeMenu找到路由匹配的菜单
      const menu = getMenuByFullPath(activeMenu || path)
      if (!menu) return false

      // 向上找出菜单所属的根节点
      let rootMenu = menu
      while (rootMenu.parent) {
        rootMenu = rootMenu.parent
      }

      appMutations.activeRootMenu(rootMenu.fullPath)

      return true
    },
    setActiveMenu(navMode = appGetters.navMode, route = this.$route, needReset = true) {
      // 只有在混合导航模式下才将当前激活的顶部菜单认为是当前菜单
      if (navMode === 'mix') {
        this.activeMenu = appGetters.activeRootMenu
      }
      // 否则按照路由配置项设置
      else this.activeMenu = getRouterActiveMenu(route)

      needReset && this.resetActiveMenu()
    },

    // 点击菜单时触发
    onSelect(index) {
      // 混合导航模式下点击的必是根节点
      if (appGetters.navMode === 'mix') {
        return this.onSelectRootMenu(index)
      }

      this.actionOnSelectMenu(index)
    },
    onSelectRootMenu(index) {
      const root = getMenuByFullPath(index)

      // vue-router中对应index的路由可能有子级且未设置redirect，此时访问index会404
      const { leaf, hasOtherLeaf } = findFirstLeaf(root)

      // 如果该根节点已激活且有多个叶子节点，退出
      if (!leaf || appGetters.activeRootMenu === index && hasOtherLeaf) {
        return
      }

      this.actionOnSelectMenu(leaf.fullPath)
    },

    // 获取el-menu的dom
    getMenuEl() {
      return this.$el
    },
    // 创建一个用于获取宽度的菜单，若已创建，则更新其菜单
    genGhostMenu() {
      if (Reflect.has(this, '$_ghostMenu')) {
        this.$_ghostMenu.menus = this.menus
        return
      }

      const ctor = Vue.extend(GhostMenu)
      const instance = new ctor({ data: { menus: this.menus } })
      instance.$watch('menuItemSizes', value => {
        this.$menuItemSizes = value
        this.resize()
      })
      instance.$mount()
      this.$_ghostMenu = instance
    },
    // 移除辅助菜单
    destroyGhostMenu() {
      Reflect.has(this, '$_ghostMenu') && this.$_ghostMenu.$destroy()
    },
    // 设置'...'菜单的宽度，只在mounted时调用一次
    setOverflowedIndicatorWidth() {
      const ul = document.createElement('ul')

      ul.className = 'el-menu--horizontal el-menu el-menu--horizontal'
      ul.style.position = 'fixed'
      ul.style.top = '-100px'
      ul.style.right = '-1000px'
      ul.innerHTML = `<li class="el-submenu"><div class="el-submenu__title"><span>...</span></div></li>`

      document.body.appendChild(ul)

      this.$overflowedIndicatorWidth = ul.children[0].offsetWidth + 1

      document.body.removeChild(ul)
    },

    resize() {
      const width = this.getMenuEl().getBoundingClientRect().width
      const { $menuItemSizes, $overflowedIndicatorWidth } = this

      let lastVisibleIndex = -1

      for (let i = $menuItemSizes.length - 1, sum = 0; i >= 0; i--) {
        sum += $menuItemSizes[i]

        if (sum + $overflowedIndicatorWidth > width) {
          break
        }

        lastVisibleIndex += 1

        if (lastVisibleIndex === $menuItemSizes.length - 1) {
          lastVisibleIndex = undefined
          break
        }
      }

      this.lastVisibleIndex = lastVisibleIndex
    },
    startObserver() {
      this.resizeObserver = new window.ResizeObserver(this.resize)
      this.resizeObserver.observe(this.getMenuEl())
    },
    stopObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect()
        delete this.resizeObserver
      }
      this.destroyGhostMenu()
    }
  },

  created() {
    // 各个第一级菜单节点的宽度，取ghost-menu中的值
    this.$menuItemSizes = []
    // ...指示器的宽度
    this.$overflowedIndicatorWidth = 0

    // 菜单加载完成后重设高亮菜单
    this.$watch(() => appGetters.loadingMenu, loading => {
      // 等待nav-menu渲染完成，否则resetActiveMenu无法执行成功
      !loading && this.$nextTick(() => {
        const route = this.$route
        if (this.setActiveRootMenu(route)) {
          this.setActiveMenu(appGetters.navMode, route)
        }
      })
    })
  },

  mounted() {
    this.$nextTick(() => {
      this.setOverflowedIndicatorWidth()
    })
  },

  beforeDestroy() {
    this.stopObserver()
  },

  render() {
    if (appGetters.loadingMenu) {
      return (
        <div style="position: relative;width: 100%;height: 100%">
          <LoadingSpinner />
        </div>
      )
    }

    if (this.menus.length === 0) return

    this.genGhostMenu()

    return (
      <NavMenu
        ref="nav-menu"
        menus={this.realMenus}
        theme={headerGetters.theme}
        mode="horizontal"
        default-active={this.defaultActive}
        show-collapse-icon={headerGetters.showCollapseIcon}
        menu-icon-slot={headerGetters.menuIconSlot}
        menu-content-slot={headerGetters.menuContentSlot}
        on-select={this.onSelect}
      />
    )
  }
}
</script>
