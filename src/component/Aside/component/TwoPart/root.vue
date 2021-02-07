<script type="text/jsx">
import rootMenuMixin from "el-admin-layout/src/mixin/rootMenu"
import {appGetters, asideGetters, pageGetters} from "el-admin-layout"
import Logo from 'el-admin-layout/src/component/Logo'

export default {
    name: "RootSidebar",

    mixins: [rootMenuMixin],

    inject: {
        elAdminLayout: {
            default: {
                $scopedSlots: {}
            }
        }
    },

    components: {Logo},

    data() {
        return {
            //是否折叠
            collapse: true,

            //是否点击了菜单
            hasSelectMenu: false
        }
    },

    computed: {
        //Layout中的menuIcon插槽
        menuIconSlot() {
            return this.elAdminLayout.$scopedSlots.menuIcon
        },
        //Layout中的menuIconRenderer属性
        menuIconRenderer() {
            return this.elAdminLayout.menuIconRenderer
        },
        //Layout中的menuItemContent插槽
        menuItemContentSlot() {
            return this.elAdminLayout.$scopedSlots.menuItemContent
        },
        //Layout中的menuItemContentRenderer属性
        menuItemContentRenderer() {
            return this.elAdminLayout.menuItemContentRenderer
        },

        //是否需要显示logo
        showLogo() {
            return pageGetters.showLogo && pageGetters.position === 'left-right'
        },

        sidebarClass() {
            return {'root-sidebar': true, 'collapse': this.collapse}
        },
        menuClass() {
            return `el-menu el-menu--vertical el-menu--${asideGetters.theme}`
        }
    },

    watch: {
        //路由变化时设置高亮菜单
        $route: {
            immediate: true,
            handler(to) {
                if (!this.setActiveRootMenuWhenRouteChange(to)) {
                    return
                }

                //滚动至激活菜单，仅当组件已mounted时继续
                this._isMounted && this.$nextTick(() => {
                    this.$el.scrollIntoView({behavior: 'smooth', block: 'nearest'})
                })
            }
        }
    },

    methods: {
        onSelect(index) {
            this.onSelectRootMenu(index)

            //设置标识位，因为此时折叠菜单时可能会触发onMouseEnter
            this.hasSelectMenu = true

            //只要点击了菜单项就收起
            this.collapse = true
        },
        onMouseLeave() {
            this.collapse = true
            this.hasSelectMenu = false
        },
        onMouseEnter() {
            //如果是onSelect导致的菜单折叠，退出
            if (this.collapse && this.hasSelectMenu) {
                this.hasSelectMenu = false
                return
            }
            this.collapse = false
        },

        //渲染菜单图标
        renderMenuIcon(h, menu) {
            //depth:1是为了同nav-menu表现一致，此菜单的深度均为1
            const payload = {menu, depth: 1, context: this}

            //优先使用menuIcon插槽
            return this.menuIconSlot
                ? this.menuIconSlot(payload)
                : this.menuIconRenderer(h, payload)
        },
        //渲染菜单内容
        renderMenuContent(h, menu) {
            //优先使用menuItemContent插槽
            if (this.menuItemContentSlot) {
                return this.menuItemContentSlot({menu, context: this})
            }

            if (this.menuItemContentRenderer) {
                return this.menuItemContentRenderer(h, {menu, context: this})
            }

            return <span>{menu.meta.title}</span>
        }
    },

    render(h) {
        return (
            <div class="root-sidebar-container">
                <div
                    class={this.sidebarClass}
                    on-mouseleave={this.onMouseLeave}
                    on-mouseenter={this.onMouseEnter}
                >
                    {this.showLogo && <logo show-title={!this.collapse}/>}

                    <ul class={this.menuClass}>
                        {appGetters.menus.map(menu => {
                            const {fullPath} = menu
                            const isActive = fullPath === appGetters.activeRootMenu

                            return (
                                <li class={{'el-menu-item': true, 'is-active': isActive}}
                                    on-click={() => this.onSelect(fullPath)}
                                >
                                    {this.renderMenuIcon(h, menu)}
                                    {!this.collapse && this.renderMenuContent(h, menu)}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}
</script>
