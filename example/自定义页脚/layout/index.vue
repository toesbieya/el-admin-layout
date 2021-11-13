<template>
  <el-admin-layout>
    <template v-slot:page-footer>
      <div class="copyright">
        Copyright © 2020 - <a href="https://github.com/toesbieya" target="_blank">toesbieya</a>
      </div>
    </template>
  </el-admin-layout>
</template>

<script>
import ElAdminLayout, { appMutations } from 'el-admin-layout'
import menus from '@example/common/menu'

appMutations.title('自定义页脚')
appMutations.menus(menus)

export default {
  name: 'Layout',

  components: { ElAdminLayout }
}
</script>
