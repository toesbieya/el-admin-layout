<script type="jsx">
import hamburgerMixin from '../../mixin/hamburger'
import HeadMenu from "./HeadMenu"
import {appGetters, navbarGetters, pageGetters} from "../../store"
import Logo from "../../component/Logo"
import {refreshPage} from "../../util"

export default {
    name: 'navbar',

    mixins: [hamburgerMixin],

    components: {HeadMenu, Logo},

    props: {
        //用户信息，{avatar:头像地址, name:用户名称}
        user: {
            type: Object,
            default: () => ({avatar: '', name: 'user'})
        },
        //自定义下拉菜单项，{icon:图标, command:el-dropdown-menu-item的属性, content:菜单内容, hideOnMobile:当移动端时是否隐藏, handler:点击时触发的方法}
        userDropdownItems: {
            type: Array,
            default: () => []
        },
        //自定义右侧元素，会传入默认的vnode数组
        renderCustomActions: Function
    },

    data() {
        return {
            guideSteps: [
                {
                    element: '.setting-btn.navbar-item',
                    content: '这是个性设置按钮，可以根据自己喜好进行一些设置',
                },
                {
                    element: '.navbar .el-dropdown.navbar-item',
                    content: '这是用户中心',
                },
                {
                    element: '.tags-view-container',
                    content: `<p>这是tab栏，可以右键tab页进行相关操作</p>
                              <p>ctrl + ← → 可以进行tab页的左右切换</p>
                              <p>当tab过多时通过鼠标滚轮来滚动</p>
                              <p>双击可以关闭</p>`,
                },
            ]
        }
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
        }
    },

    methods: {
        clickRefreshBtn() {
            refreshPage(this.$route, this.$router)
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
                        <el-avatar size={30} src={this.user.avatar} icon="el-icon-user-solid"/>
                        <span class="hide-on-mobile">{this.user.name}</span>
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
                    {this.renderHeadMenu && <head-menu always-show theme={navbarGetters.theme}/>}
                </div>

                <div ref="navbar-actions">
                    {this.renderActions()}
                </div>
            </nav>
        )
    }
}
</script>
