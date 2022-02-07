<template>
  <div class="horizontal-scroller" @wheel="onWheel">
    <slot/>
  </div>
</template>

<script>
/**
 * 水平滚动区域，能够通过鼠标滚轮来进行水平滚动，用于页签栏
 * 借鉴[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
 */

import Scroller from './Scroller'

export default {
  name: 'HorizontalScroller',

  methods: {
    /**
     * 将指定元素以及其相邻元素移动至视窗内，外部调用
     * @param target {Element}
     */
    moveToTarget(target) {
      this.$scroller.moveToTarget(target, this.$el)
    },

    onWheel(event) {
      this.$scroller.onWheel(event, this.$el)
    }
  },

  created() {
    this.$scroller = new Scroller()
    this.$once('hook:beforeDestroy', () => {
      delete this.$scroller
    })
  }
}
</script>
