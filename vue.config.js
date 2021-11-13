const path = require('path')
const packageInfo = require('./package.json')
const isProd = process.env.NODE_ENV === 'production'
const isBuildLib = (process.env.npm_lifecycle_script || '').includes('--target lib')

function resolve(dir) {
  return path.join(__dirname, dir)
}

function createExamplePage(folder) {
  return {
    entry: `example/${folder}/main.js`,
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
}

module.exports = {
  publicPath: isProd ? '/el-admin-layout/' : '/',
  outputDir: isBuildLib ? 'dist' : 'dist/example',
  assetsDir: 'static',
  pages: {
    'index': createExamplePage('复杂功能'),
    'base-use': createExamplePage('基础使用'),
    'async-load-menu': createExamplePage('从服务器加载菜单'),
    'custom-menu': createExamplePage('自定义menu'),
    'custom-hamburger-position': createExamplePage('自定义汉堡包位置'),
    'custom-page-header': createExamplePage('自定义页头'),
    'custom-page-footer': createExamplePage('自定义页脚'),
    'aside-search': createExamplePage('侧边栏搜索框'),
    'simulate-mobile': createExamplePage('模拟移动端'),
    'setting-drawer': createExamplePage('设置抽屉'),
    'persist-tags': createExamplePage('持久化页签'),
    'old-qiniu-aside': createExamplePage('仿旧版七牛云侧边栏'),
    'chrome-tabs': createExamplePage('仿chrome页签')
  },
  productionSourceMap: false,
  devServer: {
    port: 8079,
    historyApiFallback: false
  },
  configureWebpack: {
    name: packageInfo.name,
    resolve: {
      alias: {
        '@example': resolve('example'),
        'el-admin-layout': resolve('')
      }
    },
    externals: isProd
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
      config.output.library('ElAdminLayout')
    }
    /*else {
        config.plugin('html-index').tap((args) => {
            args[0].scriptLoading = 'blocking'
            args[0].publicPath = 'auto'
            return args
        })
    }*/
  }
}
