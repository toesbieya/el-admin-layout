<template>
    <div style="height: 100%">
        <el-admin-layout>
            <template v-slot:menu-content="{menu, depth, context}">
                <span>{{ menu.meta.title }}</span>

                <span
                    v-if="menu.meta.title === '首页' && (depth > 1 || !context.collapse)"
                    class="menu-tag menu-tag--danger"
                >
                    new
                </span>
            </template>

            <template v-slot:header-right="defaultContent">
                <header-right :default="defaultContent"/>
            </template>

            <template v-if="renderOldQiniuSidebar" v-slot:aside="props">
                <old-qiniu-sidebar/>
            </template>

            <template v-slot:page-footer>
                <page-footer/>
            </template>
        </el-admin-layout>

        <el-backtop target=".page-content" :visibility-height="400" :bottom="66">
            <i class="el-icon-top"/>
        </el-backtop>

        <setting-drawer ref="setting-drawer"/>
    </div>
</template>

<script>
import ElAdminLayout, {appGetters, appMutations, headerMutations} from 'el-admin-layout'
import menus from "@example/common/menu"
import PageFooter from './component/Footer'
import OldQiniuSidebar from './component/OldQiniuSidebar'
import SettingDrawer from './component/SettingDrawer'

//设置一些基础信息
appMutations.title('el-admin-layout')
appMutations.logo('https://preview.pro.ant.design/static/logo.f0355d39.svg')
appMutations.menus(menus)


export default {
    name: "Layout",

    components: {
        ElAdminLayout, PageFooter, OldQiniuSidebar, SettingDrawer,

        HeaderRight: {
            functional: true,

            props: {default: Array},

            render(h, context) {
                const custom = [
                    <div
                        class="setting-btn header-item"
                        title="个性设置"
                        on-click={context.parent.openSettingDrawer}
                    >
                        <i class="el-icon-s-operation header-icon"/>
                    </div>
                ]
                return custom.concat(context.props.default)
            }
        }
    },

    computed: {
        //仅在非移动端且navMode为aside-two-part时渲染
        renderOldQiniuSidebar() {
            return !appGetters.isMobile && this.$store.state.setting.app.navMode === 'aside-two-part'
        }
    },

    methods: {
        logout() {
            console.log('logout')
        },

        openSettingDrawer() {
            this.$refs['setting-drawer'].visible = true
        }
    },

    created() {
        headerMutations.username('测试用户')
        headerMutations.dropdownItems([{
            icon: 'el-icon-switch-button',
            content: '退出登录',
            handler: this.logout
        }])
    }
}
</script>
