module.exports = {
    base: '/el-admin-layout/',

    title: 'el-admin-layout',

    description: '基于element-ui的后台管理layout组件',

    host: 'localhost',

    // 输出目录
    dest: 'doc',

    // 主题配置
    themeConfig: {
        lastUpdated: '上次更新：',

        displayAllHeaders: true,

        nav: [
            {text: '指南', link: '/guide/'},
            {text: 'api', link: '/api/'},
            {text: 'demo', link: '/demo/'},
            {text: '在线预览', link: 'https://toesbieya.cn/el-admin-layout'},
            {text: 'GitHub', link: 'https://github.com/toesbieya/el-admin-layout'}
        ],

        sidebar: {
            '/guide/': [
                '',
                '安装',
                '使用',
                '导航模式',
                '路由和菜单',
                '样式'
            ],
            '/api/': [
                '',
                '插槽',
                '数据控制',
                '内部常量',
                '辅助方法',
            ],
            '/demo/': [
                ''
            ]
        }
    },

    evergreen: true
}
