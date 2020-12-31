const path = require('path')

const isProd = process.env.NODE_ENV === 'production'

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: isProd ? '/el-admin-layout/dist/example/' : '/',
    outputDir: 'dist/example',
    assetsDir: 'static',
    filenameHashing: false,
    pages: {
        index: {
            // page 的入口
            entry: 'example/main.js',
            cdn: {
                css: [
                    'https://cdn.jsdelivr.net/npm/element-ui@2.14.1/lib/theme-chalk/index.css'
                ],
                js: isProd
                    ? [
                        'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js',
                        'https://cdn.jsdelivr.net/npm/vue-router@3.4.9/dist/vue-router.min.js',
                        'https://cdn.jsdelivr.net/npm/element-ui@2.14.1/lib/index.js'
                    ]
                    : []
            }
        }
    },
    productionSourceMap: false,
    devServer: {port: 8079, open: true},
    configureWebpack: {
        name: 'el-admin-layout',
        resolve: {
            alias: {
                '@example': resolve('example'),
                'el-admin-layout': resolve('')
            }
        },
        externals: isProd
            ? {
                'vue': 'Vue',
                'element-ui': 'ELEMENT',
                'vue-router': 'VueRouter',
            }
            : {}
    },
}
