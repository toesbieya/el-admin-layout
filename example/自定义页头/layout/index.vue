<template>
  <el-admin-layout>
    <template v-slot:page-header>
      <div style="width: 100%;text-align: center">我是自定义页头</div>
    </template>
  </el-admin-layout>
</template>

<script>
import ElAdminLayout, { appMutations } from 'el-admin-layout'
import menus from '@example/common/menu'

appMutations.title('自定义页头')
appMutations.menus(menus)

export default {
  name: 'Layout',

  components: { ElAdminLayout }
}
</script>
