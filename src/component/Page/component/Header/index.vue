<template>
    <div class="page-header">
        <span class="page-header-title">{{ title }}</span>

        <breadcrumb/>
    </div>
</template>

<script>
import {Const} from "el-admin-layout"
import Breadcrumb from "el-admin-layout/src/component/Breadcrumb"

export default {
    name: "PageHeader",

    components: {Breadcrumb},

    computed: {
        title() {
            return  Const.routerTitleGenerator(this.$route)
        }
    }
}
</script>
