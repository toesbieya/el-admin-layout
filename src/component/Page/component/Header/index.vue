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
import {Const} from "el-admin-layout"

export default {
    name: "PageHeader",

    data: () => ({data: [], title: ''}),

    watch: {
        $route: {
            immediate: true,
            handler(to) {
                const {path, matched} = to

                if (!path.startsWith(Const.redirectPath)) {
                    this.title = Const.routerTitleGenerator(to)
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
