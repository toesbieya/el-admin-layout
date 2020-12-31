const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/el-admin-layout/dist/example/' : '/',
    outputDir: 'dist/example',
    assetsDir: 'static',
    filenameHashing: false,
    pages: {
        index: {
            // page 的入口
            entry: 'example/main.js'
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
        externals: {
            vue: 'Vue',
            "element-ui": 'ELEMENT',
            'vue-router': 'VueRouter',
        }
    },
}
