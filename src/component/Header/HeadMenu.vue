<script type="text/jsx">
/**
 * 顶部菜单，参考了ant design的响应式设计
 */
import menuMixin from "el-admin-layout/src/mixin/menu"
import {appGetters, appMutations, headerGetters} from "el-admin-layout"
import NavMenu from "el-admin-layout/src/component/NavMenu"
import {getRouterActiveMenu, isRedirectRouter} from "el-admin-layout/src/config/logic"
import {getMenuByFullPath} from "el-admin-layout/src/store/app"
import {findFirstLeaf} from "el-admin-layout/src/util"

export default {
    name: "HeadMenu",

    mixins: [menuMixin],

    components: {NavMenu},

    data() {
        return {
            //最后一个不被隐藏的顶部菜单的数组下标
            //为undefined时，说明不需要隐藏菜单，为-1时，说明需要隐藏全部菜单
            lastVisibleIndex: undefined,

            //用于生成el-submenu的key
            seed: 0
        }
    },

    computed: {
        //原始的菜单数组
        menus() {
            const menus = appGetters.menus

            switch (appGetters.navMode) {
                case 'head' :
                    return menus
                case 'mix':
                    return menus.map(menu => ({...menu, children: undefined}))
                default:
                    return []
            }
        },

        //实际用于渲染的菜单数组（仿antd的自适应宽度）
        realMenus() {
            const {lastVisibleIndex, menus} = this

            //不需要隐藏菜单
            if (lastVisibleIndex === undefined) {
                return menus
            }

            const fullPath = `_${this.seed}`

            //隐藏全部菜单
            if (lastVisibleIndex === -1) {
                return [{fullPath, meta: {icon: 'el-icon-menu'}, children: menus}]
            }

            const visible = menus.slice(0, lastVisibleIndex + 1)
            const hidden = menus.slice(lastVisibleIndex + 1)

            visible.push({fullPath, meta: {title: '...'}, children: hidden})

            return visible
        }
    },

    watch: {
        //路由变化时设置高亮菜单
        $route: {
            immediate: true,
            handler(to) {
                if (this.setActiveRootMenu(to)) {
                    this.setActiveMenu(appGetters.navMode, to)
                }
            }
        },

        //变动时修改种子，避免组件不更新
        lastVisibleIndex() {
            this.seed++
        }
    },

    methods: {
        //路由变化时设置高亮根节点菜单，设置成功时返回true
        setActiveRootMenu(route) {
            const {matched} = route

            if (matched.length === 0 || isRedirectRouter(route)) {
                return false
            }

            //根据路由设置当前高亮的根节点
            //此处的path是路由定义中的原始数据，所以根路由不能使用动态匹配的方式定义（一般也不会有这种情况吧）
            //如果路由中使用了'/'，那么此处的path会是''
            const [root] = matched
            root && appMutations.activeRootMenu(root.path || '/')

            return true
        },
        setActiveMenu(navMode = appGetters.navMode, route = this.$route) {
            //只有在混合导航模式下才将当前激活的顶部菜单认为是当前菜单
            if (navMode === 'mix') {
                this.activeMenu = appGetters.activeRootMenu
            }
            //否则按照路由配置项设置
            else this.activeMenu = getRouterActiveMenu(route)
        },

        //点击菜单时触发
        onSelect(index) {
            //混合导航模式下点击的必是根节点
            if (appGetters.navMode === 'mix') {
                return this.onSelectRootMenu(index)
            }

            this.actionOnSelectMenu(index)
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

        //获取el-menu的dom
        getMenuEl() {
            return this.$el
        },
        //获取初始菜单的总宽度，只在mounted时调用一次
        setChildrenWidth() {
            const ul = this.getMenuEl()

            const menuItemNodes = ul.children
            if (!menuItemNodes || menuItemNodes.length === 0) return

            //'更多'菜单的宽度，由于不考虑自定义，所以直接写死
            this.overflowedIndicatorWidth = 50
            this.menuItemSizes = Array.from(menuItemNodes).map(i => i.getBoundingClientRect().width)
            this.originalTotalWidth = this.menuItemSizes.reduce((acc, cur) => acc + cur, 0)
        },

        resize() {
            const width = this.getMenuEl().getBoundingClientRect().width

            let lastVisibleIndex = undefined

            //如果初始菜单的总宽度超出容器宽度
            if (this.originalTotalWidth > width) {
                lastVisibleIndex = -1

                //得到满足总宽度不超出容器宽度的最大菜单下标
                let currentSumWidth = 0
                for (const liWidth of this.menuItemSizes) {
                    currentSumWidth += liWidth
                    if (currentSumWidth + this.overflowedIndicatorWidth > width) {
                        break
                    }
                    lastVisibleIndex += 1
                }
            }

            this.lastVisibleIndex = lastVisibleIndex
        },
        createResizeObserver() {
            this.resizeObserver = new window.ResizeObserver(this.resize)
            this.resizeObserver.observe(this.getMenuEl())
        }
    },

    created() {
        //切换导航模式时重新设置高亮菜单
        this.$watch(() => appGetters.navMode, v => this.setActiveMenu(v))
    },

    mounted() {
        this.setChildrenWidth()
        this.createResizeObserver()
    },

    beforeDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
            this.resizeObserver = null
        }
    },

    render() {
        if (this.menus.length === 0) return

        return (
            <nav-menu
                ref="nav-menu"
                menus={this.realMenus}
                theme={headerGetters.theme}
                mode="horizontal"
                default-active={this.activeMenu}
                on-select={this.onSelect}
                {...{scopedSlots: this.$parent.$scopedSlots}}
            />
        )
    }
}
</script>
