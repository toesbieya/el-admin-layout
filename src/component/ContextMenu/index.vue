<template>
  <ul
    v-show="value"
    class="context-menu"
    :style="style"
    @contextmenu.prevent
    @click="onClick"
  >
    <li
      v-for="(i, index) in menuItems"
      :key="i.content"
      :data-index="index"
      class="context-menu-item"
    >
      {{ i.content }}
    </li>
  </ul>
</template>

<script>
/**
 * 右键菜单，用于页签栏，右键点击页签时弹出
 */

export default {
  name: 'ContextMenu',

  props: {
    // 是否显示，支持v-modal
    value: Boolean,
    // 菜单定义数组，{content: string 菜单文字, click: function 点击菜单时触发的函数}
    items: Array,
    // 菜单距离屏幕左侧的距离，单位px
    left: Number,
    // 菜单距离屏幕顶部的距离，单位px
    top: Number,
    // 菜单距离屏幕边缘的最小距离，单位px
    minDistance: { type: Number, default: 10 }
  },

  data() {
    this.willAutoAdaptLeft = false
    this.willAutoAdaptTop = false
    return {
      realLeft: '0px',
      realTop: '0px'
    }
  },

  computed: {
    style() {
      return { left: this.realLeft, top: this.realTop }
    },

    menuItems() {
      return this.items.filter(Boolean)
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(v) {
        document.body[v ? 'addEventListener' : 'removeEventListener']('click', this.close)
        if (v) {
          this.willAutoAdaptLeft = true
          this.willAutoAdaptTop = true
          this.$nextTick(this.autoAdapt)
        }
      }
    },
    left: {
      immediate: true,
      handler: 'autoAdaptLeft'
    },
    top: {
      immediate: true,
      handler: 'autoAdaptTop'
    }
  },

  methods: {
    close() {
      this.$emit('input', false)
    },
    autoAdapt() {
      this.autoAdaptTop(this.top)
      this.autoAdaptLeft(this.left)
    },
    autoAdaptTop(v) {
      if (this.willAutoAdaptTop) {
        this.willAutoAdaptTop = false
        return
      }
      if (!this.value || v == null) return

      const elHeight = this.$el.offsetHeight
      const remainHeight = document.body.clientHeight - v - this.minDistance
      const over = elHeight - remainHeight
      const finalTop = over > 0 ? v - over : v

      this.realTop = `${finalTop}px`
    },
    autoAdaptLeft(v) {
      if (this.willAutoAdaptLeft) {
        this.willAutoAdaptLeft = false
        return
      }
      if (!this.value || v == null) return

      const elWidth = this.$el.offsetWidth
      const remainWidth = document.body.clientWidth - v - this.minDistance
      const over = elWidth - remainWidth
      const finalLeft = over > 0 ? v - over : v

      this.realLeft = `${finalLeft}px`
    },

    /**
     * 事件代理
     *
     * @param event {Event}
     */
    onClick(event) {
      if (!event.target.classList.contains('context-menu-item')) {
        return
      }

      const index = Number(event.target.dataset.index)
      const menuItem = this.menuItems[index]

      menuItem && menuItem.click()
    }
  },

  beforeDestroy() {
    document.body.removeEventListener('click', this.close)
  }
}
</script>
