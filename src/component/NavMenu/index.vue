<script>
// TODO 增加展开全部的api
/**
 * 基于el-menu封装的无限级菜单
 * 借鉴[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
 * 自带亮色、暗色两种主题
 */

import MenuItem from './ElMenu/item'
import SubMenu from './ElMenu/sub'
import {isEmpty} from "el-admin-layout/src/util"

/**
 * 获取不需要嵌套展示的菜单，如果需要嵌套展示，则返回null
 *
 * @param menu {MenuItem}
 * @returns {(*&{children: undefined})|null|*|{children: undefined}}
 */
function getOnlyChild(menu) {
    const {children, meta: {alwaysShow = true} = {}} = menu

    //无子级
    if (!children) return menu

    //有children但是空数组
    if (children.length === 0) return {...menu, children: undefined}

    //只有一个子级
    if (children.length === 1) return alwaysShow ? null : getOnlyChild(children[0])

    return null
}

export default {
    name: 'NavMenu',

    components: {MenuItem, SubMenu},

    props: {
        //路由配置项组成的树形数组
        menus: {type: Array, default: () => []},

        //主题，light 或 dark
        theme: {type: String, default: 'light'},

        //垂直模式下子菜单的单位缩进距离
        inlineIndent: Number,

        //折叠时的展开菜单是否显示父级
        showParentOnCollapse: Boolean,

        //menus变化时的过渡动画名称
        switchTransitionName: String,

        /*--------------el-menu原有props开始-------------*/
        /*https://element.eleme.cn/#/zh-CN/component/menu*/

        mode: {type: String, default: 'vertical'},  //在el-menu原效果上加了样式名
        collapse: Boolean,
        defaultActive: String,
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
            return `el-menu--${this.mode} ${this.themeClass}`
        }
    },

    watch: {
        //defaultActive改变时直接修改el-menu的activeIndex，避免nav-menu重新渲染
        defaultActive(v) {
            this.$nextTick(() => this.setElMenuActiveIndex(v))
        }
    },

    methods: {
        //手动调用el-menu的updateActiveIndex方法
        setElMenuActiveIndex(v) {
            const elMenu = this.$refs['el-menu']
            elMenu && elMenu.updateActiveIndex(v)
        },
        //将el-menu的select事件传递给外部
        onSelect(...args) {
            this.$emit('select', ...args)
        },

        //渲染菜单图标
        renderMenuIcon(h, menu, depth) {
            const {'menu-icon': slot} = this.$scopedSlots

            if (slot) return slot({menu, depth})

            const icon = menu.meta.icon
            return icon && <i class={`menu-icon ${icon}`}/>
        },
        //渲染菜单内容
        renderMenuContent(h, menu, depth) {
            const {'menu-content': slot} = this.$scopedSlots

            return slot
                ? slot({menu, depth})
                : <span>{menu.meta.title}</span>
        },
        //渲染无子级的菜单
        renderSingleMenu(h, menu, depth) {
            const {fullPath} = menu
            return (
                <menu-item key={fullPath} index={fullPath} inline-indent={this.inlineIndent}>
                    {this.renderMenuIcon(h, menu, depth)}
                    <template slot="title">
                        {this.renderMenuContent(h, menu, depth)}
                    </template>
                </menu-item>
            )
        },
        //渲染有子级的菜单
        renderSubMenu(h, menu, children, depth) {
            const {fullPath} = menu
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
                        {this.renderMenuIcon(h, menu, depth)}
                        {!noContent && this.renderMenuContent(h, menu, depth)}
                    </template>
                    {children}
                </sub-menu>
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
                const onlyOneChild = getOnlyChild(menu)
                const showSingle = onlyOneChild && !onlyOneChild.children

                if (showSingle) {
                    return this.renderSingleMenu(h, onlyOneChild, depth)
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

    mounted() {
        //nav-menu mounted时，el-menu必定mounted
        this.setElMenuActiveIndex(this.defaultActive)
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
                on-select={this.onSelect}
            >
                {this.children}
            </el-menu>
        )
    }
}
</script>
