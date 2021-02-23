<template>
    <el-admin-layout
        :header-props="headerProps"
        :menu-item-content-renderer="menuItemContentRenderer"
    >
        <template v-slot:menuItemContent="{menu, depth, context}">
            <span>{{ menu.meta.title }}</span>

            <span
                v-if="menu.meta.title === '首页' && (depth > 1 || !context.collapse)"
                class="menu-tag menu-tag--danger"
            >
                new
            </span>
        </template>

        <template v-slot:pageFooter>
            <page-footer/>
        </template>

        <template v-if="renderOldQiniuSidebar" v-slot:asideDefault="props">
            <old-qiniu-sidebar/>
        </template>

        <el-backtop target=".page-main .scroll-container" :visibility-height="400" :bottom="66">
            <i class="el-icon-top"/>
        </el-backtop>

        <setting-drawer v-model="showSettingDrawer"/>
    </el-admin-layout>
</template>

<script type="text/jsx">
import ElAdminLayout, {appGetters, appMutations} from 'el-admin-layout'
import menus from "@example/menu"
import PageFooter from './component/Footer'
import OldQiniuSidebar from './component/OldQiniuSidebar'
import SettingDrawer from './component/SettingDrawer'

//设置一些基础信息
appMutations.title('el-admin-layout')
appMutations.logo('https://preview.pro.ant.design/static/logo.f0355d39.svg')
appMutations.menus(menus)

export default {
    name: "Layout",

    components: {ElAdminLayout, PageFooter, OldQiniuSidebar, SettingDrawer},

    data: () => ({showSettingDrawer: false}),

    computed: {
        headerProps() {
            return {
                username: '测试用户',
                userDropdownItems: [
                    {
                        icon: 'el-icon-switch-button',
                        content: '退出登录',
                        handler: this.logout
                    }
                ],
                renderCustomActions: this.renderHeaderActions
            }
        },
        menuItemContentRenderer() {
            return (h, {menu, highlight, context}) => {
                return <span>{highlight || menu.meta.title}</span>
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
        },

        renderHeaderActions(defaultActions) {
            const customActions = [
                <div
                    class="setting-btn header-item"
                    title="个性设置"
                    on-click={this.openSettingDrawer}
                >
                    <i class="el-icon-s-operation header-icon"/>
                </div>
            ]

            return customActions.concat(defaultActions.map(f => f()))
        }
    },

    mounted() {

    }
}
</script>
