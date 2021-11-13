<template>
  <div>
    我是首页
    <input v-model="val"/>

    <div v-for="i in 10" :key="i" style="margin-top: 100px">超出滚动</div>
  </div>
</template>

<script>
export default {
  name: 'indexPage',

  data() {
    return {
      val: ''
    }
  }
}
</script>
