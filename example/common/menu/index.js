export default [
    {
        fullPath: '/',
        meta: {title: '根菜单1', icon: 'el-icon-success'},
        children: [
            {
                fullPath: '/index',
                meta: {title: '首页', icon: 'el-icon-platform-eleme', affix: true}
            },
            {
                fullPath: '/test',
                meta: {title: '测试页', icon: 'el-icon-phone'}
            },
            {
                fullPath: '/reuse/1',
                meta: {title: '复用路由1', icon: 'el-icon-phone'}
            },
            {
                fullPath: '/reuse/2',
                meta: {title: '复用路由2', icon: 'el-icon-phone'}
            },
            {
                fullPath: '/nest',
                meta: {title: '嵌套页', icon: 'el-icon-s-order'},
                children: [
                    {
                        fullPath: '/nest0',
                        meta: {title: '嵌套页0', icon: 'el-icon-s-order'}
                    },
                    {
                        fullPath: '/nest0-1',
                        meta: {title: '嵌套页0-1', icon: 'el-icon-s-order'}
                    }
                ]
            },
            {
                fullPath: '外链父级',
                meta: {title: '外链', icon: 'el-icon-s-flag'},
                children: [
                    {
                        fullPath: 'https://www.taobao.com',
                        meta: {title: '淘宝'}
                    },
                    {
                        fullPath: 'https://www.baidu.com',
                        meta: {title: '百度'}
                    }
                ]
            },
            {
                fullPath: '/dsafwqewq',
                meta: {title: '没有对应路由的菜单', icon: 'el-icon-platform-eleme'}
            }
        ]
    },
    {
        fullPath: '/iframe',
        meta: {title: 'iframe', icon: 'el-icon-s-flag'},
        children: [
            {
                fullPath: '/iframe/taobao',
                meta: {title: '淘宝'}
            },
            {
                fullPath: '/iframe/baidu',
                meta: {title: '百度'}
            }
        ]
    },
    {
        fullPath: '/breadcrumb',
        meta: {title: '面包屑', icon: 'el-icon-s-cooperation'},
        children: [
            {
                fullPath: '/breadcrumb/simple',
                meta: {title: '简单'}
            },
            {
                fullPath: '/breadcrumb/list',
                meta: {title: '列表页'}
            }
        ]
    }
]
