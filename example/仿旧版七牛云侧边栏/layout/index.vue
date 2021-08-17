<template>
    <el-admin-layout>
        <!--移动端时恢复成默认的侧边栏-->
        <template v-if="!isMobile" v-slot:aside="props">
            <v-root/>
            <v-sub/>
        </template>
    </el-admin-layout>
</template>

<script>
import ElAdminLayout, {appGetters, appMutations} from 'el-admin-layout'
import menus from '@example/common/menu'
import VRoot from './OldQiniuSidebar/root'
import VSub from './OldQiniuSidebar/sub'

appMutations.title('仿旧版七牛云侧边栏')
appMutations.menus(menus)
//只渲染侧边栏
appMutations.navMode('aside')

export default {
    name: 'Layout',

    components: {ElAdminLayout, VRoot, VSub},

    computed: {
        isMobile: () => appGetters.isMobile
    }
}
</script>
