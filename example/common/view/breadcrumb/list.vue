<template>
  <div>
    这是列表页
    <button @click="$router.push('/breadcrumb/detail/1')">点击进入下级详情页</button>
  </div>
</template>

<script>
export default {
  name: 'ListBreadcrumb'
}
</script>
