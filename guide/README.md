# 介绍

el-admin-layout是一个基于vue2、vue-router3、element-ui的后台管理layout组件，类似Ant Design Pro的ProLayout

### 目录结构

```
├── build
│   ├── css.js                          # 将.scss编译为.css
│   ├── esm                             # 将库打包为es module
│   └── umd.js                          # 构建umd包的入口
├── example                             # 演示用例
├── public                              # 供演示用例使用的静态资源
├── src
│   ├── components
│   │   │── Aside                       # 侧边栏
│   │   │── Breadcrumb                  # 面包屑
│   │   │── CachedRouterView            # 基于keep-alive封装的拥有缓存功能的router-view
│   │   │── ContextMenu                 # 右键菜单，用于页签栏
│   │   │── ElMenu                      # 改写el-menu-item和el-submenu
│   │   │── Hamburger                   # 汉堡包，用于控制侧边栏的折叠
│   │   │── Header                      # 顶栏
│   │   │── HorizontalResizeableMenu    # 可自适应的水平导航菜单
│   │   │── HorizontalScroller          # 水平滚动容器，用于页签栏
│   │   │── Layout                      # 布局，整合了顶栏、页签栏、侧边栏、页面
│   │   │── LoadingSpinner              # loading图标，用于菜单的加载状态
│   │   │── Logo                        # logo
│   │   │── NavMenu                     # 基于el-menu封装的导航菜单
│   │   │── Page                        # 页面
│   │   │── Redirect                    # 用于刷新的路由页面
│   │   └── TagsView                    # 页签栏
│   ├── config                          # 一些后续可能会发生变动的公用变量、函数
│   ├── mixin                           # 公用混入
│   ├── store                           # 数据控制
│   ├── style                           # 样式
│   ├── helper.js                       # 为避免循环依赖拆分出来的工具类
│   ├── index.js                        
│   └── util.js                         # 工具类
└── vue.config.js
```

### 组件结构

el-admin-layout由aside侧边栏、header顶栏、tagsView页签栏、page路由页面组成：

<img :src="$withBase('/结构-总体.png')">

page页面从上往下由页签栏、页头、页面内容、页脚组成：

<img :src="$withBase('/结构-页面.png')">

### 兼容性

el-admin-layout使用了grid布局以及ResizeObserver，这是某些浏览器支持不了的。

不过如果想兼容的话，可以按下面的方式手动进行兼容：

1. 使用IE11支持的`-ms-grid`样式覆盖原有样式：
```scss
.el-admin-layout {
  display: -ms-grid;
  -ms-grid-columns: min-content 1fr;
  -ms-grid-rows: min-content min-content 1fr;

  > header {
    position: relative;
    -ms-grid-row: 1;
    -ms-grid-column: 1;
    -ms-grid-column-span: 2;
  }

  > nav {
    -ms-grid-row: 2;
    -ms-grid-column: 2;
  }

  > aside {
    position: relative;
    -ms-grid-row: 2;
    -ms-grid-row-span: 2;
    -ms-grid-column: 1;
  }

  > main {
    display: block;
    -ms-grid-row: 3;
    -ms-grid-column: 2;
  }

  //左右结构
  &.left-right {
    > header {
      -ms-grid-column: 2;
    }

    > aside {
      -ms-grid-row: 1;
      -ms-grid-row-span: 3;
    }
  }
}
```

2. 安装`resize-observer-polyfill`，并在`main.js`里引入：
```sh
npm i resize-observer-polyfill -S
```

```js
import ResizeObserverPolyfill from 'resize-observer-polyfill'

window.ResizeObserver = ResizeObserverPolyfill
```

3. 将el-admin-layout编译成es5：
在`vue.config.js`的`transpileDependencies`配置项中增加`'el-admin-layout'`
```js
module.exports = {
  transpileDependencies: ['el-admin-layout']
}
```

::: warning
但是！其中可能会有其他像`flex: 1`这种样式问题，这就需要自行排查覆盖了😇😇😇
:::
