<template>
    <div style="height: 100%">
        <el-admin-layout/>

        <setting-drawer ref="setting-drawer"/>

        <el-button
            type="primary"
            style="position: fixed;top: 50%;left: 50%"
            @click="openSettingDrawer"
        >
            打开设置抽屉
        </el-button>
    </div>
</template>

<script>
import ElAdminLayout, {appMutations} from 'el-admin-layout'
import menus from "@example/common/menu"
import SettingDrawer from "./SettingDrawer"

appMutations.title('设置抽屉')
appMutations.menus(menus)

export default {
    name: "Layout",

    components: {ElAdminLayout, SettingDrawer},

    methods: {
        openSettingDrawer() {
            this.$refs['setting-drawer'].visible = true
        }
    }
}
</script>
