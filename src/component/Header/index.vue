<script>
//TODO header会在head-menu渲染后再次渲染，初步排查是head-menu中的activeMenu改变所致
import {appGetters, headerGetters} from "../../store"
import HeadMenu from "./HeadMenu"
import Logo from "../../component/Logo"
import Hamburger from '../../component/Hamburger'
import {refreshPage} from "../../helper"
import {isEmpty} from "../../util"

export default {
    name: 'Header',

    components: {HeadMenu, Logo, Hamburger},

    computed: {
        //左侧logo
        defaultLogo() {
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
        defaultHamburger() {
            //移动端时必须渲染，不然侧边栏怎么出来
            return appGetters.isMobile && <hamburger class="header-item header-icon"/>
        },
        //中间的导航菜单
        defaultHeadMenu() {
            //渲染顶部导航菜单的条件
            //①桌面端
            //②导航模式为顶部导航或混合导航
            const renderHeadMenu = !appGetters.isMobile && ['head', 'mix'].includes(appGetters.navMode)

            return renderHeadMenu && <head-menu ref="head-menu"/>
        },
        //右侧刷新按钮
        defaultRefreshBtn() {
            //这里为了可读性，不再将click事件放到外面
            return (
                <div title="刷新" class="header-item" on-click={() => refreshPage(this.$router)}>
                    <i class="el-icon-refresh-right header-icon"/>
                </div>
            )
        },
        //右侧下拉菜单，此处使用了$scopedSlots，可能导致更新不及时
        defaultUserDropdown() {
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
    },

    methods: {
        /*顶栏的左、中、右三部分内容*/
        renderLeftContent() {
            const defaultContent = [this.defaultLogo, this.defaultHamburger]
            const {left} = this.$scopedSlots

            return left ? left(defaultContent) : defaultContent
        },
        renderCenterContent() {
            const defaultContent = [this.defaultHeadMenu]
            const {center} = this.$scopedSlots

            return center ? center(defaultContent) : defaultContent
        },
        renderRightContent() {
            const defaultContent = [this.defaultRefreshBtn, this.defaultUserDropdown]
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
