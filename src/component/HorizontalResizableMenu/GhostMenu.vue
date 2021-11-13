<script>
/**
 * 用于计算顶栏菜单的宽度
 * 由nav-menu简化而来，仅保留第一级菜单以及必要属性
 */

import SubMenu from '../../component/ElMenu/sub'
import NavMenu from '../../component/NavMenu'
import { headerGetters, mapGetters } from '../../store'

export default {
  name: 'GhostMenu',

  data() {
    return {
      // 外部菜单数据
      menus: [],
      // 各个第一级菜单节点的宽度
      menuItemSizes: []
    }
  },

  computed: {
    ...mapGetters(headerGetters, [
      'theme',
      'showCollapseIcon',
      'menuIconSlot',
      'menuContentSlot'
    ]),
    menuClass() {
      return [
        'el-menu--horizontal',
        `el-menu--${this.theme}`,
        !this.showCollapseIcon && 'hide-collapse-icon'
      ]
    }
  },

  methods: {
    renderMenuIcon: NavMenu.methods.renderMenuIcon,
    renderMenuContent: NavMenu.methods.renderMenuContent,
    renderSingleMenu: NavMenu.methods.renderSingleMenu,
    // 渲染有子级的菜单
    renderSubMenu(h, menu, depth) {
      const { fullPath } = menu

      return (
        <SubMenu key={fullPath} index={fullPath}>
          <template slot="title">
            {this.renderMenuIcon(h, menu, depth)}
            {this.renderMenuContent(h, menu, depth)}
          </template>
        </SubMenu>
      )
    },
    // 渲染菜单项
    renderMenus(h, menus, depth = 1) {
      return menus.map(menu => {
        return Array.isArray(menu.children)
          ? this.renderSubMenu(h, menu, depth)
          : this.renderSingleMenu(h, menu, depth)
      })
    },

    resize() {
      const ul = this.$el
      if (!ul) return

      const menuItemNodes = ul.children
      if (!menuItemNodes || menuItemNodes.length === 0) return

      this.menuItemSizes = Array.from(menuItemNodes).map(i => i.getBoundingClientRect().width)
    }
  },

  mounted() {
    const dom = this.$el
    dom.style.position = 'fixed'
    dom.style.bottom = '-1000px'
    dom.style.right = '-1000px'
    dom.style.width = 'auto'
    document.body.appendChild(dom)

    this.resizeObserver = new window.ResizeObserver(this.resize)
    this.resizeObserver.observe(dom)

    this.$once('hook:beforeDestroy', () => {
      this.$el && document.body.removeChild(this.$el)
      if (Reflect.has(this, '$_resizeObserver')) {
        this.$_resizeObserver.disconnect()
        delete this.$_resizeObserver
      }
    })
  },

  render(h) {
    const children = this.renderMenus(h, this.menus)
    return h('el-menu', { class: this.menuClass, props: { mode: 'horizontal' } }, children)
  }
}
</script>
