<script type="text/jsx">
import {
    Const,
    appGetters,
    pageGetters,
    pageMutations,
    tagsViewGetters,
    tagsViewMutations
} from "el-admin-layout"
import ContextMenu from "./ContextMenu"
import ScrollPanel from './ScrollPanel'
import {refreshPage} from "el-admin-layout/src/helper"
import {isEmpty} from "el-admin-layout/src/util"

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
            return routePath === path || routePath === `${Const.redirectPath}${path}`
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

        //获取菜单树中所有需要固定显示的页签
        getAffixTags(menus) {
            const tags = []
            menus.forEach(({fullPath, children, meta}) => {
                if (meta && meta.affix === true) {
                    const {route} = this.$router.resolve(fullPath)

                    if (route && route.matched.length > 0) {
                        const title = Const.routerTitleGenerator(route)
                        !isEmpty(title) && tags.push({...route, meta: {...meta, ...route.meta, title}})
                    }
                }
                if (children) {
                    const tempTags = this.getAffixTags(children)
                    tempTags.length && tags.push(...tempTags)
                }
            })
            return tags
        },
        //初始化固定显示的页签
        initTags() {
            //添加所有固定显示的页签
            this.getAffixTags(this.menus).forEach(tagsViewMutations.addTagOnly)

            //将当前路由对象添加为页签
            this.addTag(this.$route)
        },
        //将具有标题的路由对象添加为tab页
        addTag(route) {
            const finalTitle = Const.routerTitleGenerator(route)

            if (!isEmpty(finalTitle)) {
                tagsViewMutations.addTagAndCache({
                    ...route,
                    meta: {...route.meta, title: finalTitle}
                })
            }
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
            refreshPage(this.$router, this.selectedTag)
        },
        closeSelectedTag(view, e) {
            if (this.isAffix(view)) return

            e && e.preventDefault()

            tagsViewMutations.delTagAndCache(view)
            this.isActive(view) && this.gotoLastTag()
        },
        closeOthersTags() {
            const view = this.selectedTag

            tagsViewMutations.delOtherTagAndCache(view)
            !this.isActive(view) && this.$router.push(view)
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
                const active = this.isActive(tag), affix = this.isAffix(tag)

                return (
                    <router-link
                        key={tag.fullPath}
                        tag="div"
                        class={{'tags-view-item': true, active}}
                        to={tag}
                        v-on:contextmenu_native={e => this.openContextMenu(tag, e)}
                        v-on:dblclick_native={e => this.closeSelectedTag(tag, e)}
                    >
                        <span>{tag.meta.title}</span>
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
