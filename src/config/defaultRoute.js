import Const from './const'

/**
 * 用于刷新路由的工具组件
 */
const Redirect = {
  mounted() {
    const { fullPath } = this.$route
    const to = fullPath.replace(new RegExp(Const.redirectPath, 'gm'), '')

    // 如果路由没有component选项时（比如iframe路由），必须使用$nextTick模拟路由组件加载
    this.$nextTick(() => this.$router.replace(to))
  },

  render: () => undefined
}

/**
 * 注入默认的路由
 *
 * @param layout 你的layout组件
 * @returns {array}
 */
export function injectDefaultRoute(layout) {
  return [
    {
      path: Const.redirectPath,
      component: layout,
      children: [
        {
          path: '*',
          component: Redirect
        }
      ]
    }
  ]
}
