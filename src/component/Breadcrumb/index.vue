<template>
    <div class="breadcrumb">
        <transition-group name="breadcrumb">
            <div
                v-for="({fullPath, title}, index) in items"
                v-if="index !== items.length - 1"
                :key="fullPath"
                class="breadcrumb-item"
            >
                <span class="breadcrumb-inner is-link" @click="() => onClick(fullPath)">
                    {{ title }}
                </span>
                <span class="breadcrumb-separator">/</span>
            </div>

            <div v-if="lastItem" :key="lastItem.fullPath" class="breadcrumb-item">
                <span class="breadcrumb-inner">{{ lastItem.title }}</span>
            </div>
        </transition-group>
    </div>
</template>

<script>
import {getMenuByFullPath} from "el-admin-layout/src/store/app"
import {isEmpty} from "el-admin-layout/src/util"
import {getRouterKey, getRouterTitle, isRedirectRouter} from "el-admin-layout/src/config/logic"

export default {
    name: "Breadcrumb",

    data() {
        return {
            items: []
        }
    },

    computed: {
        lastItem() {
            return this.items.length <= 1
                ? undefined
                : this.items[this.items.length - 1]
        }
    },

    watch: {
        $route: {
            handler(to) {
                const {path, fullPath, meta: {activeMenu}} = to

                //刷新时不作处理
                if (isRedirectRouter(to)) return

                //使用route.path而非fullPath进行匹配
                const menuFullPath = activeMenu || path
                const menu = getMenuByFullPath(menuFullPath)

                if (!menu) {
                    console.warn(`[面包屑]：未找到'${menuFullPath}'对应的菜单`)
                    this.items = []
                    return
                }

                //将菜单的所有父级放入数组
                const items = [menu]
                let parent = menu.parent
                while (parent) {
                    items.unshift(parent)
                    parent = parent.parent
                }

                //使用了activeMenu的还需要拼接上自己的标题
                if (activeMenu) {
                    items.push({
                        fullPath,
                        meta: {
                            title: getRouterTitle(to)
                        }
                    })
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

            const {route} = this.$router.resolve(menu.fullPath)

            //不刷新
            if (getRouterKey(route) !== getRouterKey(this.$route)) {
                this.$router.push(route)
            }
        }
    }
}
</script>
