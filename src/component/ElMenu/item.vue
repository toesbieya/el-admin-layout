<template>
  <li :class="className" :style="paddingStyle" @click="handleClick">
    <el-tooltip v-if="showTooltip" effect="dark" placement="right">
      <div :style="iconContainerStyle">
        <slot/>
      </div>
      <template v-slot:content>
        <slot name="title"/>
      </template>
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
import { MenuItem } from 'element-ui'

export default {
  name: MenuItem.name,

  componentName: MenuItem.componentName,

  mixins: [MenuMixin, ...MenuItem.mixins.slice(1)],

  props: MenuItem.props,

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
      return this.parentMenu.$options.componentName === 'ElMenu' && this.rootMenu.collapse
    },
    iconContainerStyle() {
      return `position: absolute;left: 0;top: 0;height: 100%;width: 100%;display: inline-block;box-sizing: border-box;padding: 0 ${this.inlineIndent}px;`
    }
  },

  methods: {
    handleClick: MenuItem.methods.handleClick
  },

  mounted: MenuItem.mounted,

  beforeDestroy: MenuItem.beforeDestroy
}
</script>
