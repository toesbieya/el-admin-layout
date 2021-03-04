<template>
    <el-admin-layout>
        <template v-slot:aside-menu-icon="{menu, depth}">
            <i v-if="menu.meta.title === '首页'" class="menu-icon el-icon-eleme"/>
            <i v-else-if="menu.children" class="menu-icon el-icon-folder"/>
            <i v-else-if="depth === 1" class="menu-icon el-icon-check"/>
            <i v-else class="menu-icon el-icon-close"/>
        </template>

        <template v-slot:aside-menu-content="{menu, depth}">
            <span>我的深度：{{depth}}</span>
        </template>

        <template v-slot:header-menu-content="{menu}">
            <span>{{ menu.meta.title }}</span>
            <span v-if="menu.meta.title === '根菜单'" class="menu-tag">new</span>
        </template>
    </el-admin-layout>
</template>

<script>
import ElAdminLayout, {appMutations, asideMutations} from 'el-admin-layout'
import menus from "@example/common/menu"

appMutations.title('自定义menu')
appMutations.menus(menus)
asideMutations.showParentOnCollapse(true)

export default {
    name: "Layout",

    components: {ElAdminLayout}
}
</script>
