<template>
  <el-admin-layout>
    <template #tags-view-item="{key, active, on, title, close}">
      <div :key="key" :class="{'tags-view-item': true, 'active': active}" v-on="on">
        <div class="tags-view-item__title">{{ title }}</div>
        <div v-if="close" class="tags-view-item__close" @click="close">
          <i class="el-icon-close"/>
        </div>
        <div class="tags-view-item__divider"/>
      </div>
    </template>
  </el-admin-layout>
</template>

<script>
import ElAdminLayout, { appMutations } from 'el-admin-layout'
import menus from '@example/common/menu'

appMutations.title('仿chrome页签')
appMutations.menus(menus)

export default {
  name: 'Layout',

  components: { ElAdminLayout }
}
</script>
