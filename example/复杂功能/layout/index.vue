<template>
    <div style="height: 100%">
        <el-admin-layout :header-props="headerProps">
            <template v-slot:menuContent="{menu, depth, context}">
                <span>{{ menu.meta.title }}</span>

                <span
                    v-if="menu.meta.title === '首页' && (depth > 1 || !context.collapse)"
                    class="menu-tag menu-tag--danger"
                >
                new
            </span>
            </template>

            <template v-slot:headerRight="defaultContent">
                <header-right :default="defaultContent"/>
            </template>

            <template v-if="renderOldQiniuSidebar" v-slot:asideDefault="props">
                <old-qiniu-sidebar/>
            </template>

            <template v-slot:pageFooter>
                <page-footer/>
            </template>
        </el-admin-layout>

        <el-backtop target=".page-content" :visibility-height="400" :bottom="66">
            <i class="el-icon-top"/>
        </el-backtop>

        <setting-drawer v-model="showSettingDrawer"/>
    </div>
</template>

<script type="text/jsx">
import ElAdminLayout, {appGetters, appMutations, headerMutations} from 'el-admin-layout'
import menus from "@example/common/menu"
import PageFooter from './component/Footer'
import OldQiniuSidebar from './component/OldQiniuSidebar'
import SettingDrawer from './component/SettingDrawer'

//设置一些基础信息
appMutations.title('el-admin-layout')
appMutations.logo('https://preview.pro.ant.design/static/logo.f0355d39.svg')
appMutations.menus(menus)
headerMutations.username('测试用户')

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

    data: () => ({showSettingDrawer: false}),

    computed: {
        headerProps() {
            return {
                username: '测试用户',
                dropdownItems: [
                    {
                        icon: 'el-icon-switch-button',
                        content: '退出登录',
                        handler: this.logout
                    }
                ]
            }
        },

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
            this.showSettingDrawer = true
        }
    },

    mounted() {
        //setTimeout(() => this.showSettingDrawer = true, 1000)
    }
}
</script>
