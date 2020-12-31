<script type="text/jsx">
import {getIconRenderer} from "el-admin-layout/src/config"
import rootMenuMixin from "el-admin-layout/src/mixin/rootMenu"
import {appGetters, asideGetters, pageGetters} from "el-admin-layout/src/store"
import Logo from 'el-admin-layout/src/component/Logo'

const Item = {
    functional: true,

    props: {
        title: String,
        icon: String,
        active: Boolean
    },

    render(h, context) {
        const {title, icon, active} = context.props
        const {click} = context.listeners

        return (
            <li
                class={{'el-menu-item': true, 'is-active': active}}
                on-click={click}
            >
                {getIconRenderer()(h, icon)}
                <span class="menu-item-content">{title}</span>
            </li>
        )
    }
}

export default {
    name: "RootSidebar",

    mixins: [rootMenuMixin],

    components: {Logo, Item},

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
    },

    render() {
        return (
            <div class="root-sidebar-container">
                <div
                    class={this.containerClass}
                    on-mouseleave={() => this.mouseOutside = true}
                    on-mouseenter={() => this.mouseOutside = false}
                >
                    {this.showLogo && <logo show-title={!this.mouseOutside}/>}
                    <ul class={this.menuClass}>
                        {this.menus.map(({fullPath, meta: {title, icon}}) => (
                            <item
                                title={title}
                                icon={icon}
                                active={fullPath === appGetters.activeRootMenu}
                                on-click={() => this.onSelect(fullPath)}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}
</script>
