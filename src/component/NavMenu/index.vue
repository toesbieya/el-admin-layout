<script type="text/jsx">
import cssVar from 'el-admin-layout/style/var.scss'
import renderChild from './component/child'
import {isEmpty, deepClone} from "el-admin-layout/util"

const inlineIndent = parseFloat(cssVar.menuPadding)

export default {
    name: 'NavMenu',

    props: {
        //路由配置项组成的树形数组
        menus: Array,

        //垂直还是水平，在el-menu原效果上加了样式名
        mode: {type: String, default: 'vertical'},

        //主题，light 或 dark
        theme: {type: String, default: 'light'},

        //垂直模式下子菜单的单位缩进距离
        inlineIndent: {type: Number, default: inlineIndent},

        //是否折叠
        collapse: Boolean,

        //折叠时的展开菜单是否显示父级
        showParentOnCollapse: Boolean,

        //能够显示图标的最大深度，不传 或 <0 则不作限制
        showIconMaxDepth: {type: Number, default: 1},

        //menus变化时是否使用过渡动画
        switchTransition: Boolean,

        //menus过渡动画名称
        switchTransitionName: String
    },

    data() {
        return {
            //搜索词，不使用props是为了第三方能直接响应式地修改数据
            searchWord: ''
        }
    },

    computed: {
        //实际用于渲染的菜单数组
        realMenus() {
            return isEmpty(this.searchWord)
                ? this.menus
                : this.filterAfterSearch(deepClone(this.menus))
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
        }
    },

    methods: {
        //根据搜索词过滤菜单
        filterAfterSearch(menus) {
            if (!menus) return undefined

            return menus.filter(menu => {
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
                return this.$nextTick(menu.initOpenedMenu)
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
        }
    },

    render(h) {
        let items = this.realMenus.map(menu => {
            return renderChild(h, {
                menu,
                inlineIndent,
                popperClass: this.themeClass,
                highlight: this.searchWord,
                showParent: this.showParentOnCollapse,
                collapse: this.collapse,
                showIconMaxDepth: this.showIconMaxDepth
            })
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
                {...{attrs: this.$attrs, on: this.$listeners}}
            >
                {items}
            </el-menu>
        )
    }
}
</script>
