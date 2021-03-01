/**
 * 顶部菜单和侧边栏菜单的公共混入
 */
import {refreshPage} from "../helper"
import {getRouterKey} from "../config/logic"

export default {
    data() {
        return {
            //当前激活的菜单的fullPath
            //之所以手动维护是因为el-menu在点击后就会设置activeIndex
            activeMenu: ''
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

            const {route} = this.$router.resolve(menuIndex)

            if (route.matched.length === 0) {
                console.warn(`点击菜单时出错，'${menuIndex}'没有对应的路由`)
                return this.resetActiveMenu()
            }

            //触发的菜单会跳转到当前路由时，根据参数判断是否进行刷新
            getRouterKey(this.$route) === getRouterKey(route)
                ? refreshWhenSame && refreshPage(this.$router)
                : this.$router.push(route)
        },

        //由于侧边栏菜单数组更新后，el-menu不一定会更新（当数组中不存在单级菜单时）
        //所以手动更新el-menu的当前高亮菜单
        resetActiveMenu() {
            const menu = this.$_getElMenuInstance()
            menu && menu.updateActiveIndex(this.activeMenu)
        },

        //获取el-menu实例
        $_getElMenuInstance() {
            const navMenu = this.$refs['nav-menu']
            return navMenu && navMenu.$refs['el-menu']
        }
    }
}
