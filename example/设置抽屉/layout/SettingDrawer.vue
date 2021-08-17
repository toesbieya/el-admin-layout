<template>
    <el-drawer
            :visible="visible"
            :with-header="false"
            custom-class="setting-drawer"
            append-to-body
            size="300px"
            @close="visible = false"
    >
        <el-divider>app</el-divider>
        <div class="setting-drawer-item">
            <span>标题</span>
            <el-input
                    :value="appGetters.title"
                    @input="v => onChange('appMutations', 'title', v)"
            />
        </div>
        <div class="setting-drawer-item">
            <span>logo地址</span>
            <el-input
                    :value="appGetters.logo"
                    @input="v => onChange('appMutations', 'logo', v)"
            />
        </div>
        <div class="setting-drawer-item">
            <span>显示logo</span>
            <el-switch
                    :value="appGetters.showLogo"
                    @input="v => onChange('appMutations', 'showLogo', v)"
            />
        </div>
        <div class="setting-drawer-item">
            <span>分层结构</span>
            <el-select
                    :value="appGetters.struct"
                    @input="v => onChange('appMutations', 'struct', v)"
            >
                <el-option value="top-bottom" label="上下"/>
                <el-option value="left-right" label="左右"/>
            </el-select>
        </div>
        <div class="setting-drawer-item">
            <span>导航模式</span>
            <el-select
                    :value="appGetters.navMode"
                    @input="v => onChange('appMutations', 'navMode', v)"
            >
                <el-option value="aside" label="侧边栏"/>
                <el-option value="head" label="顶部"/>
                <el-option value="mix" label="混合"/>
            </el-select>
        </div>

        <el-divider>aside</el-divider>
        <div class="setting-drawer-item">
            <span>主题</span>
            <el-select
                    :value="asideGetters.theme"
                    @input="v => onChange('asideMutations', 'theme', v)"
            >
                <el-option value="light" label="亮色"/>
                <el-option value="dark" label="暗色"/>
            </el-select>
        </div>
        <div class="setting-drawer-item">
            <span>手风琴</span>
            <el-switch
                    :value="asideGetters.uniqueOpen"
                    @input="v => onChange('asideMutations', 'uniqueOpen', v)"
            />
        </div>
        <div class="setting-drawer-item">
            <span>折叠</span>
            <el-switch
                    :value="asideGetters.collapse"
                    @input="v => onChange('asideMutations', 'collapse', v)"
            />
        </div>
        <div class="setting-drawer-item">
            <span>折叠时显示上级菜单</span>
            <el-switch
                    :value="asideGetters.showParentOnCollapse"
                    @input="v => onChange('asideMutations', 'showParentOnCollapse', v)"
            />
        </div>
        <div class="setting-drawer-item">
            <span>显示汉堡包</span>
            <el-switch
                    :value="asideGetters.showHamburger"
                    @input="v => onChange('asideMutations', 'showHamburger', v)"
            />
        </div>
        <div class="setting-drawer-item">
            <span>自动隐藏</span>
            <el-switch
                    :value="asideGetters.autoHide"
                    @input="v => onChange('asideMutations', 'autoHide', v)"
            />
        </div>

        <el-divider>header</el-divider>
        <div class="setting-drawer-item">
            <span>主题</span>
            <el-select
                    :value="headerGetters.theme"
                    @input="v => onChange('headerMutations', 'theme', v)"
            >
                <el-option value="light" label="亮色"/>
                <el-option value="dark" label="暗色"/>
            </el-select>
        </div>
        <div class="setting-drawer-item">
            <span>头像地址</span>
            <el-input
                    :value="headerGetters.avatar"
                    @input="v => onChange('headerMutations', 'avatar', v)"
            />
        </div>
        <div class="setting-drawer-item">
            <span>用户名称</span>
            <el-input
                    :value="headerGetters.username"
                    @input="v => onChange('headerMutations', 'username', v)"
            />
        </div>

        <el-divider>page</el-divider>
        <div class="setting-drawer-item">
            <span>启用过渡动画</span>
            <el-switch
                    :value="pageGetters.enableTransition"
                    @input="v => onChange('pageMutations', 'enableTransition', v)"
            />
        </div>
        <div class="setting-drawer-item">
            <span>显示页头</span>
            <el-switch
                    :value="pageGetters.showHeader"
                    @input="v => onChange('pageMutations', 'showHeader', v)"
            />
        </div>

        <el-divider>tagsView</el-divider>
        <div class="setting-drawer-item">
            <span>启用</span>
            <el-switch
                    :value="tagsViewGetters.enabled"
                    @input="v => onChange('tagsViewMutations', 'enabled', v)"
            />
        </div>
        <div class="setting-drawer-item">
            <span>启用缓存功能</span>
            <el-switch
                    :value="tagsViewGetters.enableCache"
                    @input="v => onChange('tagsViewMutations', 'enableCache', v)"
            />
        </div>
        <div class="setting-drawer-item">
            <span>根据页签顺序确定过渡动画</span>
            <el-switch
                    :value="tagsViewGetters.enableChangeTransition"
                    @input="v => onChange('tagsViewMutations', 'enableChangeTransition', v)"
            />
        </div>
    </el-drawer>
</template>

<script>
import {
    appGetters,
    appMutations,
    asideGetters,
    asideMutations,
    headerGetters,
    headerMutations,
    tagsViewGetters,
    tagsViewMutations,
    pageGetters,
    pageMutations
} from 'el-admin-layout'

export default {
    name: 'SettingDrawer',

    //让el-input、el-select的size为mini
    provide: () => ({elFormItem: {elFormItemSize: 'mini'}}),

    data: () => ({visible: false}),

    methods: {
        onChange(mutation, prop, v) {
            this.getMutation(mutation)[prop](v)
        },

        getMutation(str) {
            switch (str) {
                case 'appMutations':
                    return appMutations
                case 'asideMutations':
                    return asideMutations
                case 'headerMutations':
                    return headerMutations
                case 'tagsViewMutations':
                    return tagsViewMutations
                case 'pageMutations':
                    return pageMutations
            }
        }
    },

    created() {
        Object
            .entries({appGetters, asideGetters, headerGetters, tagsViewGetters, pageGetters})
            .forEach(([k, v]) => this[k] = v)
    }
}
</script>
