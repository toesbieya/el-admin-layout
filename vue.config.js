const path = require('path')
const isProd = process.env.NODE_ENV === 'production'
const isBuildLib = (process.env.npm_lifecycle_script || '').includes('--target lib')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: isProd ? '/el-admin-layout/' : '/',
    outputDir: `dist/${isBuildLib ? 'lib' : 'example'}`,
    assetsDir: 'static',
    pages: {
        index: {
            // page 的入口
            entry: 'example/main.js',
            cdn: {
                css: [
                    'https://cdn.jsdelivr.net/npm/element-ui@2.15.0/lib/theme-chalk/index.css'
                ],
                js: isProd
                    ? [
                        'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js',
                        'https://cdn.jsdelivr.net/npm/vuex@3.6.2/dist/vuex.min.js',
                        'https://cdn.jsdelivr.net/npm/vue-router@3.4.9/dist/vue-router.min.js',
                        'https://cdn.jsdelivr.net/npm/element-ui@2.15.0/lib/index.js'
                    ]
                    : []
            }
        }
    },
    productionSourceMap: false,
    devServer: {port: 8079, open: true},
    configureWebpack: {
        resolve: {
            alias: {
                '@example': resolve('example'),
                'el-admin-layout': resolve('')
            }
        },
        externals: isProd && !isBuildLib
            ? {
                'vue': 'Vue',
                'vuex': 'Vuex',
                'vue-router': 'VueRouter',
                'element-ui': 'ELEMENT'
            }
            : {}
    },
    chainWebpack: config => {
        if (isBuildLib) {
            config.plugins.delete('html')
            config.output.library('ElAdminLayout')
        }
        else {
            config.plugin('html-index').tap((args) => {
                args[0].scriptLoading = 'blocking'
                args[0].publicPath = 'auto'
                return args
            })
        }
    }
}
