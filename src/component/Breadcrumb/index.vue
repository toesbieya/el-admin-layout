<template>
    <div class="breadcrumb">
        <transition-group name="breadcrumb">
            <div v-for="{fullPath, title} in items" :key="fullPath" class="breadcrumb-item">
                <span class="breadcrumb-inner is-link" @click="() => onClick(fullPath)">
                    {{ title }}
                </span>
                <span class="breadcrumb-separator">/</span>
            </div>
            <div :key="$route.fullPath" class="breadcrumb-item">
                <span class="breadcrumb-inner">{{ lastItemTitle || routeTitle }}</span>
            </div>
        </transition-group>
    </div>
</template>

<script>
import {Const} from "el-admin-layout"
import {getMenuByFullPath} from "el-admin-layout/src/store/app"
import {isEmpty} from "el-admin-layout/src/util"

export default {
    name: "Breadcrumb",

    data() {
        return {
            items: [],
            lastItemTitle: ''
        }
    },

    computed: {
        //当前路由的面包屑标题
        routeTitle() {
            return Const.routerTitleGenerator(this.$route)
        }
    },

    watch: {
        $route: {
            handler(route) {
                const {fullPath, matched, meta: {activeMenu}} = route

                //404、刷新 则跳过
                if (matched.length === 0 || fullPath.startsWith(Const.redirectPath)) {
                    return
                }

                const menuFullPath = activeMenu || fullPath
                const menu = getMenuByFullPath(menuFullPath)

                //没有找到对应菜单时使用route.matched代替
                if (!menu) {
                    console.warn(`[面包屑]：未找到'${menuFullPath}'对应的菜单子树，使用route.matched代替`)

                    this.items = matched
                        .slice(0, -1)
                        .map(route => {
                            const title = Const.routerTitleGenerator(route, this.$route)
                            return !isEmpty(title) && {title, fullPath: route.fullPath}
                        })
                        .filter(Boolean)

                    return
                }

                const items = [menu]

                let parent = menu.parent
                while (parent) {
                    items.unshift(parent)
                    parent = parent.parent
                }

                //找到的菜单对应当前路由时，弹出尾部
                if (menu.fullPath === route.path) {
                    const lastItem = items.pop()
                    if (!isEmpty(lastItem.meta && lastItem.meta.title)) {
                        this.lastItemTitle = lastItem.meta.title
                    }
                }

                this.items = items
                    .map(menu => {
                        //菜单必须要有固定标题
                        const title = menu.meta && menu.meta.title
                        return !isEmpty(title) && {title, fullPath: menu.fullPath}
                    })
                    .filter(Boolean)
            },
            immediate: true
        }
    },

    methods: {
        onClick(fullPath) {
            let menu = getMenuByFullPath(fullPath)
            if (!menu) return

            //找到其叶子菜单
            while (menu.children && menu.children.length >= 1) {
                menu = menu.children[0]
            }

            //不刷新
            if (this.$route.path !== menu.fullPath) {
                this.$router.push(menu.fullPath)
            }
        }
    }
}
</script>
