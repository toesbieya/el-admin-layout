<script lang="jsx">
/**
 * 默认的侧边栏实现，支持以抽屉形式渲染
 */

import menuMixin from '../../../mixin/menu'
import { appGetters, asideGetters, asideMutations } from '../../../store'
import Logo from '../../../component/Logo'
import NavMenu from '../../../component/NavMenu'
import Hamburger from '../../../component/Hamburger'
import LoadingSpinner from '../../../component/LoadingSpinner'
import { getRouterActiveMenu, isRedirectRouter } from '../../../config/logic'

export default {
  name: 'DefaultSidebar',

  mixins: [menuMixin],

  data() {
    return {
      // 开启了自动隐藏时，判断鼠标是否在侧边栏外
      mouseOutside: true,
      // 开启了自动隐藏时，用于判断鼠标是否在弹出菜单内
      openedMenuNum: 0
    }
  },

  computed: {
    // 侧边栏菜单
    sidebarMenus() {
      const menus = appGetters.menus
      let finalData

      // 移动端时，侧边栏只会按侧边栏导航模式渲染
      if (appGetters.isMobile) finalData = menus
      else {
        // 只有导航模式为aside或mix时才会渲染侧边栏
        switch (appGetters.navMode) {
          case 'aside':
            finalData = menus
            break
          case 'mix':
            const root = menus.find(i => i.fullPath === appGetters.activeRootMenu)
            finalData = root ? root.children || [] : []
            break
          default:
            finalData = []
        }
      }

      const f = asideGetters.postMenus
      return f ? f(this.copyMenus(finalData)) : finalData
    },

    // 当是移动端或设置了侧边栏自动隐藏时将侧边栏用抽屉包裹
    renderInDrawer() {
      return appGetters.isMobile || asideGetters.autoHide
    },
    // el-drawer的自定义类名
    drawerClass() {
      const behindHeader = !appGetters.isMobile && appGetters.struct === 'top-bottom'
      return `sidebar-drawer${behindHeader ? ' behind-header' : ''}`
    },

    // 侧边栏的显隐状态，true显示、false隐藏
    show() {
      // store中要显示那就显示
      if (asideGetters.show) return true

      // 移动端，false
      if (appGetters.isMobile) return false

      // 未设置侧边栏自动隐藏，false
      if (!asideGetters.autoHide) return false

      // 鼠标在侧边栏内，true
      if (!this.mouseOutside) return true

      // 侧边栏处于折叠状态 且 存在弹出的子菜单，true
      return this.collapse && this.openedMenuNum > 0
    },

    // 侧边栏的折叠状态，true折叠、false展开，仅在pc端可折叠
    collapse() {
      return asideGetters.collapse && !appGetters.isMobile
    },

    // 是否需要显示logo
    showLogo() {
      return appGetters.showLogo && (appGetters.isMobile || appGetters.struct === 'left-right')
    },

    sidebarClass() {
      return { 'sidebar': true, 'collapse': this.collapse }
    },

    // 只有设置了自动隐藏时才需要绑定鼠标的移入移出事件
    sidebarEvent() {
      return !appGetters.isMobile && asideGetters.autoHide
        ? { mouseleave: this.onMouseLeave, mouseenter: this.onMouseEnter }
        : undefined
    }
  },

  watch: {
    // 记录高亮菜单以及一些其他操作
    $route: {
      immediate: true,
      handler(to) {
        if (isRedirectRouter(to)) return

        this.activeMenu = getRouterActiveMenu(this.$route)

        const elMenu = this.$_getElMenuInstance()
        if (!elMenu) return

        this.resetActiveMenu()

        const item = elMenu.items[this.activeMenu]
        if (!item) return

        // 由于elMenu的initOpenedMenu()不会触发select事件，所以选择手动触发
        this.onSelect(item.index, item.indexPath, item, false)

        // 滚动至激活的菜单
        this.$nextTick(this.moveToActiveMenuVertically)
      }
    }
  },

  methods: {
    // 返回传入的菜单数据的拷贝副本
    copyMenus(menus) {
      return menus.map(menu => {
        const result = { ...menu }
        if (result.children) {
          result.children = this.copyMenus(result.children)
        }
        return result
      })
    },

    // 模拟选中菜单
    onSelect(index, indexPath, item, jump = true) {
      // 非折叠且开启手风琴模式时，收起其它展开项
      if (!asideGetters.collapse && asideGetters.uniqueOpen) {
        const elMenu = this.$_getElMenuInstance()
        elMenu.openedMenus = indexPath.slice(0, -1)
      }

      jump && this.actionOnSelectMenu(index)

      // 抽屉模式下需要关闭抽屉
      if (this.renderInDrawer && this.show) {
        asideMutations.close()
        this.mouseOutside = true
      }
    },

    // 将当前激活的菜单移动到视窗中
    moveToActiveMenuVertically() {
      const elMenu = this.$_getElMenuInstance()
      if (!elMenu) return

      const cur = elMenu.activeIndex
      if (!cur) return

      const curInstance = elMenu.items[cur]
      if (!curInstance) return

      let el = curInstance.$el

      // 当侧边栏折叠时，需要滚动至可视区域的元素是激活菜单的最顶层父节点
      if (elMenu.collapse) {
        let rootParent = curInstance
        while (rootParent.$parent.$options.componentName !== 'ElMenu') {
          rootParent = rootParent.$parent
        }
        el = rootParent.$el
      }

      /*
      * 这里考虑了菜单展开时的200ms动画时间
      * 为什么不分情况讨论？比如当subMenu已经是展开状态时，无需延时滚动
      * 但这种情况无法判断，因为这时menu.openedMenus已经包含了subMenu，无论subMenu之前是否展开
      * 所以统一延时300ms
      * */
      window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300)
    },

    // 开启侧边栏自动隐藏后的鼠标移动事件
    onMouseMove(e) {
      // 鼠标移动至屏幕左侧边缘时，标识鼠标在侧边栏内部
      if (e.clientX <= 1) this.mouseOutside = false
    },
    onMouseLeave() {
      this.mouseOutside = true
    },
    onMouseEnter() {
      this.mouseOutside = false
    },

    // 渲染el-menu时监听其展开菜单
    watchOpenedMenus() {
      // 尝试取消之前设置的监听
      if (this.watchOpenedMenusCallback) {
        this.watchOpenedMenusCallback()
        this.watchOpenedMenusCallback = null
      }

      const elMenu = this.$_getElMenuInstance()
      if (!elMenu) return

      this.watchOpenedMenusCallback = elMenu.$watch('openedMenus', v => {
        this.openedMenuNum = v.length
      })
    },

    // 抽屉打开的过渡动画结束时，滚动至高亮菜单
    onDrawerOpened() {
      this.$nextTick(this.moveToActiveMenuVertically)
    },

    renderHeader(h) {
      const defaultContent = this.showLogo && <Logo show-title={!this.collapse}/>
      const { headerSlot } = asideGetters

      return headerSlot ? headerSlot(h, defaultContent) : defaultContent
    },
    renderFooter(h) {
      const defaultContent = asideGetters.showHamburger && !this.renderInDrawer && <Hamburger/>
      const { footerSlot } = asideGetters

      let children

      if (footerSlot) {
        let renderResult = footerSlot(h, defaultContent)
        if (Array.isArray(renderResult)) {
          renderResult = renderResult.filter(Boolean)
          if (renderResult.length > 0) {
            children = renderResult
          }
        }
        else children = renderResult
      }
      else children = defaultContent

      return children && (
        <div class="sidebar-footer">
          {children}
        </div>
      )
    }
  },

  created() {
    // 侧边栏菜单变化时设置当前的高亮菜单
    // 在此前，activeMenu会在watch:$route中发生第一次变化（不会真有人把menu.meta.activeMenu设成''吧？）
    this.$watch('sidebarMenus', this.setDefaultActiveMenu, { immediate: true })

    // 添加或移除鼠标移动事件
    this.$watch(
      () => {
        // 如果是移动端，false
        if (appGetters.isMobile) return false

        // 如果未启用侧边栏自动隐藏，false
        if (!asideGetters.autoHide) return false

        // 侧边栏为打开状态，false
        if (this.show) return false

        // 鼠标在侧边栏外部，true
        return this.mouseOutside
      },
      v => {
        // 尝试移除之前可能添加的事件
        window.removeEventListener('mousemove', this.onMouseMove)

        v && window.addEventListener('mousemove', this.onMouseMove)
      },
      { immediate: true }
    )

    // 切换至移动端 或 切换至桌面端且设置了自动隐藏时，收起侧边栏
    this.$watch(
      () => appGetters.isMobile,
      v => (v || asideGetters.autoHide) && asideMutations.close()
    )
  },

  beforeDestroy() {
    window.removeEventListener('mousemove', this.onMouseMove)
  },

  render(h) {
    // 没有菜单时，仅当设置了alwaysRender才退出后续渲染
    if (this.sidebarMenus.length === 0 && !asideGetters.alwaysRender) {
      return
    }

    const sidebar = (
      <div {...{ class: this.sidebarClass, on: this.sidebarEvent }}>
        {this.renderHeader(h)}

        {appGetters.loadingMenu
          ? (
            <div style="position: relative;flex: 1">
              <LoadingSpinner/>
            </div>
          )
          : <NavMenu
            ref="nav-menu"
            menus={this.sidebarMenus}
            collapse={this.collapse}
            default-active={this.defaultActive}
            default-openeds={asideGetters.defaultOpeneds}
            theme={asideGetters.theme}
            unique-opened={asideGetters.uniqueOpen}
            show-parent-on-collapse={asideGetters.showParentOnCollapse}
            inline-indent={asideGetters.inlineIndent}
            switch-transition-name={asideGetters.switchTransitionName}
            menu-icon-slot={asideGetters.menuIconSlot}
            menu-content-slot={asideGetters.menuContentSlot}
            {...{
              // 只能在nav-menu的mounted里，自身mounted时nav-menu可能还未渲染
              on: { select: this.onSelect, 'hook:mounted': this.watchOpenedMenus }
            }}
          />
        }

        {this.renderFooter(h)}
      </div>
    )

    if (!this.renderInDrawer) return sidebar

    return (
      <el-drawer
        visible={this.show}
        with-header={false}
        custom-class={this.drawerClass}
        modal={appGetters.isMobile} // 设置自动隐藏时不使用遮罩
        direction="ltr"
        size="auto"
        on-close={asideMutations.close}
        on-opened={this.onDrawerOpened}
      >
        {sidebar}
      </el-drawer>
    )
  }
}
</script>
