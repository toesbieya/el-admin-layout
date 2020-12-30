<template>
    <el-drawer
        :visible="visible"
        :with-header="false"
        append-to-body
        size="288px"
        @close="close"
    >
        <div class="drawer-container">
            <el-divider>导航模式</el-divider>
            <div class="drawer-item">
                <checkbox-group v-model="setting.app.navMode" @input="changeNavMode">
                    <img-checkbox
                        v-for="{label, value, img} in navModes"
                        :key="value"
                        :label="label"
                        v-model="value"
                        :img="img"
                    />
                </checkbox-group>
            </div>

            <el-divider>页面设置</el-divider>
            <div class="drawer-item">
                <span>分层结构</span>
                <el-select
                    v-model="setting.page.position"
                    size="mini"
                    style="width: 80px"
                    @input="changePagePosition"
                >
                    <el-option value="top-bottom" label="上下"/>
                    <el-option value="left-right" label="左右"/>
                </el-select>
            </div>
            <div class="drawer-item">
                <span>显示logo</span>
                <el-switch v-model="setting.page.showLogo" @input="changePageShowLogo"/>
            </div>
            <div class="drawer-item">
                <span>显示页头</span>
                <el-switch v-model="setting.page.showPageHeader" @input="changePageShowHeader"/>
            </div>
            <div class="drawer-item">
                <span>显示返回顶部按钮</span>
                <el-switch v-model="setting.page.showBackToTop" @input="changePageBackToTop"/>
            </div>

            <el-divider>侧边栏设置</el-divider>
            <div class="drawer-item">
                <span>主题风格</span>
                <el-select
                    v-model="setting.aside.theme"
                    size="mini"
                    style="width: 80px"
                    @input="changeAsideTheme"
                >
                    <el-option value="light" label="亮色"/>
                    <el-option value="dark" label="暗色"/>
                </el-select>
            </div>
            <div class="drawer-item">
                <span>汉堡包位置</span>
                <el-select
                    v-model="setting.aside.hamburgerPosition"
                    size="mini"
                    style="width: 90px"
                    @input="changeAsideHamburgerPosition"
                >
                    <el-option value="aside" label="侧边栏"/>
                    <el-option value="head" label="导航栏"/>
                </el-select>
            </div>
            <div class="drawer-item">
                <span>手风琴效果</span>
                <el-switch v-model="setting.aside.uniqueOpen" @input="changeAsideUniqueOpen"/>
            </div>
            <div class="drawer-item">
                <span>折叠</span>
                <el-switch v-model="setting.aside.collapse" @input="changeAsideCollapse"/>
            </div>
            <div class="drawer-item">
                <span>折叠时显示上级</span>
                <el-switch v-model="setting.aside.showParentOnCollapse" @input="changeAsideCollapseParent"/>
            </div>
            <div class="drawer-item">
                <span>自动隐藏</span>
                <el-switch v-model="setting.aside.autoHide" @input="changeAsideAutoHide"/>
            </div>
            <div class="drawer-item">
                <span>显示搜索框</span>
                <el-switch v-model="setting.aside.search" @input="changeAsideSearch"/>
            </div>

            <el-divider>导航栏设置</el-divider>
            <div class="drawer-item">
                <span>主题风格</span>
                <el-select
                    v-model="setting.navbar.theme"
                    size="mini"
                    style="width: 80px"
                    @input="changeNavbarTheme"
                >
                    <el-option value="light" label="亮色"/>
                    <el-option value="dark" label="暗色"/>
                </el-select>
            </div>

            <el-divider>多页签设置</el-divider>
            <div class="drawer-item">
                <span>启用</span>
                <el-switch v-model="setting.tagsView.enabled" @input="changeTagsViewEnabled"/>
            </div>
            <div class="drawer-item">
                <span>启用缓存</span>
                <el-switch v-model="setting.tagsView.enableCache" @input="changeTagsViewEnableCache"/>
            </div>
            <div class="drawer-item">
                <span>启用快捷键切换</span>
                <el-switch v-model="setting.tagsView.shortcut" @input="changeTagsViewShortcut"/>
            </div>
            <div class="drawer-item">
                <span>持久化</span>
                <el-switch v-model="setting.tagsView.persistent" @input="changeTagsViewPersistent"/>
            </div>
        </div>
    </el-drawer>
</template>

<script>
import tagsViewPersistentMixin from "./mixin/tagsViewPersistent"
import tagsViewShortcutMixin from "./mixin/tagsViewShortcut"
import CheckboxGroup from "./component/checkbox/Group"
import ColorCheckbox from "./component/checkbox/ColorCheckbox"
import ImgCheckbox from "./component/checkbox/ImgCheckbox"
import {
    appGetters,
    appMutations,
    asideGetters,
    asideMutations,
    navbarGetters,
    navbarMutations,
    pageGetters,
    pageMutations,
    tagsViewGetters,
    tagsViewMutations
} from "el-admin-layout"
import {mergeObj} from "@example/util"
import {getLocalPersonalSettings, setLocalPersonalSettings} from "@example/util/storage"

