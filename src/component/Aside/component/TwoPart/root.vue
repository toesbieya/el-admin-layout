<script type="text/jsx">
import {Const} from "el-admin-layout"
import rootMenuMixin from "el-admin-layout/src/mixin/rootMenu"
import {appGetters, asideGetters, pageGetters} from "el-admin-layout"
import Logo from 'el-admin-layout/src/component/Logo'

export default {
    name: "RootSidebar",

    mixins: [rootMenuMixin],

    components: {Logo},

    data() {
        return {
            //鼠标是否在外部，用于判断是否需要展开折叠
            mouseOutside: true
        }
    },

    computed: {
        menus() {
            return appGetters.menus.map(root => ({...root, children: undefined}))
        },

        //是否需要显示logo
        showLogo() {
            return pageGetters.showLogo && pageGetters.position === 'left-right'
        },

        containerClass() {
            return {'root-sidebar': true, 'collapse': this.mouseOutside}
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

            //只要点击了菜单项就收起
            this.mouseOutside = true
        },

        renderChildren(h) {
            const activeRootMenu = appGetters.activeRootMenu
            return this.menus.map(({fullPath, meta: {title, icon}}) => (
                <li
                    class={{'el-menu-item': true, 'is-active': fullPath === activeRootMenu}}
                    on-click={() => this.onSelect(fullPath)}
                >
                    {Const.iconRenderer(h, icon)}
                    <span class="menu-item-content">{title}</span>
                </li>
            ))
        }
    },

    render(h) {
        return (
            <div class="root-sidebar-container">
                <div
                    class={this.containerClass}
                    on-mouseleave={() => this.mouseOutside = true}
                    on-mouseenter={() => this.mouseOutside = false}
                >
                    {this.showLogo && <logo show-title={!this.mouseOutside}/>}

                    <ul class={this.menuClass}>
                        {this.renderChildren(h)}
                    </ul>
                </div>
            </div>
        )
    }
}
</script>
