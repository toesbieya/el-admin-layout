<script type="text/jsx">
import {appGetters, pageGetters, pageMutations, tagsViewGetters, tagsViewMutations} from "../../../../store"
import ContextMenu from "./ContextMenu"
import ScrollPanel from './ScrollPanel'
import {refreshPage} from "../../../../util"

export default {
    components: {ContextMenu, ScrollPanel},

    data() {
        return {
            contextMenu: {
                show: false,
                top: 0,
                left: 0,
            },
            selectedTag: {}
        }
    },

    computed: {
        visitedViews: () => tagsViewGetters.visitedViews,

        menus: () => appGetters.menus,

        contextMenuItems() {
            return [
                {content: '刷新', click: this.refreshSelectedTag},
                this.isAffix(this.selectedTag)
                    ? undefined
                    : {
                        content: '关闭',
                        click: () => this.closeSelectedTag(this.selectedTag)
                    },
                {content: '关闭其他', click: this.closeOthersTags},
                {content: '关闭全部', click: this.closeAllTags}
            ]
        }
    },

    watch: {
        $route(to, from) {
            this.decideRouteTransition(to, from)
            this.addTag(to)
            this.$nextTick(this.moveToCurrentTag)
        }
    },

    methods: {
        //判断页签是否激活，考虑redirect刷新的情况
        isActive({path}) {
            const {path: routePath} = this.$route
            return routePath === path || routePath === `/redirect${path}`
        },
        isAffix(tag) {
            return tag.meta && tag.meta.affix
        },

        //根据访问的tab页的左右顺序来确定路由动画
        decideRouteTransition(to, from) {
            const {next, prev} = pageGetters.transition

            let transitionName = prev

            //这里认为页签数量不会太多，所以为了可读性使用两次循环查找
            const fromIndex = this.visitedViews.findIndex(i => i.path === from.path)
            const toIndex = this.visitedViews.findIndex(i => i.path === to.path)

            //新开tab也认为顺序高于上一个tab
            if (toIndex === -1 || fromIndex < toIndex) {
                transitionName = next
            }

            pageMutations.transition({curr: transitionName})
        },

        initTags() {
            //获取所有需要固定显示的页签
            function getAffixTags(menus) {
                const tags = []
                menus.forEach(({name, fullPath, children, meta}) => {
                    if (meta && meta.title && meta.affix) {
                        tags.push({
                            //注意，此处的fullPath并不是$route.fullPath，而是路由树拼接后的全路径
                            fullPath,
                            path: fullPath,
                            name,
                            meta: {...meta}
                        })
                    }
                    if (children) {
                        const tempTags = getAffixTags(children)
                        tempTags.length && tags.push(...tempTags)
                    }
                })
                return tags
            }

            //添加所有固定显示的页签
            for (const tag of getAffixTags(this.menus)) {
                tagsViewMutations.addTagOnly(tag)
            }

            //将当前路由对象添加为页签
            this.addTag(this.$route)
        },
        //将具有meta.title的路由对象添加为tab页
        addTag(to) {
            to.meta.title && tagsViewMutations.addTagAndCache(to)
        },

        //横向滚动条移动至当前tab
        moveToCurrentTag() {
            //获取所有页签的componentInstance
            const tagInstances = this.$refs.scrollPanel.$children
            const tag = tagInstances.find(i => this.isActive(i.to))
            tag && this.$refs.scrollPanel.moveToTarget(tag.$el)
        },

        /**
         * 右键菜单选项
         * 刷新所选、关闭所选、关闭其他、关闭所有
         */
        refreshSelectedTag() {
            this.selectedTag && refreshPage(this.selectedTag, this.$router)
        },
        closeSelectedTag(view, e) {
            if (this.isAffix(view)) return

            e && e.preventDefault()

            tagsViewMutations.delTagAndCache(view)
            this.isActive(view) && this.gotoLastTag()
        },
        closeOthersTags() {
            tagsViewMutations.delOtherTagAndCache(this.selectedTag)

            //当前选中的页签不是当前路由时，跳转到选中页签的地址
            if (this.selectedTag.path !== this.$route.path) {
                return this.$router.push(this.selectedTag)
            }
        },
        closeAllTags() {
            tagsViewMutations.delAllTagAndCache()
            this.gotoLastTag()
        },

        gotoLastTag() {
            if (this.visitedViews.length === 0) {
                return this.$router.push('/')
            }

            const latest = this.visitedViews[this.visitedViews.length - 1]

            //只有当页签路径与当前路由路径不同时才跳转，否则刷新
            this.$route.path === latest.path
                ? refreshPage(this.$route, this.$router)
                : this.$router.push(latest.path)
        },

        openContextMenu(tag, e) {
            e.preventDefault()

            const contextMenuWidth = 105 //右键菜单的假定宽度
            const {left: elLeft, width: elWidth} = this.$el.getBoundingClientRect()
            const maxLeft = elWidth + elLeft - contextMenuWidth
            const left = e.clientX

            this.contextMenu.left = (left > maxLeft ? maxLeft : left) + 15
            this.contextMenu.top = e.clientY
            this.contextMenu.show = true

            this.selectedTag = tag
        },

        renderTags() {
            return this.visitedViews.map(tag => {
                const {path, query, fullPath, meta: {title}} = tag
                const active = this.isActive(tag), affix = this.isAffix(tag)

                return (
                    <router-link
                        key={fullPath}
                        tag="div"
                        class={{'tags-view-item': true, active}}
                        to={{path, query, fullPath}}
                        v-on:contextmenu_native={e => this.openContextMenu(tag, e)}
                        v-on:dblclick_native={e => this.closeSelectedTag(tag, e)}
                    >
                        <span>{title}</span>
                        {!affix && <i class="el-icon-close" on-click={e => this.closeSelectedTag(tag, e)}/>}
                    </router-link>
                )
            })
        }
    },

    mounted() {
        this.initTags()
    },

    render() {
        return (
            <div class="tags-view-container">
                <scroll-panel ref="scrollPanel" class="tags-view-wrapper">
                    {this.renderTags()}
                </scroll-panel>

                <context-menu
                    v-model={this.contextMenu.show}
                    items={this.contextMenuItems}
                    left={this.contextMenu.left}
                    top={this.contextMenu.top}
                />
            </div>
        )
    }
}
</script>
