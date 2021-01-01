<template>
    <div class="page-header">
        <span class="page-header-title">{{ title }}</span>

        <el-breadcrumb>
            <el-breadcrumb-item v-for="(item, index) in data" :key="item.path">
                <span :class="{'no-redirect': index !== data.length - 1}">{{ item.meta.title }}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
import {getRedirectPath} from "el-admin-layout/src/config"
import {getTitleFromRoute} from "el-admin-layout/src/helper"

export default {
    name: "PageHeader",

    data: () => ({data: [], title: ''}),

    watch: {
        $route: {
            immediate: true,
            handler(to) {
                const {path, matched} = to

                if (!path.startsWith(getRedirectPath())) {
                    this.title = getTitleFromRoute(to)
                    this.data = matched
                        .slice(0, matched.length - 1)
                        .filter(item => item.meta.title)
                        .concat([{path: to.path, meta: {title: this.title}}])
                }
            }
        }
    }
}
</script>
