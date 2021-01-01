<template>
    <el-admin-layout :navbar-props="navbarProps" :aside-props="asideProps" :page-props="pageProps"/>
</template>

<script type="text/jsx">
import Vue from 'vue'
import ElAdminLayout, {appMutations} from 'el-admin-layout'
import Footer from './component/Footer'
import SettingDrawer from './component/SettingDrawer'

//设置一些基础信息
appMutations.title('el-admin-layout')
appMutations.logo('https://preview.pro.ant.design/static/logo.f0355d39.svg')
appMutations.menus([
    {
        fullPath: '/',
        meta: {title: '根菜单1', icon: 'el-icon-success'},
        children: [
            {
                fullPath: '/index',
                name: 'indexPage',
                meta: {title: '首页', icon: 'el-icon-platform-eleme', affix: true}
            },
            {
                fullPath: '/test',
                name: 'testPage',
                meta: {title: '测试页', icon: 'el-icon-phone'}
            },
            {
                fullPath: '/reuse/1',
                meta: {title: '复用路由1', icon: 'el-icon-phone'}
            },
            {
                fullPath: '/reuse/2',
                meta: {title: '复用路由2', icon: 'el-icon-phone'}
            },
            {
                fullPath: '/nest',
                meta: {title: '嵌套页', icon: 'el-icon-s-order'},
                children: [
                    {
                        fullPath: '/nest0',
                        meta: {title: '嵌套页0', icon: 'el-icon-s-order'}
                    },
                    {
                        fullPath: '/nest0-1',
                        meta: {title: '嵌套页0-1', icon: 'el-icon-s-order'}
                    }
                ]
            },
            {
                fullPath: '外链父级',
                meta: {title: '外链', icon: 'el-icon-s-flag'},
                children: [
                    {
                        fullPath: 'https://www.taobao.com',
                        meta: {title: '淘宝'}
                    },
                    {
                        fullPath: 'https://www.baidu.com',
                        meta: {title: '百度'}
                    }
                ]
            }
        ]
    },
    {
        fullPath: '/iframe',
        meta: {title: 'iframe', icon: 'el-icon-s-flag'},
        children: [
            {
                fullPath: '/iframe/taobao',
                meta: {title: '淘宝'}
            },
            {
                fullPath: '/iframe/baidu',
                meta: {title: '百度'}
            }
        ]
    }
])

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

            return customActions.concat(defaultActions)
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
