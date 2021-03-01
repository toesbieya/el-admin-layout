<script>
import {
    appGetters,
    pageGetters,
    pageMutations,
    tagsViewGetters,
    tagsViewMutations
} from "el-admin-layout"
import ContextMenu from "./ContextMenu"
import ScrollPanel from './ScrollPanel'
import {refreshPage} from "el-admin-layout/src/helper"
import {getRouterKey, getRouterTitle, isRedirectRouter} from "el-admin-layout/src/config/logic"

export default {
    name: 'TagsView',

    components: {ContextMenu, ScrollPanel},

    data() {
        return {
            //当前激活的页签的key，随路由变化
            activeKey: '',

            //当前选中的页签
            selectedTag: {},

            //页签右键菜单的属性
            contextMenu: {
                show: false,
                top: 0,
                left: 0,
            }
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

            //如果是刷新的话，后续的三个操作都不需要进行
            if (isRedirectRouter(to)) return

            this.setActiveKey(to)
            this.addTag(to)
            this.$nextTick(this.moveToCurrentTag)
        }
    },

    methods: {
        //根据路由设置当前激活的页签key
        setActiveKey(to) {
            this.activeKey = getRouterKey(to)
        },
        isAffix(view) {
            return view.meta && view.meta.affix
        },

        //根据访问的tab页的左右顺序来确定路由动画
        decideRouteTransition(to, from) {
            const {next, prev} = pageGetters.transition
            const fromKey = getRouterKey(from)
            const toKey = getRouterKey(to)
            let transitionName = prev

            //这里认为页签数量不会太多，所以为了可读性使用两次循环查找
            const fromIndex = this.visitedViews.findIndex(i => i.key === fromKey)
            const toIndex = this.visitedViews.findIndex(i => i.key === toKey)

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

                    tags.push({
                        ...route,
                        meta: {
                            ...meta,
                            ...route.meta,
                            title: getRouterTitle(route)
                        }
                    })
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
        //尝试将路由对象添加为tab页
        addTag(route) {
            tagsViewMutations.addTagAndCache({
                ...route,
                meta: {
                    ...route.meta,
                    title: getRouterTitle(route)
                }
            })
        },

        //横向滚动条移动至当前tab
        moveToCurrentTag() {
            const scroller = this.$refs['scroll-panel']
            const cur =
                Array
                    .from(scroller.$el.children)
                    .find(el => el.classList.contains('active'))
            cur && scroller.moveToTarget(cur)
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
            this.activeKey === view.key && this.gotoLastTag()
        },
        closeOthersTags() {
            tagsViewMutations.delOtherTagAndCache(this.selectedTag)
            this.gotoLastTag()
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

            //未激活时才跳转
            this.activeKey !== latest.key && this.$router.push(latest)
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
            return this.visitedViews.map(view => {
                const active = this.activeKey === view.key
                const className = {'tags-view-item': true, active}
                const affix = this.isAffix(view)
                const on = {
                    contextmenu: e => this.openContextMenu(view, e),
                    dblclick: e => this.closeSelectedTag(view, e)
                }
                const onIconClick = e => {
                    e.stopPropagation()
                    on.dblclick(e)
                }

                if (!active) {
                    on.click = () => this.$router.push(view, () => undefined)
                }

                return (
                    <div key={view.key} class={className} {...{on}}>
                        <span>{view.meta.title}</span>
                        {!affix && <i class="el-icon-close" on-click={onIconClick}/>}
                    </div>
                )
            })
        }
    },

    mounted() {
        this.setActiveKey(this.$route)
        this.initTags()
    },

    render() {
        return (
            <nav class="tags-view">
                <scroll-panel ref="scroll-panel" class="tags-view-scroller">
                    {this.renderTags()}
                </scroll-panel>

                <context-menu
                    v-model={this.contextMenu.show}
                    items={this.contextMenuItems}
                    left={this.contextMenu.left}
                    top={this.contextMenu.top}
                />
            </nav>
        )
    }
}
</script>
