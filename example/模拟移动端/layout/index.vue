<template>
  <el-admin-layout/>
</template>

<script>
import ElAdminLayout, { Const, appMutations } from 'el-admin-layout'
import menus from '@example/common/menu'

appMutations.title('模拟移动端')
appMutations.menus(menus)

// 先将isMobile设为true
appMutations.isMobile(true)
// 然后设置maxMobileWidth，这两步最好在ElAdminLayout渲染前完成
Const.maxMobileWidth = 10000

export default {
  name: 'Layout',

  components: { ElAdminLayout },

  mounted() {
    // 如果在ElAdminLayout渲染后，那么上述两步需要调换执行顺序
    /*Const.maxMobileWidth = 10000
    appMutations.isMobile(true)*/
  }
}
</script>
