import {asideGetters} from "el-admin-layout"
import hamburgerMixin from 'el-admin-layout/src/mixin/hamburger'
import menuMixin from "el-admin-layout/src/mixin/menu"
import menuSearchMixin from './menuSearch'
import NavMenu from 'el-admin-layout/src/component/NavMenu'
import {getSidebarMenus} from "el-admin-layout/src/store/app"
import {getRouterActiveMenu, isRedirectRouter} from "el-admin-layout/src/config/logic"

export default {
    inheritAttrs: false,

    mixins: [hamburgerMixin, menuMixin, menuSearchMixin],

    components: {NavMenu},

    computed: {
        //侧边栏菜单
        menus: getSidebarMenus
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

                //如果侧边栏中没有对应的激活菜单，则收起全部，退出
                if (!item) return menu.openedMenus = []

                //由于elMenu的initOpenedMenu()不会触发select事件，所以选择手动触发
                this.onSelect(item.index, item.indexPath, item, false)

                //滚动至激活的菜单
                this.$nextTick(this.moveToActiveMenuVertically)
            }
        }
    },

    methods: {
        //模拟选中菜单
        onSelect(index, indexPath, item, jump = true) {
            //开启手风琴模式时，激活没有子级的菜单时收起其它展开项
            if (asideGetters.uniqueOpen && indexPath.length === 1) {
                const menu = this.$_getElMenuInstance()
                const opened = menu.openedMenus
                opened.forEach(i => i !== index && menu.closeMenu(i))
            }

            jump && this.actionOnSelectMenu(index)

            //为了兼容OnePart
            this.afterSelect && this.afterSelect()
        },

        //将当前激活的菜单移动到视窗中
        moveToActiveMenuVertically() {
            const menu = this.$_getElMenuInstance()
            if (!menu) return

            const cur = menu.activeIndex
            if (!cur) return

            const curInstance = menu.items[cur]
            if (!curInstance) return

            let el = curInstance.$el

            //当侧边栏折叠时，需要滚动至可视区域的元素是激活菜单的最顶层父节点
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
            window.setTimeout(() => el.scrollIntoView({behavior: 'smooth', block: 'nearest'}), 300)
        },
    }
}
