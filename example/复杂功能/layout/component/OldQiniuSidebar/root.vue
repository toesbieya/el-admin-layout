<script>
import menuMixin from "el-admin-layout/src/mixin/menu"
import {appGetters, appMutations, asideGetters} from "el-admin-layout"
import Logo from 'el-admin-layout/src/component/Logo'
import {isRedirectRouter} from "el-admin-layout/src/config/logic"
import {getMenuByFullPath} from "el-admin-layout/src/store/app"
import {findFirstLeaf} from "el-admin-layout/src/util"

export default {
    name: "OldQiniuSidebarRoot",

    mixins: [menuMixin],

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
        //是否需要显示logo
        showLogo() {
            return appGetters.showLogo && appGetters.struct === 'left-right'
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
        //根据路由设置当前高亮的根节点
        setActiveRootMenu({matched: [root]} = this.$route) {
            //此处的path是路由定义中的原始数据，所以根路由不能使用动态匹配的方式定义（一般也不会有这种情况吧）
            //如果路由中使用了'/'，那么此处的path会是''
            root && appMutations.activeRootMenu(root.path || '/')
        },
        //路由变化时设置高亮根节点菜单，设置成功时返回true
        setActiveRootMenuWhenRouteChange(route) {
            const {matched} = route

            if (matched.length === 0 || isRedirectRouter(route)) {
                return false
            }

            this.setActiveRootMenu(route)

            return true
        },

        onSelect(index) {
            this.onSelectRootMenu(index)

            //设置标识位，因为此时折叠菜单时可能会触发onMouseEnter
            this.hasSelectMenu = true

            //只要点击了菜单项就收起
            this.collapse = true
        },
        onSelectRootMenu(index) {
            const root = getMenuByFullPath(index)

            //vue-router中对应index的路由可能有子级且未设置redirect，此时访问index会404
            const {leaf, hasOtherLeaf} = findFirstLeaf(root)

            //如果该根节点已激活且有多个叶子节点，退出
            if (!leaf || appGetters.activeRootMenu === index && hasOtherLeaf) {
                return
            }

            this.actionOnSelectMenu(leaf.fullPath)
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

    render() {
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
                            const {fullPath, meta: {icon, title}} = menu
                            const isActive = fullPath === appGetters.activeRootMenu

                            return (
                                <li class={{'el-menu-item': true, 'is-active': isActive}}
                                    on-click={() => this.onSelect(fullPath)}
                                >
                                    {icon && <i class={`menu-icon ${icon}`}/>}
                                    {!this.collapse && <span>{title}</span>}
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
