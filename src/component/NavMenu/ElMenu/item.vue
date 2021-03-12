<template>
    <li :class="className" :style="paddingStyle" @click="handleClick">
        <el-tooltip v-if="showTooltip" effect="dark" placement="right">
            <template v-slot:content>
                <slot name="title"/>
            </template>
            <div :style="iconContainerStyle">
                <slot/>
            </div>
        </el-tooltip>

        <template v-else>
            <slot/>
            <slot name="title"/>
        </template>
    </li>
</template>

<script>
/**
 * 改写el-menu-item
 *
 * 移除了所有背景色、hover颜色，由样式控制
 */

import MenuMixin from './mixin'
import {MenuItem} from 'element-ui'

export default {
    ...MenuItem,

    mixins: [MenuMixin, MenuItem.mixins.slice(1)],

    computed: {
        active: MenuItem.computed.active,
        className() {
            return {
                'el-menu-item': true,
                'is-active': this.active,
                'is-disabled': this.disabled
            }
        },
        showTooltip() {
            return this.parentMenu.$options.componentName === 'ElMenu' && this.rootMenu.collapse && this.$slots.title
        },
        iconContainerStyle() {
            return `position: absolute;left: 0;top: 0;height: 100%;width: 100%;display: inline-block;box-sizing: border-box;padding: 0 ${this.inlineIndent}px;`
        }
    },

    methods: {
        handleClick: MenuItem.methods.handleClick
    }
}
</script>
