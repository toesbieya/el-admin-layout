<script lang="jsx">
import menuMixin from 'el-admin-layout/src/mixin/menu'
import { appGetters, asideGetters } from 'el-admin-layout'
import NavMenu from 'el-admin-layout/src/component/NavMenu'
import Hamburger from 'el-admin-layout/src/component/Hamburger'
import { getRouterActiveMenu, isRedirectRouter } from 'el-admin-layout/src/config/logic'

export default {
  name: 'OldQiniuSidebarSub',

  mixins: [menuMixin],

  components: { NavMenu, Hamburger },

  computed: {
    // 父级菜单
    rootMenu() {
      const active = appGetters.activeRootMenu
      return appGetters.menus.find(i => i.fullPath === active)
    },

    // 侧边栏菜单
    menus() {
      const root = this.rootMenu
      return root ? root.children || [] : []
    },

    // 侧边栏的折叠状态，true折叠、false展开
    collapse() {
      return asideGetters.collapse
    },

    className() {
      return { 'sub-sidebar': true, 'collapse': this.collapse }
    }
  },

  watch: {
    $route: {
      immediate: true,
      handler(to) {
        if (isRedirectRouter(to)) return

        this.activeMenu = getRouterActiveMenu(this.$route)

        const menu = this.$_getElMenuInstance()
        if (!menu) return
        const item = menu.items[this.activeMenu]

        // 如果侧边栏中没有对应的激活菜单，则收起全部，退出
        if (!item) return menu.openedMenus = []

        // 由于elMenu的initOpenedMenu()不会触发select事件，所以选择手动触发
        this.onSelect(item.index, item.indexPath, item, false)

        // 滚动至激活的菜单
        this.$nextTick(this.moveToActiveMenuVertically)
      }
    }
  },

  methods: {
    // 模拟选中菜单
    onSelect(index, indexPath, item, jump = true) {
      // 开启手风琴模式时，激活没有子级的菜单时收起其它展开项
      if (asideGetters.uniqueOpen && indexPath.length === 1) {
        const menu = this.$_getElMenuInstance()
        const opened = menu.openedMenus
        opened.forEach(i => i !== index && menu.closeMenu(i))
      }

      jump && this.actionOnSelectMenu(index)
    },

    // 将当前激活的菜单移动到视窗中
    moveToActiveMenuVertically() {
      const menu = this.$_getElMenuInstance()
      if (!menu) return

      const cur = menu.activeIndex
      if (!cur) return

      const curInstance = menu.items[cur]
      if (!curInstance) return

      let el = curInstance.$el

      // 当侧边栏折叠时，需要滚动至可视区域的元素是激活菜单的最顶层父节点
      if (menu.collapse) {
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
    }
  },

  render() {
    if (this.menus.length === 0) return

    return (
      <div class={this.className}>
        {!this.collapse && (
          <div class="sub-sidebar-title">
            {this.rootMenu && this.rootMenu.meta.title}
          </div>
        )}

        <nav-menu
          ref="nav-menu"
          menus={this.menus}
          theme={asideGetters.theme}
          collapse={this.collapse}
          default-active={this.activeMenu}
          unique-opened={asideGetters.uniqueOpen}
          show-parent-on-collapse={asideGetters.showParentOnCollapse}
          switch-transition
          switch-transition-name="sidebar"
          inline-indent={26}
          on-select={this.onSelect}
        />

        <div class="sidebar-footer">
          <hamburger/>
        </div>
      </div>
    )
  }
}
</script>
