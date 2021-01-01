import Vue from 'vue'
import Router from 'vue-router'
import {injectDefaultRoute} from "el-admin-layout"
import Layout from '@example/layout'
import IndexPage from '@example/view/indexPage'
import TestPage from '@example/view/testPage'
import Nest0 from '@example/view/nest0'
import Nest0_1 from '@example/view/nest0-1'

//路由页面懒加载，入参可以是字符串、返回值为Promise的函数
function lazyLoadView(component) {

    //这里注意一点，如果设置了超时时间，那么超时后只能刷新整个页面才能重新加载该组件
    const AsyncHandler = () => ({
        component: component(),
        loading: h => h('div', null, 'loading'),
        delay: 200,
        timeout: 10000
    })

    return () => Promise.resolve({
        abstract: true,
        functional: true,
        render(h, {data, children}) {
            return h(AsyncHandler, data, children)
        }
    })
}

Vue.use(Router)

const router = new Router({
    base: process.env.BASE_URL,
    mode: 'hash',
    scrollBehavior: () => ({y: 0}),
    routes: [
        {
            path: '/',
            redirect: 'index',
            component: Layout,
            children: [
                {
                    path: 'index',
                    name: 'indexPage',
                    component: IndexPage,
                    meta: {title: '首页'}
                },
                {
                    path: 'test',
                    name: 'testPage',
                    component: TestPage,
                    meta: {title: '测试页'}
                },
                {
                    path: 'reuse/:id',
                    props: true,
                    component: lazyLoadView(() => import('@example/view/reusablePage')),
                    meta: {dynamicTitle: route => `复用路由${route.params.id}`, usePathKey: true}
                },
                {
                    path: 'nest0',
                    component: Nest0,
                    meta: {title: '嵌套页0'}
                },
                {
                    path: 'nest0-1',
                    component: Nest0_1,
                    meta: {title: '嵌套页0-1'}
                }
            ]
        },
        {
            path: '/iframe',
            component: Layout,
            children: [
                {
                    path: 'taobao',
                    meta: {title: '淘宝', dynamicTitle: route => `淘宝${Date.now()}`, iframe: 'https://www.taobao.com'}
                },
                {
                    path: 'baidu',
                    meta: {title: '百度', iframe: 'https://www.baidu.com'}
                }
            ]
        },

        ...injectDefaultRoute(Layout)
    ]
})

export default router
