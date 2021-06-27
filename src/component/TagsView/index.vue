<script>
/**
 * 页签栏
 */

import {
    appGetters,
    pageGetters,
    pageMutations,
    tagsViewGetters,
    tagsViewMutations
} from '../../store'
import ContextMenu from '../../component/ContextMenu'
import HorizontalScroller from '../../component/HorizontalScroller'
import {refreshPage} from '../../helper'
import {getRouterKey, getRouterTitle, isRedirectRouter} from '../../config/logic'

export default {
    name: 'TagsView',

    data() {
        return {
            //当前激活的页签的key，随路由变化
            activeKey: '',

            //当前选中的页签
            selectedTag: undefined,

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
                this.visitedViews.length <= 1 || this.selectedTag && this.isAffix(this.selectedTag)
                    ? undefined
                    : {
                        content: '关闭',
                        click: () => this.closeSelectedTag(this.selectedTag)
                    },
                {content: '关闭其他', click: this.closeOthersTags},
                {content: '关闭全部', click: this.closeAllTags}
            ]
        },

        //避免HorizontalScroller在右键时触发$forceUpdate
        //https://segmentfault.com/q/1010000040171066
        tagsSlot() {
            return this._u([{
                key: 'default',
                fn: this.renderTags,
                proxy: true
            }])
        }
    },

    watch: {
        $route(to, from) {
            tagsViewGetters.enableChangeTransition && this.decideRouteTransition(to, from)

            //如果是刷新的话，不需要进行后续操作
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
            return view.meta.affix
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
            return menus.reduce((affixTags, {fullPath, children, meta}) => {
                if (meta.affix === true) {
                    const {route} = this.$router.resolve(fullPath)

                    affixTags.push({
                        ...route,
                        meta: {
                            affix: true,
                            ...route.meta,
                            title: getRouterTitle(route)
                        }
                    })
                }

                if (children) {
                    const tempTags = this.getAffixTags(children)
                    tempTags.length && affixTags.push(...tempTags)
                }

                return affixTags
            }, [])
        },
        //初始化固定显示的页签
        initTags() {
            //TODO 如果页签栏初始化后菜单未加载，则固定页签会出问题
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
            const scroller = this.$refs['scroller']
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
            if (this.visitedViews.length <= 1 || this.isAffix(view)) return

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
            this.gotoLastTag(true)
        },

        gotoLastTag(refresh = false) {
            const views = this.visitedViews

            if (views.length === 0) {
                return this.$router.push('/')
            }

            const latest = views[views.length - 1]

            //目标路由是当前路由时需要刷新，否则直接跳转
            this.activeKey === latest.key
                ? refresh && refreshPage(this.$router)
                //需要套一层$nextTick，否则tagsViewStore.visitedViews可能只会变动一次
                : this.$nextTick(() => this.$router.push(latest))
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
            return this.visitedViews.map((view, _, arr) => {
                const active = this.activeKey === view.key
                const className = {'tags-view-item': true, active}
                const affix = this.isAffix(view)
                const showClose = !affix && arr.length > 1
                const on = {
                    contextmenu: e => this.openContextMenu(view, e)
                }
                const onIconClick = e => {
                    //需要阻止事件冒泡，不然会触发tag的click事件
                    e.stopPropagation()
                    this.closeSelectedTag(view, e)
                }

                //非激活页签时，绑定点击事件，点击跳转到页签对应的路由
                if (!active) {
                    on.click = () => this.$router.push(view, () => undefined)
                }

                return (
                    <div key={view.key} class={className} {...{on}}>
                        <span>{view.meta.title}</span>
                        {showClose && <i class="el-icon-close" on-click={onIconClick}/>}
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
                <HorizontalScroller ref="scroller" scopedSlots={this.tagsSlot}/>

                <ContextMenu
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
