/**
 * 一些可修改的常量
 */

export default {
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
    enableLayoutSlot: false
}
