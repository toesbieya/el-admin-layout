<script>
//TODO header会在head-menu渲染后再次渲染，初步排查是head-menu中的activeMenu改变所致
import {appGetters, headerGetters} from "el-admin-layout"
import HeadMenu from "./HeadMenu"
import Logo from "el-admin-layout/src/component/Logo"
import Hamburger from 'el-admin-layout/src/component/Hamburger'
import {refreshPage} from "el-admin-layout/src/helper"
import {isEmpty} from "el-admin-layout/src/util"

export default {
    name: 'Header',

    components: {HeadMenu, Logo, Hamburger},

    methods: {
        //左侧logo
        renderLogo() {
            //渲染顶栏logo的条件
            //①桌面端
            //②设置了显示logo
            //③导航模式为顶部导航或页面为上下结构
            const renderLogo = !appGetters.isMobile
                && appGetters.showLogo
                && (appGetters.navMode === 'head' || appGetters.struct === 'top-bottom')
            return renderLogo && <logo show-title/>
        },
        //左侧汉堡包
        renderHamburger() {
            //移动端时必须渲染，不然侧边栏怎么出来
            return appGetters.isMobile && <hamburger class="header-item header-icon"/>
        },
        //中间的导航菜单
        renderHeadMenu() {
            //渲染顶部导航菜单的条件
            //①桌面端
            //②导航模式为顶部导航或混合导航
            const renderHeadMenu = !appGetters.isMobile && ['head', 'mix'].includes(appGetters.navMode)

            return renderHeadMenu && <head-menu ref="head-menu"/>
        },
        //右侧刷新按钮
        renderRefreshBtn() {
            //这里为了可读性，不再将click事件放到外面
            return (
                <div title="刷新" class="header-item" on-click={() => refreshPage(this.$router)}>
                    <i class="el-icon-refresh-right header-icon"/>
                </div>
            )
        },
        //右侧下拉菜单
        renderUserDropdown() {
            const {dropdownItems} = this.$scopedSlots
            const {username} = headerGetters

            return (
                <el-dropdown class="header-item">
                    <div class="user-dropdown-reference">
                        <el-avatar size={30} src={headerGetters.avatar} icon="el-icon-user-solid"/>
                        {!isEmpty(username) && <span class="username hide-on-mobile">{username}</span>}
                    </div>

                    <el-dropdown-menu
                        slot="dropdown"
                        class={`header-dropdown ${headerGetters.theme}`}
                        visible-arrow={false}
                    >
                        {dropdownItems
                            ? dropdownItems()
                            : headerGetters.dropdownItems.map(item => (
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

        /*顶栏的左、中、右三部分内容*/
        renderLeftContent() {
            const defaultContent = [this.renderLogo(), this.renderHamburger()]
            const {left} = this.$scopedSlots

            return left ? left(defaultContent) : defaultContent
        },
        renderCenterContent() {
            const defaultContent = [this.renderHeadMenu()]
            const {center} = this.$scopedSlots

            return center ? center(defaultContent) : defaultContent
        },
        renderRightContent() {
            const defaultContent = [this.renderRefreshBtn(), this.renderUserDropdown()]
            const {right} = this.$scopedSlots

            return right ? right(defaultContent) : defaultContent
        }
    },

    render() {
        return (
            <header class={`header ${headerGetters.theme}`}>
                <div class="header-left">
                    {this.renderLeftContent()}
                </div>

                <div class="header-center">
                    {this.renderCenterContent()}
                </div>

                <div class="header-right">
                    {this.renderRightContent()}
                </div>
            </header>
        )
    }
}
</script>
