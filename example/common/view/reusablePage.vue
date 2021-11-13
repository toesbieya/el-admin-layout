<template>
  <div>
    <h2>这是组件被复用的路由页面{{ id }}</h2>
    <input v-model="val"/>
  </div>
</template>

<script>
export default {
  name: 'reusablePage',

  props: ['id'],

  data() {
    return {
      val: ''
    }
  },

  mounted() {

  }
}
</script>
