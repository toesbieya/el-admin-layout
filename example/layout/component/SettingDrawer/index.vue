<template>
    <el-drawer
        :visible="visible"
        :with-header="false"
        custom-class="setting-drawer"
        append-to-body
        size="300px"
        @close="close"
    >
        <el-divider>导航模式</el-divider>
        <div class="setting-drawer-item">
            <checkbox-group v-model="setting.app.navMode">
                <img-checkbox
                    v-for="{label, value, img} in navModes"
                    :key="value"
                    :label="label"
                    v-model="value"
                    :img="img"
                />
            </checkbox-group>
        </div>

        <el-divider>顶栏设置</el-divider>
        <div class="setting-drawer-item">
            <span>主题风格</span>
            <el-select
                v-model="setting.header.theme"
                size="mini"
                style="width: 80px"
            >
                <el-option value="light" label="亮色"/>
                <el-option value="dark" label="暗色"/>
            </el-select>
        </div>

        <el-divider>侧边栏设置</el-divider>
        <div class="setting-drawer-item">
            <span>主题风格</span>
            <el-select
                v-model="setting.aside.theme"
                size="mini"
                style="width: 80px"
            >
                <el-option value="light" label="亮色"/>
                <el-option value="dark" label="暗色"/>
            </el-select>
        </div>
        <div class="setting-drawer-item">
            <span>手风琴效果</span>
            <el-switch v-model="setting.aside.uniqueOpen"/>
        </div>
        <div class="setting-drawer-item">
            <span>折叠</span>
            <el-switch v-model="setting.aside.collapse"/>
        </div>
        <div class="setting-drawer-item">
            <span>折叠时显示上级</span>
            <el-switch v-model="setting.aside.showParentOnCollapse"/>
        </div>
        <div class="setting-drawer-item">
            <span>自动隐藏</span>
            <el-switch v-model="setting.aside.autoHide"/>
        </div>
        <div class="setting-drawer-item">
            <span>显示搜索框</span>
            <el-switch v-model="setting.aside.search"/>
        </div>

        <el-divider>页面设置</el-divider>
        <div class="setting-drawer-item">
            <span>分层结构</span>
            <el-select
                v-model="setting.page.position"
                size="mini"
                style="width: 80px"
            >
                <el-option value="top-bottom" label="上下"/>
                <el-option value="left-right" label="左右"/>
            </el-select>
        </div>
        <div class="setting-drawer-item">
            <span>显示logo</span>
            <el-switch v-model="setting.page.showLogo"/>
        </div>
        <div class="setting-drawer-item">
            <span>显示页头</span>
            <el-switch v-model="setting.page.showHeader"/>
        </div>
        <div class="setting-drawer-item">
            <span>显示页脚</span>
            <el-switch v-model="setting.page.showFooter"/>
        </div>

        <el-divider>多页签设置</el-divider>
        <div class="setting-drawer-item">
            <span>启用</span>
            <el-switch v-model="setting.tagsView.enabled"/>
        </div>
        <div class="setting-drawer-item">
            <span>启用缓存</span>
            <el-switch v-model="setting.tagsView.enableCache"/>
        </div>
        <div class="setting-drawer-item">
            <span>启用快捷键切换</span>
            <el-switch v-model="setting.tagsView.shortcut"/>
        </div>
        <div class="setting-drawer-item">
            <span>持久化</span>
            <el-switch v-model="setting.tagsView.persistent"/>
        </div>

        <el-divider/>
        <el-button
            type="primary"
            size="medium"
            icon="el-icon-delete"
            @click="clearCacheAndReload"
        >
            清除设置缓存并刷新
        </el-button>
    </el-drawer>
</template>

<script>
import tagsViewPersistentMixin from "./mixin/tagsViewPersistent"
import tagsViewShortcutMixin from "./mixin/tagsViewShortcut"
import CheckboxGroup from "./component/checkbox/Group"
import ColorCheckbox from "./component/checkbox/ColorCheckbox"
import ImgCheckbox from "./component/checkbox/ImgCheckbox"
import {appMutations, asideMutations, headerMutations, pageMutations, tagsViewMutations} from "el-admin-layout"
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
                    showHeader: true,
                    showFooter: true
                },
                aside: {
                    theme: 'dark',
                    uniqueOpen: true,
                    collapse: false,
                    showParentOnCollapse: false,
                    autoHide: false,
                    search: true
                },
                header: {
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

        //设置抽屉的数据结构与本地存储不一致时，可能导致layout渲染异常，所以加了这个功能
        clearCacheAndReload() {
            setLocalPersonalSettings()
            window.location.reload()
        },

        getMutationsByType(type) {
            switch (type) {
                case 'app':
                    return appMutations
                case 'aside':
                    return asideMutations
                case 'header':
                    return headerMutations
                case 'page':
                    return pageMutations
                case 'tagsView':
                    return tagsViewMutations
            }
        },

        //将此处的设置项数据同步到layout中的store
        syncLayoutStore() {
            const {app, page, aside, header, tagsView} = this.setting

            Object.entries(app).forEach(([k, v]) => appMutations[k](v))

            pageMutations.position(page.position)
            pageMutations.showLogo(page.showLogo)
            pageMutations.showHeader(page.showHeader)
            pageMutations.showFooter(page.showFooter)

            Object.entries(aside).forEach(([k, v]) => asideMutations[k](v))

            Object.entries(header).forEach(([k, v]) => headerMutations[k](v))

            tagsViewMutations.enabled(tagsView.enabled)
            tagsViewMutations.enableCache(tagsView.enableCache)
        }
    },

    created() {
        //将本地存储的数据合并到此处
        mergeObj(this.setting, getLocalPersonalSettings())

        //由于数据结构可能发生变化，所以在合并后覆盖本地数据
        setLocalPersonalSettings(this.setting)

        this.syncLayoutStore()

        //监听设置数据的变化
        const noop = () => undefined
        Object.entries(this.setting).forEach(([type, v]) => {
            const mutations = this.getMutationsByType(type)

            Object.keys(v).forEach(key => {
                const mutation = (() => {
                    const fun = mutations[key]

                    //像tagsView中就有两项是没有对应的修改方法的
                    return fun ? newVal => fun(newVal) : noop
                })()

                this.$watch(
                    `setting.${type}.${key}`,
                    v => {
                        mutation(v)
                        setLocalPersonalSettings(this.setting)
                    }
                )
            })
        })
    }
}
</script>
