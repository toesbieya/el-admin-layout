<template>
  <div style="height: 100%">
    <el-admin-layout/>
    <el-button
      type="primary"
      style="position: fixed;top: 50%;left: 50%"
      @click="loadMenu"
    >
      重新加载菜单
    </el-button>
  </div>
</template>

<script>
import ElAdminLayout, { appGetters, appMutations, asideMutations } from 'el-admin-layout'
import menus from '@example/common/menu'

appMutations.title('从服务器加载菜单')
appMutations.loadingMenu(true)

// 如果不设置，侧边栏在没有菜单时不会渲染
asideMutations.alwaysRender(true)

export default {
  name: 'Layout',

  components: { ElAdminLayout },

  methods: {
    loadMenu() {
      if (appGetters.loadingMenu) return

      appMutations.loadingMenu(true)

      window.setTimeout(() => appMutations.loadingMenu(false), 2000)
    }
  },

  mounted() {
    window.setTimeout(() => {
      appMutations.menus(menus)
      appMutations.loadingMenu(false)
    }, 2000)
  }
}
</script>
