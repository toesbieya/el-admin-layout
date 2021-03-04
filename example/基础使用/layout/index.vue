<template>
    <el-admin-layout/>
</template>

<script>
import ElAdminLayout, {appMutations} from 'el-admin-layout'
import menus from "@example/common/menu"

appMutations.title('基础使用')
appMutations.menus(menus)

export default {
    name: "Layout",

    components: {ElAdminLayout}
}
</script>
