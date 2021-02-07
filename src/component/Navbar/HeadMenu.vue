<script type="text/jsx">
/**
 * 顶部菜单，参考了ant design的响应式设计
 */
import rootMenuMixin from "el-admin-layout/src/mixin/rootMenu"
import {appGetters, navbarGetters} from "el-admin-layout"
import NavMenu from "el-admin-layout/src/component/NavMenu"
import {getRouterActiveMenu} from "el-admin-layout/src/config/logic"
import {getHeadMenus} from "el-admin-layout/src/store/app"

export default {
    name: "HeadMenu",

    mixins: [rootMenuMixin],

    components: {NavMenu},

    props: {
        //是否在只有一个顶部菜单时仍然渲染
        alwaysShow: {type: Boolean, default: true},

        /*-------------<nav-menu>原有props开始-------------*/

        showIconMaxDepth: Number
    },

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
        navMode: () => appGetters.navMode,

        //原始的菜单数组
        menus: getHeadMenus,

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
        $route(to) {
            if (this.setActiveRootMenuWhenRouteChange(to)) {
                this.setActiveMenu(this.navMode, to)
            }
        },

        //切换导航模式时重新设置高亮菜单
        navMode(mode) {
            this.setActiveMenu(mode)
        },

        //变动时修改种子，避免组件不更新
        lastVisibleIndex() {
            this.seed++
        }
    },

    methods: {
        setActiveMenu(navMode = this.navMode, route = this.$route) {
            //只有在混合导航模式下才将当前激活的顶部菜单认为是当前菜单
            if (navMode === 'mix') {
                this.activeMenu = appGetters.activeRootMenu
            }
            //否则按照路由配置项设置
            else this.activeMenu = getRouterActiveMenu(route)
        },
        onSelect(index) {
            //混合导航模式下点击根节点时
            if (this.navMode === 'mix') {
                return this.onSelectRootMenu(index)
            }

            this.actionOnSelectMenu(index)
        },

        //获取el-menu的dom
        getMenuEl() {
            return this.$el
        },
        //获取初始菜单的总宽度，只在mounted时调用一次
        setChildrenWidth() {
            const ul = this.getMenuEl()
            if (!this.isDom(ul)) return

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
            //菜单未渲染时，移除之前的observer
            if (!this.isDom(this.getMenuEl())) {
                if (this.resizeObserver) {
                    this.resizeObserver.disconnect()
                    this.resizeObserver = null
                }
                return
            }

            //如果已创建observer，则返回
            if (this.resizeObserver) return

            this.resizeObserver = new window.ResizeObserver(this.resize)
            this.resizeObserver.observe(this.getMenuEl())

            this.$once('hook:beforeDestroy', () => {
                this.resizeObserver && this.resizeObserver.disconnect()
            })
        },

        //判断是否为dom元素
        isDom(obj) {
            return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
        }
    },

    created() {
        //从watch中拆分出来，避免初始化时触发两次setActiveMenu
        if (this.setActiveRootMenuWhenRouteChange(this.$route)) {
            this.setActiveMenu()
        }
    },

    mounted() {
        this.setChildrenWidth()
        this.createResizeObserver()
    },

    render() {
        if (this.menus.length <= 0 || this.menus.length === 1 && !this.alwaysShow) {
            return
        }

        return (
            <nav-menu
                ref="nav-menu"
                menus={this.realMenus}
                theme={navbarGetters.theme}
                mode="horizontal"
                default-active={this.activeMenu}
                show-icon-max-depth={this.showIconMaxDepth}
                on-select={this.onSelect}
            />
        )
    }
}
</script>
