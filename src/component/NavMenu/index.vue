<script type="text/jsx">
/**
 * 基于<el-menu>封装的无限级菜单
 * 借鉴[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
 * 自带亮色、暗色两种主题
 */

import cssVar from 'el-admin-layout/src/style/var.scss'
import MenuItem from './ElMenu/item'
import SubMenu from './ElMenu/sub'
import {isEmpty} from "el-admin-layout/src/util"

//根据showIconMaxDepth、depth判断是否需要限制图标的显示
function getIcon(icon, showIconMaxDepth, depth) {
    if (showIconMaxDepth == null || showIconMaxDepth < 0) {
        return icon
    }
    return showIconMaxDepth < depth ? undefined : icon
}

//获取不需要嵌套展示的菜单
function getOnlyChild(menu) {
    const {children = [], meta: {alwaysShow} = {}} = menu

    if (!children.length) return {...menu, children: undefined}

    if (children.length === 1) return alwaysShow ? null : getOnlyChild(children[0])

    return null
}

export default {
    name: 'NavMenu',

    inject: {
        elAdminLayout: {
            default: {
                $scopedSlots: {}
            }
        }
    },

    components: {MenuItem, SubMenu},

    props: {
        //路由配置项组成的树形数组
        menus: {type: Array, default: () => []},

        //主题，light 或 dark
        theme: {type: String, default: 'light'},

        //垂直模式下子菜单的单位缩进距离
        inlineIndent: {type: Number, default: parseFloat(cssVar.menuPadding)},

        //折叠时的展开菜单是否显示父级
        showParentOnCollapse: Boolean,

        //能够显示图标的最大深度，不传 或 <0 则不作限制
        showIconMaxDepth: {type: Number, default: 1},

        //menus变化时是否使用过渡动画
        switchTransition: Boolean,

        //menus过渡动画名称
        switchTransitionName: String,

        //菜单内容搜索结果的渲染器
        searchResultRenderer: {
            type: Function,
            default: (h, menu, searchWord) => {
                const {title} = menu.meta
                const start = title.indexOf(searchWord)

                if (start === -1) return title

                const end = start + searchWord.length

                return [
                    title.substring(0, start),
                    <span class="menu-highlight-result">{title.substring(start, end)}</span>,
                    title.substring(end)
                ]
            }
        },

        /*-------------<el-menu>原有props开始-------------*/
        /*https://element.eleme.cn/#/zh-CN/component/menu*/

        mode: {type: String, default: 'vertical'},  //在el-menu原效果上加了样式名
        collapse: Boolean,
        defaultActive: String,
        uniqueOpened: Boolean
    },

    data() {
        return {
            //搜索词，不使用props是为了第三方能直接响应式地修改数据
            searchWord: ''
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

        //实际用于渲染的菜单数组
        realMenus() {
            return isEmpty(this.searchWord)
                ? this.menus
                : this.filterAfterSearch(this.menus)
        },

        //是否使用切换动画
        useSwitchTransition() {
            return this.switchTransition && !isEmpty(this.switchTransitionName)
        },

        themeClass() {
            return `el-menu--${this.theme}`
        },
        menuClass() {
            return `el-menu--${this.mode} ${this.themeClass}`
        }
    },

    watch: {
        //搜索词改变时，展开高亮菜单
        searchWord() {
            this.$nextTick(this.expandAfterSearch)
        },

        //defaultActive改变时直接修改<el-menu>的activeIndex，避免<nav-menu>重新渲染
        defaultActive(v) {
            this.$nextTick(() => this.setElMenuActiveIndex(v))
        }
    },

    methods: {
        //手动调用<el-menu>的updateActiveIndex方法
        setElMenuActiveIndex(v) {
            const elMenu = this.$refs['el-menu']
            elMenu && elMenu.updateActiveIndex(v)
        },
        //将<el-menu>的select事件传递给外部
        onSelect(...args) {
            this.$emit('select', ...args)
        },

        //根据搜索词过滤菜单
        filterAfterSearch(menus) {
            if (!menus) return

            return menus
                .map(menu => ({...menu}))
                .filter(menu => {
                    //如果匹配，那么其子节点无需再判断
                    if (menu.meta.title.includes(this.searchWord)) {
                        return true
                    }

                    const children = this.filterAfterSearch(menu.children)

                    if (children) menu.children = children

                    return children && children.length > 0
                })
        },
        //根据查找结果展开菜单
        expandAfterSearch() {
            const menu = this.$refs['el-menu']

            //清空搜索词时还原原本展开的菜单
            if (isEmpty(this.searchWord)) {
                menu.openedMenus = []
                return menu.initOpenedMenu()
            }

            const {openedMenus, submenus} = menu
            const expandMenus = [...new Set(this.getHighlightMenuParent(this.realMenus))]

            //不调用el-menu的open方法是为了避免uniqueOpened
            for (const {fullPath} of expandMenus) {
                const sub = submenus[fullPath]

                if (!sub || openedMenus.includes(sub.index)) continue

                sub.indexPath.forEach(i => {
                    !openedMenus.includes(i) && openedMenus.push(i)
                })
            }
        },
        //获取高亮菜单的上一级节点
        getHighlightMenuParent(children, parent) {
            const result = []

            children.forEach(child => {
                if (child.meta.title.includes(this.searchWord)) {
                    parent && result.push(parent)
                }

                if (child.children) {
                    result.push(...this.getHighlightMenuParent(child.children, child))
                }
            })

            return result
        },

        //渲染菜单图标
        renderMenuIcon(h, menu, defaultIcon) {
            const payload = {menu, defaultIcon, context: this}

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

            const child = isEmpty(this.searchWord)
                ? menu.meta.title
                : this.searchResultRenderer(h, menu, this.searchWord)

            if (this.menuItemContentRenderer) {
                return this.menuItemContentRenderer(h, {menu, highlight: child, context: this})
            }

            return <span>{child}</span>
        },
        //渲染无子级的菜单
        renderSingleMenu(h, menu, depth) {
            const {fullPath, meta: {icon}} = menu
            return (
                <menu-item key={fullPath} index={fullPath} inline-indent={this.inlineIndent}>
                    {this.renderMenuIcon(h, menu, getIcon(icon, this.showIconMaxDepth, depth))}
                    <template slot="title">
                        {this.renderMenuContent(h, menu)}
                    </template>
                </menu-item>
            )
        },
        //渲染有子级的菜单
        renderSubMenu(h, menu, children, depth) {
            const {fullPath, meta: {icon}} = menu
            const noContent = depth === 1 && this.collapse && this.mode === 'vertical'
            return (
                <sub-menu
                    key={fullPath}
                    index={fullPath}
                    inline-indent={this.inlineIndent}
                    popper-class={this.themeClass}
                    popper-append-to-body
                >
                    <template slot="title">
                        {this.renderMenuIcon(h, menu, getIcon(icon, this.showIconMaxDepth, depth))}
                        {!noContent && this.renderMenuContent(h, menu)}
                    </template>
                    {children}
                </sub-menu>
            )
        },
        //渲染有子级且需要显示父级的菜单
        renderChildrenWithParentMenu(h, menu, children) {
            return [
                <div class="popover-menu__title">
                    {this.renderMenuIcon(h, menu.meta.icon)}
                    {this.renderMenuContent(h, menu)}
                </div>,
                <div class="el-menu el-menu--inline">{children}</div>
            ]
        },
        //渲染菜单项
        renderMenu(h, menu, depth = 1) {
            const onlyOneChild = getOnlyChild(menu)
            const showSingle = onlyOneChild && !onlyOneChild.children

            if (showSingle) {
                return this.renderSingleMenu(h, onlyOneChild, depth)
            }

            let children = menu.children.map(child => this.renderMenu(h, child, depth + 1))

            //弹出菜单显示父级信息
            if (this.collapse && this.showParentOnCollapse) {
                children = this.renderChildrenWithParentMenu(h, menu, children)
            }

            return this.renderSubMenu(h, menu, children, depth)
        }
    },

    mounted() {
        //<nav-menu>mounted时，<el-menu>必定mounted
        this.setElMenuActiveIndex(this.defaultActive)
    },

    render(h) {
        let items = this.realMenus.map(menu => {
            return this.renderMenu(h, menu)
        })

        if (this.useSwitchTransition) {
            items = <transition-group name={this.switchTransitionName}>{items}</transition-group>
        }

        return (
            <el-menu
                ref="el-menu"
                class={this.menuClass}
                mode={this.mode}
                collapse={this.collapse}
                collapse-transition={false}
                unique-opened={this.uniqueOpened}
                on-select={this.onSelect}
            >
                {items}
            </el-menu>
        )
    }
}
</script>