export default {
    name: "SettingDrawer",

    mixins: [tagsViewPersistentMixin, tagsViewShortcutMixin],

    components: {CheckboxGroup, ColorCheckbox, ImgCheckbox},

    data() {
        return {
            //外部传入的获取vue根实例的函数
            getRoot: () => undefined,

            visible: false,

            navModes: [
                {
                    label: '侧边栏导航',
                    value: 'aside',
                    img: 'https://gw.alipayobjects.com/zos/antfincdn/XwFOFbLkSM/LCkqqYNmvBEbokSDscrm.svg'
                },
                {
                    label: '顶部导航',
                    value: 'head',
                    img: 'https://gw.alipayobjects.com/zos/antfincdn/URETY8%24STp/KDNDBbriJhLwuqMoxcAr.svg'
                },
                {
                    label: '混合导航',
                    value: 'mix',
                    img: 'https://gw.alipayobjects.com/zos/antfincdn/x8Ob%26B8cy8/LCkqqYNmvBEbokSDscrm.svg'
                },
                {
                    label: '双层侧边栏导航',
                    value: 'aside-two-part',
                    img: 'https://gw.alipayobjects.com/zos/antfincdn/XwFOFbLkSM/LCkqqYNmvBEbokSDscrm.svg'
                }
            ],

            setting: {
                app: {
                    navMode: 'mix'
                },
                page: {
                    position: 'left-right',
                    showLogo: true,
                    showPageHeader: true,
                    showBackToTop: true
                },
                aside: {
                    theme: 'dark',
                    hamburgerPosition: 'aside',
                    uniqueOpen: true,
                    collapse: false,
                    showParentOnCollapse: false,
                    autoHide: false,
                    search: true
                },
                navbar: {
                    theme: 'dark'
                },
                tagsView: {
                    enabled: true,
                    enableCache: true,
                    shortcut: true,
                    persistent: true
                }
            }
        }
    },

    methods: {
        close() {
            this.visible = false
        },

        //将此处的设置项数据同步到layout中的store
        syncLayoutStore() {
            const {app, page, aside, navbar, tagsView} = this.setting

            Object.entries(app).forEach(([k, v]) => appMutations[k](v))
            Object.entries(page).forEach(([k, v]) => pageMutations[k](v))
            Object.entries(aside).forEach(([k, v]) => asideMutations[k](v))
            Object.entries(navbar).forEach(([k, v]) => navbarMutations[k](v))
            tagsViewMutations.enabled(tagsView.enabled)
            tagsViewMutations.enableCache(tagsView.enableCache)
        },
        //将layout中的store数据同步到此处的设置项
        syncSettingDrawer() {
            const {app, page, aside, navbar, tagsView} = this.setting

            Object.keys(app).forEach(k => app[k] = appGetters[k])
            Object.keys(page).forEach(k => page[k] = pageGetters[k])
            Object.keys(aside).forEach(k => aside[k] = asideGetters[k])
            Object.keys(navbar).forEach(k => navbar[k] = navbarGetters[k])
            tagsView.enabled = tagsViewGetters.enabled
            tagsView.enableCache = tagsViewGetters.enableCache
        },
        //将此处的设置项保存到本地
        saveSetting() {
            this.syncSettingDrawer()
            setLocalPersonalSettings(this.setting)
        },

        changeNavMode(v) {
            appMutations.navMode(v)
        },

        changePagePosition(v) {
            pageMutations.position(v)
        },
        changePageShowLogo(v) {
            pageMutations.showLogo(v)
        },
        changePageShowHeader(v) {
            pageMutations.showPageHeader(v)
        },
        changePageBackToTop(v) {
            pageMutations.showBackToTop(v)
        },

        changeAsideTheme(v) {
            asideMutations.theme(v)
        },
        changeAsideHamburgerPosition(v) {
            asideMutations.hamburgerPosition(v)
        },
        changeAsideUniqueOpen(v) {
            asideMutations.uniqueOpen(v)
        },
        changeAsideCollapse(v) {
            asideMutations.collapse(v)
        },
        changeAsideCollapseParent(v) {
            asideMutations.showParentOnCollapse(v)
        },
        changeAsideAutoHide(v) {
            asideMutations.autoHide(v)
        },
        changeAsideSearch(v) {
            asideMutations.search(v)
        },

        changeNavbarTheme(v) {
            navbarMutations.theme(v)
        },

        changeTagsViewEnabled(v) {
            tagsViewMutations.enabled(v)
        },
        changeTagsViewEnableCache(v) {
            tagsViewMutations.enableCache(v)
        },
        changeTagsViewShortcut() {

        },
        changeTagsViewPersistent() {

        }
    },

    created() {
        //增强所有以change开头的方法
        for (const [key, value] of Object.entries(this)) {
            if (typeof value !== 'function' || !key.startsWith('change')) {
                continue
            }

            this[key] = (...arg) => {
                value.apply(this, arg)
                this.saveSetting()
            }
        }

        //将本地存储的数据合并到此处
        mergeObj(this.setting, getLocalPersonalSettings())

        //由于数据结构可能发生变化，所以在合并后覆盖本地数据
        setLocalPersonalSettings(this.setting)

        this.syncLayoutStore()
    }
}
</script>
