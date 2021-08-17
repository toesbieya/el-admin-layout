<template>
    <div class="breadcrumb">
        <transition-group name="breadcrumb">
            <div
                    v-for="({fullPath, meta: {title}}, index) in items"
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
                <span class="breadcrumb-inner">{{ lastItem.meta.title }}</span>
            </div>
        </transition-group>
    </div>
</template>

<script>
/**
 * 面包屑，用于页面（Page）的页头
 */

import {getMenuByFullPath} from '../../store/app'
import {getRouterKey, getRouterTitle, isRedirectRouter} from '../../config/logic'

export default {
    name: 'Breadcrumb',

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
                const result = this.generateBreadcrumb(to)
                if (Array.isArray(result) && result.length !== 0) {
                    this.items = result
                }
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
        },

        generateBreadcrumb(route) {
            const {path, fullPath, meta: {activeMenu}} = route

            //刷新时返回undefined
            if (isRedirectRouter(route)) return

            //使用route.path而非fullPath进行匹配
            const menuFullPath = activeMenu || path
            const menu = getMenuByFullPath(menuFullPath)

            //没有匹配的菜单
            if (!menu) return []

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
                    meta: {title: getRouterTitle(route)}
                })
            }

            return items
        }
    }
}
</script>
