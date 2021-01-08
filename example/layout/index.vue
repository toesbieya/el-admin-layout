<template>
    <el-admin-layout :navbar-props="navbarProps" :aside-props="asideProps" :page-props="pageProps"/>
</template>

<script type="text/jsx">
import Vue from 'vue'
import ElAdminLayout, {appMutations} from 'el-admin-layout'
import menus from "@example/menu"
import Footer from './component/Footer'
import SettingDrawer from './component/SettingDrawer'

//设置一些基础信息
appMutations.title('el-admin-layout')
appMutations.logo('https://preview.pro.ant.design/static/logo.f0355d39.svg')
appMutations.menus(menus)

export default {
    name: "Layout",

    components: {ElAdminLayout},

    computed: {
        navbarProps() {
            return {
                username: '测试用户',
                userDropdownItems: [
                    {
                        icon: 'el-icon-switch-button',
                        command: 'logout',
                        content: '退出登录',
                        handler: this.logout
                    }
                ],
                renderCustomActions: this.renderNavbarActions
            }
        },

        asideProps() {
            return {
                showIconMaxDepth: -1
            }
        },

        pageProps() {
            return {
                renderFooter: () => <Footer/>
            }
        }
    },

    methods: {
        logout() {

        },

        openSettingDrawer() {
            this.$_settingDrawerInstance.visible = true
        },

        renderNavbarActions(defaultActions) {
            const customActions = [
                <div
                    class="setting-btn navbar-item"
                    title="个性设置"
                    on-click={this.openSettingDrawer}
                >
                    <i class="el-icon-s-operation navbar-icon"/>
                </div>
            ]

            return customActions.concat(defaultActions.map(f => f()))
        }
    },

    //提前创建设置抽屉，避免初始化同步设置数据时导致layout重新渲染
    beforeCreate() {
        const Drawer = Vue.extend(SettingDrawer)
        const instance = new Drawer({data: {getRoot: () => this}}).$mount()
        document.body.appendChild(instance.$el)
        this.$_settingDrawerInstance = instance
    },

    //销毁时清除设置抽屉
    beforeDestroy() {
        if (this.$_settingDrawerInstance) {
            this.$_settingDrawerInstance.$destroy()
            this.$_settingDrawerInstance.$el.remove()
            delete this.$_settingDrawerInstance
        }
    },

    mounted() {

    }
}
</script>
