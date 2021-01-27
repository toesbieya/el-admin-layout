<script type="text/jsx">
import {Const} from "el-admin-layout"
import rootMenuMixin from "el-admin-layout/src/mixin/rootMenu"
import {appGetters, asideGetters, pageGetters} from "el-admin-layout"
import Logo from 'el-admin-layout/src/component/Logo'
import {isEmpty} from "el-admin-layout/src/util"

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
        //Layout中的menuItemContent插槽
        menuItemContentSlot() {
            return this.elAdminLayout.$scopedSlots.menuItemContent
        },

        //是否需要显示logo
        showLogo() {
            return pageGetters.showLogo && pageGetters.position === 'left-right'
        },

        containerClass() {
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
        }
    },

    render(h) {
        return (
            <div class="root-sidebar-container">
                <div
                    class={this.containerClass}
                    on-mouseleave={this.onMouseLeave}
                    on-mouseenter={this.onMouseEnter}
                >
                    {this.showLogo && <logo show-title={!this.collapse}/>}

                    <ul class={this.menuClass}>
                        {appGetters.menus.map(menu => {
                            const {fullPath, meta: {title, icon}} = menu
                            const isActive = fullPath === appGetters.activeRootMenu

                            return (
                                <li class={{'el-menu-item': true, 'is-active': isActive}}
                                    on-click={() => this.onSelect(fullPath)}
                                >
                                    {!isEmpty(icon) && Const.iconRenderer(h, icon)}
                                    {!this.collapse && (
                                        this.menuItemContentSlot
                                            ? this.menuItemContentSlot({menu, context: this})
                                            : <span>{title}</span>
                                    )}
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
