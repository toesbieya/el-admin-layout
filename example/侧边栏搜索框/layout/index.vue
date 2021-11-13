<template>
  <el-admin-layout ref="layout">
    <template v-slot:aside-header="defaultContent">
      <aside-header :default="defaultContent"/>
    </template>

    <template v-slot:aside-menu-content="{menu}">
      <aside-menu-content :title="menu.meta.title" :search-word="searchWord"/>
    </template>
  </el-admin-layout>
</template>

<script>
import ElAdminLayout, { appMutations, asideMutations } from 'el-admin-layout'
import menus from '@example/common/menu'
import AsideHeader from './AsideHeader'
import AsideMenuContent from './AsideMenuContent'
import { filterMenuBySearchWord, expandAfterSearch } from './util'

appMutations.title('侧边栏搜索框')
appMutations.menus(menus)
appMutations.navMode('aside')

export default {
  name: 'Layout',

  components: { ElAdminLayout, AsideHeader, AsideMenuContent },

  data: () => ({ searchWord: '' }),

  methods: {
    searchWordMutation(v) {
      this.searchWord = v
    },
    postMenus(menus) {
      const searchWord = this.searchWord
      const filtered = filterMenuBySearchWord(menus, searchWord)

      // 在新的菜单渲染完毕后展开sub-menu
      this.$nextTick(() => {
        const sidebar = this.$refs['layout'].$refs['aside'].$refs['default-sidebar']
        const elMenu = sidebar.$_getElMenuInstance()
        elMenu && expandAfterSearch(elMenu, searchWord, filtered)
      })

      return filtered
    }
  },

  created() {
    // 避免搜索结果为空时侧边栏不渲染
    asideMutations.alwaysRender(true)
    asideMutations.postMenus(this.postMenus)
  }
}
</script>
