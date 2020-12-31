import Vue from 'vue'
import Router from 'vue-router'
import {injectDefaultRoute} from "el-admin-layout"
import Layout from '@example/layout'
import IndexPage from '@example/view/indexPage'
import TestPage from '@example/view/testPage'
import Nest0 from '@example/view/nest0'
import Nest0_1 from '@example/view/nest0-1'

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
