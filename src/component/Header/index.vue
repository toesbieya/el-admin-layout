<script type="jsx">
import {appGetters, headerGetters} from "el-admin-layout"
import HeadMenu from "./HeadMenu"
import Logo from "el-admin-layout/src/component/Logo"
import Hamburger from 'el-admin-layout/src/component/Hamburger'
import {refreshPage} from "el-admin-layout/src/helper"

export default {
    name: 'Header',

    components: {HeadMenu, Logo, Hamburger},

    props: {
        //头像地址
        avatar: String,
        //用户名称
        username: String,
        //自定义下拉菜单项，{icon:图标, content:菜单内容, handler:点击时触发的方法}
        userDropdownItems: {type: Array, default: () => []},
        //自定义右侧元素的函数，会传入默认的VNode数组
        renderCustomActions: Function
    },

    computed: {
        //渲染顶栏logo的条件
        //①桌面端
        //②设置了显示logo
        //③导航模式为顶部导航或页面为上下结构
        renderLogo() {
            return !appGetters.isMobile
                && appGetters.showLogo
                && (appGetters.navMode === 'head' || appGetters.struct === 'top-bottom')
        },

        //渲染顶部导航菜单的条件
        //①桌面端
        //②导航模式为顶部导航或混合导航
        renderHeadMenu() {
            return !appGetters.isMobile && ['head', 'mix'].includes(appGetters.navMode)
        },

        className() {
            return `header ${headerGetters.theme}`
        }
    },

    methods: {
        clickRefreshBtn() {
            refreshPage(this.$router)
        },

        renderRefreshBtn() {
            return (
                <div title="刷新" class="header-item" on-click={this.clickRefreshBtn}>
                    <i class="el-icon-refresh-right header-icon"/>
                </div>
            )
        },
        renderUserDropdown() {
            const {dropdownItem} = this.$scopedSlots

            return (
                <el-dropdown class="header-item">
                    <div class="avatar-wrapper">
                        <el-avatar size={30} src={this.avatar} icon="el-icon-user-solid"/>
                        <span class="hide-on-mobile">{this.username}</span>
                    </div>

                    <el-dropdown-menu
                        slot="dropdown"
                        class={`header-dropdown ${headerGetters.theme}`}
                        visible-arrow={false}
                    >
                        {dropdownItem
                            ? dropdownItem()
                            : this.userDropdownItems.map(item => (
                                <el-dropdown-item
                                    icon={item.icon}
                                    {...{nativeOn: {click: item.handler}}}
                                >
                                    {item.content}
                                </el-dropdown-item>
                            ))}
                    </el-dropdown-menu>
                </el-dropdown>
            )
        },
        renderActions() {
            const defaultActions = [this.renderRefreshBtn, this.renderUserDropdown]
            const {action} = this.$scopedSlots

            return action
                ? action() //这里不传defaultActions时因为template中用不了VNode
                : typeof this.renderCustomActions == 'function'
                    ? this.renderCustomActions(defaultActions)
                    : defaultActions.map(i => i())
        }
    },

    render() {
        return (
            <header class={this.className}>
                {this.renderLogo && <logo show-title/>}

                {/*移动端时必须渲染汉堡包，不然侧边栏怎么出来*/}
                {appGetters.isMobile && <hamburger class="header-item header-icon"/>}

                <div style="flex: 1">
                    {this.renderHeadMenu && <head-menu/>}
                </div>

                <div>
                    {this.renderActions()}
                </div>
            </header>
        )
    }
}
</script>
