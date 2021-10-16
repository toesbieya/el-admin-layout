# 介绍

el-admin-layout是一个基于vue2、vue-router3、element-ui的后台管理layout组件，类似Ant Design Pro的ProLayout

### 目录结构

```
├── build
│   ├── css.js                 # 将.scss编译为.css
│   ├── esm                    # 将库打包为es module
│   └── umd.js                 # 构建umd包的入口
├── example                    # 演示用例
├── public                     # 供演示用例使用的静态资源
├── src
│   ├── components
│   │   │── Aside              # 侧边栏
│   │   │── Breadcrumb         # 面包屑
│   │   │── ContextMenu        # 右键菜单，用于页签栏
│   │   │── ElMenu             # 改写el-menu-item和el-submenu
│   │   │── Hamburger          # 汉堡包，用于控制侧边栏的折叠
│   │   │── Header             # 顶栏
│   │   │── HorizontalScroller # 水平滚动容器，用于页签栏
│   │   │── KeepViewAlive      # 改写keep-alive
│   │   │── Layout             # 布局，整合了顶栏、页签栏、侧边栏、页面
│   │   │── LoadingSpinner     # loading图标，用于菜单的加载状态
│   │   │── Logo               # logo
│   │   │── NavMenu            # 基于el-menu封装的导航菜单
│   │   │── Page               # 页面
│   │   │── Redirect           # 用于刷新的路由页面
│   │   └── TagsView           # 页签栏
│   ├── config                 # 一些后续可能会发生变动的公用变量、函数
│   ├── mixin                  # 公用混入
│   ├── store                  # 数据控制
│   ├── style                  # 样式
│   ├── helper.js              # 为避免循环依赖拆分出来的工具类
│   ├── index.js
│   └── util.js                # 工具类
└── vue.config.js
```

### 组件结构

el-admin-layout由aside侧边栏、header顶栏、tagsView页签栏、page路由页面组成：

<img :src="$withBase('/结构-总体.png')">

page页面从上往下由页签栏、页头、页面内容、页脚组成：

<img :src="$withBase('/结构-页面.png')">

### 兼容性

el-admin-layout使用了grid样式以及一些现代浏览器才支持的特性，并且在写代码的时候就没考虑兼容性，怎么爽怎么来

所以如果有兼容性需求的话，可以不用考虑了
