<template>
    <div class="page-header">
        <span class="page-header-title">{{ title }}</span>

        <breadcrumb/>
    </div>
</template>

<script>
import Breadcrumb from "el-admin-layout/src/component/Breadcrumb"
import {getRouterTitle} from "el-admin-layout/src/config/logic"

export default {
    name: "PageHeader",

    components: {Breadcrumb},

    computed: {
        title() {
            return  getRouterTitle(this.$route)
        }
    }
}
</script>
