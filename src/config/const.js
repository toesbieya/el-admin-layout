/**
 * 一些可修改的常量
 * @type {import('../../types/config').Const}
 */
const Const = {
  /**
   * 移动端的最大宽度
   * 默认为scss中的$max-mobile-width变量
   * 该值的变动并不能影响样式，需要同时修改$max-mobile-width或覆盖相关样式
   */
  maxMobileWidth: 500,

  /**
   * redirect的路径名
   * 如果需要修改，则需要在injectDefaultRoute执行前修改
   */
  redirectPath: '/redirect',

  /**
   * 是否开启Layout组件的插槽功能
   * 关闭后只能通过store使用render方式来自定义渲染内容，不过可以提高一丢丢性能
   */
  enableLayoutSlot: true,

  /**
   * 是否开启对缓存下的路由页面热更新的支持
   * 建议仅在开发时开启
   */
  enableCachedPageHMR: true
}

export default Const
