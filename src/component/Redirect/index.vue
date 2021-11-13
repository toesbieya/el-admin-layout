<script>
/**
 * 用于刷新路由的工具组件
 */

import { Const } from '../../config'

export default {
  mounted() {
    const { fullPath } = this.$route
    const to = fullPath.replace(new RegExp(Const.redirectPath, 'gm'), '')

    // 如果路由没有component选项时（比如iframe路由），必须使用$nextTick模拟路由组件加载
    this.$nextTick(() => this.$router.replace(to))
  },

  render: () => undefined
}
</script>
