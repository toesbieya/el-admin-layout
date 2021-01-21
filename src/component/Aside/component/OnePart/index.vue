<script type="text/jsx">
import {appGetters, asideGetters, asideMutations, pageGetters} from "el-admin-layout"
import Logo from 'el-admin-layout/src/component/Logo'
import sidebarMixin from '../../mixin/sidebar'

export default {
    name: "Sidebar",

    mixins: [sidebarMixin],

    components: {Logo},

    data() {
        return {
            //开启了自动隐藏时，判断鼠标是否在侧边栏外
            mouseOutside: true,
            //开启了自动隐藏时，用于判断鼠标是否在弹出菜单内
            openedMenuNum: 0
        }
    },

    computed: {
        isMobile: () => appGetters.isMobile,

        //当是移动端或设置了侧边栏自动隐藏时将侧边栏用抽屉包裹
        renderInDrawer() {
            return this.isMobile || asideGetters.autoHide
        },
        //el-drawer的自定义类名
        drawerClass() {
            return this.isMobile || pageGetters.position !== 'top-bottom'
                ? undefined
                : 'behind-header'
        },

        //侧边栏的显隐状态，true显示、false隐藏
        show() {
            //store中要显示那就显示
            if (asideGetters.show) return true

            //移动端，false
            if (this.isMobile) return false

            //未设置侧边栏自动隐藏，false
            if (!asideGetters.autoHide) return false

            //鼠标在侧边栏内，true
            if (!this.mouseOutside) return true

            //侧边栏处于折叠状态 且 存在弹出的子菜单，true
            return this.collapse && this.openedMenuNum > 0
        },

        //侧边栏的折叠状态，true折叠、false展开，仅在pc端可折叠
        collapse() {
            return asideGetters.collapse && !this.isMobile
        },

        //判断是否需要绑定鼠标移动的事件
        shouldBindMouseMoveEvent() {
            //如果是移动端，false
            if (this.isMobile) return false

            //如果未启用侧边栏自动隐藏，false
            if (!asideGetters.autoHide) return false

            //侧边栏为打开状态，false
            if (this.show) return false

            //鼠标在侧边栏外部，true
            return this.mouseOutside
        },

        //是否需要显示logo
        showLogo() {
            return pageGetters.showLogo && (this.isMobile || pageGetters.position === 'left-right')
        },

        //是否需要显示搜索框
        renderMenuSearch() {
            return !this.isMobile && asideGetters.search
        },

        className() {
            return {'sidebar': true, 'collapse': this.collapse}
        }
    },

    watch: {
        //切换至移动端时收起侧边栏
        isMobile(v) {
            v && asideMutations.close()
        },

        //添加或移除鼠标移动事件
        shouldBindMouseMoveEvent: {
            immediate: true,
            handler(v) {
                //尝试移除之前可能添加的事件
                window.removeEventListener('mousemove', this.moveEvent)

                v && window.addEventListener('mousemove', this.moveEvent)
            }
        }
    },

    methods: {
        //激活菜单后触发
        afterSelect() {
            //抽屉模式下需要关闭抽屉
            if (this.renderInDrawer && this.show) {
                asideMutations.close()
                this.mouseOutside = true
            }
        },

        //开启侧边栏自动隐藏后的鼠标移动事件
        moveEvent(e) {
            //鼠标移动至屏幕左侧边缘时，标识鼠标在侧边栏内部
            if (e.clientX <= 1) this.mouseOutside = false
        },

        //渲染el-menu时监听其展开菜单
        watchOpenedMenus() {
            //尝试取消之前设置的监听
            if (this.watchOpenedMenusCallback) {
                this.watchOpenedMenusCallback()
                this.watchOpenedMenusCallback = null
            }

            const menu = this.$_getElMenuInstance()
            if (!menu) return

            this.watchOpenedMenusCallback = menu.$watch('openedMenus', v => {
                this.openedMenuNum = v.length
            })
        },

        //抽屉打开的过渡动画结束时，滚动至高亮菜单
        onDrawerOpened() {
            this.$nextTick(this.moveToActiveMenuVertically)
        }
    },

    beforeDestroy() {
        window.removeEventListener('mousemove', this.moveEvent)
    },

    render() {
        if (this.menus.length <= 0) return

        const aside = (
            <div
                class={this.className}
                on-mouseleave={() => this.mouseOutside = true}
                on-mouseenter={() => this.mouseOutside = false}
            >
                {this.showLogo && <logo show-title={!this.collapse}/>}

                {this.renderMenuSearch && <menu-search on-search={this.handlerSearch}/>}

                <nav-menu
                    ref="nav-menu"
                    menus={this.menus}
                    theme={asideGetters.theme}
                    collapse={this.collapse}
                    default-active={this.activeMenu}
                    unique-opened={asideGetters.uniqueOpen}
                    show-parent-on-collapse={asideGetters.showParentOnCollapse}
                    {...{props: this.$attrs}}
                    on={{'select': this.onSelect, 'hook:mounted': this.watchOpenedMenus}}
                />

                {!this.renderInDrawer && this.renderHamburger && <hamburger/>}
            </div>
        )

        if (this.renderInDrawer) {
            return (
                <el-drawer
                    visible={this.show}
                    with-header={false}
                    custom-class={this.drawerClass}
                    modal={this.isMobile} //设置自动隐藏时不使用遮罩
                    direction="ltr"
                    size="auto"
                    on-close={asideMutations.close}
                    on-opened={this.onDrawerOpened}
                >
                    {aside}
                </el-drawer>
            )
        }

        return aside
    }
}
</script>
