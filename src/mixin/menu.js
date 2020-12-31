/**
 * 顶部菜单和侧边栏菜单的公共混入
 */
import {refreshPage} from "el-admin-layout/src/helper"

export default {
    data() {
        return {
            //当前激活的菜单的fullPath
            //之所以手动维护是因为el-menu在点击后就会设置activeIndex
            activeMenu: '',

            //用于判断鼠标是否在弹出菜单内
            openedMenuNum: 0
        }
    },

    methods: {
        //点击菜单后的动作
        actionOnSelectMenu(menuIndex, refreshWhenSame = true) {
            //外部链接时打开新窗口
            if (menuIndex.startsWith('http')) {
                window.open(menuIndex)
                return this.resetActiveMenu()
            }

            //触发的菜单路径是当前路由时，根据参数判断是否进行刷新
            this.$route.path === menuIndex
                ? refreshWhenSame && refreshPage(this.$route, this.$router)
                : this.$router.push(menuIndex)
        },

        //由于侧边栏菜单数组更新后，el-menu不一定会更新（当数组中不存在单级菜单时）
        //所以手动更新el-menu的当前高亮菜单
        resetActiveMenu() {
            const menu = this.$_getElMenuInstance()
            menu && menu.updateActiveIndex(this.activeMenu)
        },

        //将当前激活的菜单移动到视窗中（仅垂直菜单可使用）
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

        //获取el-menu实例
        $_getElMenuInstance() {
            const navMenu = this.$refs['nav-menu']
            return navMenu && navMenu.$refs['el-menu']
        },

        //根据路由获取当前激活的菜单
        getActiveMenuByRoute({path, meta}) {
            return meta.activeMenu || path
        }
    }
}
