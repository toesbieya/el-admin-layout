<script type="jsx">
import hamburgerMixin from 'el-admin-layout/src/mixin/hamburger'
import HeadMenu from "./HeadMenu"
import {appGetters, navbarGetters, pageGetters} from "el-admin-layout"
import Logo from "el-admin-layout/src/component/Logo"
import {refreshPage} from "el-admin-layout/src/helper"

export default {
    name: 'navbar',

    mixins: [hamburgerMixin],

    components: {HeadMenu, Logo},

    props: {
        //头像地址
        avatar: String,
        //用户名称
        username: String,
        //自定义下拉菜单项，{icon:图标, command:el-dropdown-menu-item的属性, content:菜单内容, hideOnMobile:当移动端时是否隐藏, handler:点击时触发的方法}
        userDropdownItems: {
            type: Array,
            default: () => []
        },
        //自定义右侧元素，会传入默认的vnode数组
        renderCustomActions: Function,
        //传递给head-menu的props
        headMenuProps: Object
    },

    computed: {
        //渲染导航栏logo的条件
        //①桌面端
        //②设置了显示logo
        //③导航模式为顶部导航或页面为上下结构
        renderLogo() {
            return !appGetters.isMobile
                && pageGetters.showLogo
                && (appGetters.navMode === 'head' || pageGetters.position === 'top-bottom')
        },

        //渲染顶部导航菜单的条件
        //①桌面端
        //②导航模式为顶部导航或混合导航
        renderHeadMenu() {
            return !appGetters.isMobile && ['head', 'mix'].includes(appGetters.navMode)
        },

        className() {
            return `navbar ${navbarGetters.theme}`
        },

        menuProps() {
            return Object.assign({alwaysShow: true}, this.headMenuProps, {theme: navbarGetters.theme})
        }
    },

    methods: {
        clickRefreshBtn() {
            refreshPage(this.$router)
        },

        renderRefreshBtn() {
            return (
                <div title="刷新" class="navbar-item" on-click={this.clickRefreshBtn}>
                    <i class="el-icon-refresh-right navbar-icon"/>
                </div>
            )
        },
        renderUserDropdown() {
            const items = this.userDropdownItems
            const onCommand = command => {
                const item = items.find(i => i.command === command)
                item && item.handler()
            }

            return (
                <el-dropdown class="navbar-item" on-command={onCommand}>
                    <div class="avatar-wrapper">
                        <el-avatar size={30} src={this.avatar} icon="el-icon-user-solid"/>
                        <span class="hide-on-mobile">{this.username}</span>
                    </div>

                    <el-dropdown-menu
                        slot="dropdown"
                        class={navbarGetters.theme}
                        visible-arrow={false}
                    >
                        {
                            items.map(item => (
                                <el-dropdown-item
                                    icon={item.icon}
                                    class={item.hideOnMobile && 'hide-on-mobile'}
                                    command={item.command}
                                >
                                    {item.content}
                                </el-dropdown-item>
                            ))
                        }
                    </el-dropdown-menu>
                </el-dropdown>
            )
        },
        renderActions() {
            const defaultActions = [this.renderRefreshBtn(), this.renderUserDropdown()]

            return typeof this.renderCustomActions == 'function'
                ? this.renderCustomActions(defaultActions)
                : defaultActions
        }
    },

    render() {
        return (
            <nav class={this.className}>
                {this.renderLogo && <logo show-title/>}

                {this.renderHamburger && <hamburger class="navbar-item navbar-icon"/>}

                <div style="flex: 1">
                    {this.renderHeadMenu && <head-menu {...{attrs: this.menuProps}}/>}
                </div>

                <div ref="navbar-actions">
                    {this.renderActions()}
                </div>
            </nav>
        )
    }
}
</script>
