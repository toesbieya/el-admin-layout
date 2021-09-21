<script>
/**
 * 基于el-menu封装的无限级菜单
 * 自带亮色、暗色两种主题
 */

import MenuItem from '../../component/ElMenu/item'
import SubMenu from '../../component/ElMenu/sub'
import {isEmpty} from '../../util'

/**
 * 判断菜单是否没有子级，没有则返回true，否则false
 *
 * @param menu {MenuItem}
 * @returns {boolean}
 */
function isSingleMenu(menu) {
    return !Array.isArray(menu.children) || menu.children.length === 0
}

export default {
    name: 'NavMenu',

    props: {
        //路由配置项组成的树形数组
        menus: {type: Array, default: () => []},

        //主题，light 或 dark
        theme: {type: String, default: 'light'},

        //垂直模式下子菜单的单位缩进距离
        inlineIndent: Number,

        //水平模式下是否显示展开折叠图标
        showCollapseIcon: Boolean,

        //折叠时的展开菜单是否显示父级
        showParentOnCollapse: Boolean,

        //menus变化时的过渡动画名称
        switchTransitionName: String,

        //自定义渲染菜单图标，(h, {menu, depth}) => VNode
        menuIconSlot: Function,

        //自定义渲染菜单内容，(h, {menu, depth}) => VNode
        menuContentSlot: Function,

        /*--------------el-menu原有props开始-------------*/
        /*https://element.eleme.cn/#/zh-CN/component/menu*/

        mode: {type: String, default: 'vertical'},  //在el-menu原效果上加了样式名
        collapse: Boolean,
        defaultActive: String,
        defaultOpeneds: Array,
        uniqueOpened: Boolean
    },

    computed: {
        children() {
            const h = this.$createElement
            let children = this.renderMenus(h, this.menus)

            const {switchTransitionName: name} = this
            if (!isEmpty(name)) {
                children = h('transition-group', {props: {name}}, children)
            }

            return children
        },

        themeClass() {
            return `el-menu--${this.theme}`
        },
        menuClass() {
            return [
                `el-menu--${this.mode}`,
                this.themeClass,
                !this.showCollapseIcon && 'hide-collapse-icon'
            ]
        }
    },

    methods: {
        //将el-menu的select事件传递给外部
        onSelect(...args) {
            this.$emit('select', ...args)
        },

        //渲染菜单图标
        renderMenuIcon(h, menu, depth) {
            const slot = this.menuIconSlot

            if (slot) return slot(h, {menu, depth})

            const icon = menu.meta.icon
            return icon && <i class={`menu-icon ${icon}`}/>
        },
        //渲染菜单内容
        renderMenuContent(h, menu, depth) {
            const slot = this.menuContentSlot

            return slot ? slot(h, {menu, depth}) : <span>{menu.meta.title}</span>
        },
        //渲染无子级的菜单
        renderSingleMenu(h, menu, depth) {
            const {fullPath} = menu
            return (
                <MenuItem key={fullPath} index={fullPath} inline-indent={this.inlineIndent}>
                    {this.renderMenuIcon(h, menu, depth)}
                    <template slot="title">
                        {this.renderMenuContent(h, menu, depth)}
                    </template>
                </MenuItem>
            )
        },
        //渲染有子级的菜单
        renderSubMenu(h, menu, children, depth) {
            const {fullPath} = menu
            const noContent = depth === 1 && this.collapse && this.mode === 'vertical'

            return (
                <SubMenu
                    key={fullPath}
                    index={fullPath}
                    inline-indent={this.inlineIndent}
                    popper-class={this.themeClass}
                    popper-append-to-body
                >
                    <template slot="title">
                        {this.renderMenuIcon(h, menu, depth)}
                        {!noContent && this.renderMenuContent(h, menu, depth)}
                    </template>
                    {children}
                </SubMenu>
            )
        },
        //渲染有子级且需要显示父级的菜单
        renderChildrenWithParentMenu(h, menu, children, depth) {
            return [
                <div class="popover-menu__title">
                    {this.renderMenuIcon(h, menu, depth)}
                    {this.renderMenuContent(h, menu, depth)}
                </div>,
                <div class="el-menu el-menu--inline">{children}</div>
            ]
        },
        //渲染菜单项
        renderMenus(h, menus, depth = 1) {
            return menus.map(menu => {
                //无子级的菜单
                if (isSingleMenu(menu)) {
                    return this.renderSingleMenu(h, menu, depth)
                }

                //此处menu必有children属性
                let children = this.renderMenus(h, menu.children, depth + 1)

                //弹出菜单显示父级信息
                if (this.collapse && this.showParentOnCollapse) {
                    //这里认为父级的深度应该+1
                    children = this.renderChildrenWithParentMenu(h, menu, children, depth + 1)
                }

                return this.renderSubMenu(h, menu, children, depth)
            })
        }
    },

    render() {
        return (
            <el-menu
                ref="el-menu"
                class={this.menuClass}
                mode={this.mode}
                collapse={this.collapse}
                collapse-transition={false}
                unique-opened={this.uniqueOpened}
                default-active={this.defaultActive}
                default-openeds={this.defaultOpeneds}
                on-select={this.onSelect}
            >
                {this.children}
            </el-menu>
        )
    }
}
</script>
