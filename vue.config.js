const path = require('path')
const packageInfo = require('./package.json')
const isProd = process.env.NODE_ENV === 'production'
const isBuildLib = (process.env.npm_lifecycle_script || '').includes('--target lib')
const { defineConfig } = require('@vue/cli-service')
const sass = require('sass')

function resolve(dir) {
  return path.join(__dirname, dir)
}

function getDevPackageVersion(packageName) {
  const version = packageInfo.devDependencies[packageName]
  return version[0] === '^' ? version.slice(1) : version
}

function createExamplePage(folder) {
  const Vue = getDevPackageVersion('vue')
  const VueRouter = getDevPackageVersion('vue-router')
  const Vuex = getDevPackageVersion('vuex')
  const ElementUI = getDevPackageVersion('element-ui')

  return {
    entry: `example/${folder}/main.js`,
    cdn: {
      css: [
        `https://cdnjs.cloudflare.com/ajax/libs/element-ui/${ElementUI}/theme-chalk/index.min.css`
      ],
      js: isProd
        ? [
          `https://cdnjs.cloudflare.com/ajax/libs/vue/${Vue}/vue.min.js`,
          `https://cdnjs.cloudflare.com/ajax/libs/vuex/${Vuex}/vuex.min.js`,
          `https://cdnjs.cloudflare.com/ajax/libs/vue-router/${VueRouter}/vue-router.min.js`,
          `https://cdnjs.cloudflare.com/ajax/libs/element-ui/${ElementUI}/index.min.js`
        ]
        : []
    }
  }
}

module.exports = defineConfig({
  publicPath: isProd ? '/el-admin-layout/' : '/',
  outputDir: isBuildLib ? 'dist' : 'dist/example',
  assetsDir: 'static',
  productionSourceMap: false,
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
  css: {
    loaderOptions: {
      sass: {
        logger: sass.Logger.silent
      }
    }
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
      : {},
    devServer: {
      port: 8079,
      historyApiFallback: false
    }
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
})
