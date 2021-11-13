<template>
  <div>
    我是测试页
    <input v-model="val"/>
  </div>
</template>

<script>
export default {
  name: 'testPage',

  data() {
    return {
      val: ''
    }
  }
}
</script>
