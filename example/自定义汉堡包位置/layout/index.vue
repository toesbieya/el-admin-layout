<template>
    <div style="height: 100%">
        <el-admin-layout>
            <template v-if="position === 'header'" v-slot:header-left="defaultContent">
                <header-left :default="defaultContent"/>
            </template>
        </el-admin-layout>

        <div style="position: fixed;top: 40%;left: 40%">
            <label>汉堡包位置：</label>
            <el-radio-group v-model="position" @change="onPositionChange">
                <el-radio label="aside">侧边栏</el-radio>
                <el-radio label="header">顶栏</el-radio>
            </el-radio-group>
        </div>
    </div>
</template>

<script>
import ElAdminLayout, {appMutations, asideMutations} from 'el-admin-layout'
import HeaderLeft from './HeaderLeft'
import menus from "@example/common/menu"

appMutations.title('自定义汉堡包位置')
appMutations.menus(menus)

export default {
    name: "Layout",

    components: {ElAdminLayout, HeaderLeft},

    data: () => ({position: 'aside'}),

    methods: {
        onPositionChange(v) {
            asideMutations.showHamburger(v === 'aside')
        }
    }
}
</script>
