import Router from 'vue-router'
import {injectDefaultRoute} from "el-admin-layout"
import IndexPage from '@example/common/view/indexPage'
import TestPage from '@example/common/view/testPage'
import ReusablePage from '@example/common/view/reusablePage'
import Nest0 from '@example/common/view/nest0'
import Nest0_1 from '@example/common/view/nest0-1'
import SimpleBreadcrumbPage from '@example/common/view/breadcrumb/simple'
import ListBreadcrumbPage from '@example/common/view/breadcrumb/list'
import DetailBreadcrumbPage from '@example/common/view/breadcrumb/detail'

export function createRouter(layoutComponent) {
    return new Router({
        base: process.env.BASE_URL,
        mode: 'hash',
        routes: [
            {
                path: '/',
                redirect: 'index',
                component: layoutComponent,
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
                        component: ReusablePage,
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
                component: layoutComponent,
                children: [
                    {
                        path: 'taobao',
                        name: 'taobao',
                        meta: {title: '淘宝', dynamicTitle: route => `淘宝${Date.now()}`, iframe: 'https://www.taobao.com'}
                    },
                    {
                        path: 'baidu',
                        name: 'baidu',
                        meta: {title: '百度', iframe: 'https://www.baidu.com'}
                    }
                ]
            },
            {
                path: '/breadcrumb',
                component: layoutComponent,
                children: [
                    {
                        path: 'simple',
                        component: SimpleBreadcrumbPage,
                        meta: {title: '简单'}
                    },
                    {
                        path: 'list',
                        component: ListBreadcrumbPage,
                        meta: {title: '列表页'}
                    },
                    {
                        path: 'detail/:id',
                        props: true,
                        component: DetailBreadcrumbPage,
                        meta: {dynamicTitle: route => `详情页${route.params.id}`, activeMenu: '/breadcrumb/list'}
                    }
                ]
            },

            ...injectDefaultRoute(layoutComponent)
        ]
    })
}
