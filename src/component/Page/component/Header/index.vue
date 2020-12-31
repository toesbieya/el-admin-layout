<template>
    <div class="page-header">
        <span class="page-header-title">{{ title }}</span>

        <el-breadcrumb>
            <el-breadcrumb-item v-for="(item,index) in data" :key="item.path">
                <span :class="{'no-redirect': index !== data.length - 1}">{{ item.meta.title }}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
import {getRedirectPath} from "el-admin-layout/src/config"

export default {
    name: "PageHeader",

    data: () => ({data: [], title: ''}),

    watch: {
        $route: {
            immediate: true,
            handler(to) {
                const {path, meta: {title}, matched} = to
                if (!path.startsWith(getRedirectPath())) {
                    this.title = title
                    this.data = matched.filter(item => item.meta.title)
                }
            }
        }
    }
}
</script>
