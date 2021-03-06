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
            activeMenu: '',

            //传递给nav-menu，只会在activeMenu第一次变化时变化
            defaultActive: '',
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

        //el-menu的高亮结果可能有误，所以手动更新
        resetActiveMenu() {
            const elMenu = this.$_getElMenuInstance()
            elMenu && elMenu.updateActiveIndex(this.activeMenu)
        },

        //将defaultActive更新为activeMenu的值，如果两者相同会调用resetActiveMenu()
        //尽量少调用，defaultActive的变化将导致调用方以及nav-menu的重新渲染
        setDefaultActiveMenu() {
            const newVal = this.activeMenu
            const oldVal = this.defaultActive

            //该值变化时，nav-menu会重新渲染来更新高亮菜单
            this.defaultActive = newVal

            //未变化时需要手动更新
            if (oldVal === newVal) {
                this.resetActiveMenu()
            }
        },

        //获取el-menu实例
        $_getElMenuInstance() {
            const navMenu = this.$refs['nav-menu']
            return navMenu && navMenu.$refs['el-menu']
        }
    }
}
