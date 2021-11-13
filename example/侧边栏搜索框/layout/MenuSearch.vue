<template>
  <div class="aside-menu-search">
    <el-input
      v-model="value"
      size="mini"
      clearable
      placeholder="搜索菜单"
      prefix-icon="el-icon-search"
      @input="search"
    />
  </div>
</template>

<script>
import { debounce } from '@example/common/util'

export default {
  name: 'MenuSearch',

  data: () => ({ value: '' }),

  methods: {
    search(v) {
      this.$emit('search', v)
    }
  },

  created() {
    this.search = debounce(this.search, 300)
  },

  beforeDestroy() {
    this.$emit('search', '')
  }
}
</script>
