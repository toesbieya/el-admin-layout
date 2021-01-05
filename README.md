# el-admin-layout

这是一个基于`element-ui`的后台管理layout组件，需要配合`vue2`、`vue-router3`使用。

[在线预览](https://toesbieya.github.io/el-admin-layout/dist/example/#/index)


## 功能特性

- flex布局、有限的移动端适配
- 四种导航模式，仿`ant-design-pro`的三种导航、仿旧版七牛云的双层侧边栏导航模式
- 多页签
- 侧边栏和顶部导航栏的深色\亮色主题
- 侧边栏可搜索
- 路由和菜单分离
- 支持各种页面缓存（不支持嵌套路由）
- 支持iframe、外链
- 数据外部可控，满足大部分定制化需求


## 安装

```
npm i el-admin-layout -S
```


## 使用

使用前请确保工程能够转译`template`、`jsx`语法，建议使用`vue-cli4`

在`vue.config.js`中的`transpileDependencies`配置中增加`'el-admin-layout'`，例如：
```js
module.exports = {
    transpileDependencies: ['el-admin-layout']
}
```

首先，引入`element-ui`，并在`element-ui`的样式后面引入`el-admin-layout`的样式

然后，创建一个最简单的Layout组件：
```vue
<template>
    <el-admin-layout/>
</template>

<script>
import ElAdminLayout, {appMutations} from 'el-admin-layout'

//在el-admin-layout初始化前设置一些数据
//设置logo和标题
appMutations.title('测试')
appMutations.logo('./logo.png')

//设置菜单，当然这一步可以在任何地方写，这是响应式的
appMutations.menus([...])

export default {
    name: "Layout",

    components: {ElAdminLayout}
}
<script/>
```

最后，在`vue-router`的路由定义中引入`el-admin-layout`的自带路由：
```js
import Vue from 'vue'
import Router from 'vue-router'
import {injectDefaultRoute} from 'el-admin-layout'
import Layout from "./layout" //这是上一步创建的Layout组件

Vue.use(Router)

const router = new Router({
    routes: [...injectDefaultRoute(Layout)]
})

export default router
```

***请确保自带路由在***`'*'`***路由前被引入***


## Props

### Layout Props

|属性|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|navbarProps|传递给nav-bar的props|[NavBar Props](#navbar-props)||
|asideProps|传递给aside的props|[Aside Props](#aside-props)||
|pageProps|传递给page的props|[Page Props](#page-props)||


### NavBar Props

|属性|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|avatar|头像地址|`string`|-|
|username|用户名称|`string`|-|
|userDropdownItems|自定义下拉菜单项|`array<UserDropdownItem>`|`[]`|
|renderCustomActions|自定义右侧元素|`function(defaultVnodes: array<VNode>)`|-|
|headMenuProps|传递给head-menu的props|[HeadMenu Props](#headmenu-props)||


#### UserDropdownItem

|属性|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|icon|图标|`string`|-|
|command|同el-dropdown-menu-item|`string/number/object`|-|
|content|菜单内容|`string`|-|
|hideOnMobile|是否在移动端时隐藏|`boolean`|-|
|handler|点击时触发的方法|`function`|-|


#### HeadMenu Props

|属性|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|alwaysShow|是否在只有一个顶部菜单时仍然渲染|`boolean`|`true`|
|showIconMaxDepth|能够显示图标的最大深度，不传 或 <0 则不作限制|`number`|1|


### Aside Props

|属性|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|inlineIndent|子菜单的单位缩进距离|`number`|`scss变量：$menu-padding`|
|showIconMaxDepth|能够显示图标的最大深度，不传 或 <0 则不作限制|`number`|1|
|switchTransition|是否使用过渡动画|`boolean`|`true`|
|switchTransitionName|过渡动画名称|`string`|`'sidebar'`|


### Page Props

|属性|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|renderHeader|自定义渲染页头的方法|`function(h: createElement)`|-|
|renderFooter|自定义渲染页脚内容的方法|`function(h: createElement)`|-|


## 配置

为了实现`el-admin-layout`的功能特性，需要进行一些约定式的配置


### 路由meta配置

框架对vue-router的route.meta进行了扩展，增加的配置项如下：

|属性|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|title|在页头、面包屑、页签栏中的名称|`string`|-|
|dynamicTitle|title的动态形式，优先使用|`function(currentRoute)`|-|
|noCache|true时不缓存页面|`boolean`|-|
|activeMenu|当前激活的叶子菜单的fullPath|`string`|-|
|iframe|需要打开的iframe的地址|`string`|-|
|usePathKey|是否使用route.path作为key|`boolean`|-|
|useFullPathKey|是否使用route.fullPath作为key|`boolean`|-|


### 菜单配置

为了实现菜单嵌套但路由不嵌套的效果，路由和菜单是分离的，因此需要将配置好的菜单传递给`el-admin-layout`

**路由配置项和菜单配置项中存在一些同名但效果不同的配置，请注意区分！**

- 菜单配置项:

|属性|说明|类型|
|:---:|:---:|:---:|
|fullPath|菜单的唯一key，叶子节点时对应路由的path全路径，以'http'开头时视为外链|`string`|
|meta|菜单meta|`object`|
|children|子级菜单|`array`|

- 菜单meta配置项:

|属性|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|title|菜单名称|`string`|-|
|alwaysShow|是否总是把只有一个子级的菜单以嵌套模式展示|`boolean`|-|
|sort|菜单排序值，值越小越靠前|`number`|10000|
|icon|菜单图标，传递给`ICON_RENDERER`|`string`|-|
|affix|是否在多页签中固定显示|`boolean`|- |

## 数据控制store

`el-admin-layout`使用`Vue.observable`来创建响应式的数据控制store，每个store都有`getter(获取数据)`和`mutation(修改数据)`两种方法。根据控制的对象不同，store有`app`、`aside`、`navbar`、`page`、`tagsView`五种

```js
import {xxxGetters, xxxMutations} from 'el-admin-layout'

// 通过getters取val
console.log(xxxGetters.val)

// 通过mutations修改val。没有特殊说明的话，mutations都存在和getters中的属性名称相同的修改方法
xxxMutations.val('test')

// 一些mutations可能会有额外的特殊方法
xxxMutations.specialMethod('test')
```

### appStore

这里存放框架的基础数据，使用`import {appGetters, appMutations} from 'el-admin-layout'`引入


#### appGetters

|名称|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|isMobile|判断当前是否为移动端，发生resize事件时该值会更新|`boolean`|初始化时根据常量中的`maxMobileWidth`判断|
|title|标题|`string`|`''`|
|logo|logo地址|`string`|`''`|
|activeRootMenu|当前激活的顶部菜单的fullPath|`string`|`''`|
|menus|所有的树形菜单|`array`|`[]`|
|navMode|导航模式|`'aside'`、`'aside-two-part'`、`'head'`、`'mix'`|`'mix'`|


#### appMutations

具备所有方法

注意，`appMutations.menus`会对传入的值进行排序，并增加parent属性！


### asideStore

这里存放侧边栏的基础数据，使用`import {asideGetters, asideMutations} from 'el-admin-layout'`引入


#### asideGetters

|名称|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|show|抽屉模式时的显隐|`boolean`|`false`|
|theme|主题|`'light'`、`'dark'`|`'light'`|
|uniqueOpen|是否使用手风琴效果|`boolean`|`true`|
|collapse|是否折叠|`boolean`|`false`|
|showParentOnCollapse|是否在折叠时显示上级菜单|`boolean`|`false`|
|autoHide|是否自动隐藏|`boolean`|`false`|
|hamburgerPosition|汉堡包放在导航栏还是侧边栏|`'aside'`、`'head'`|`'aside'`|
|search|是否显示搜索框|`boolean`|`true`|


#### asideMutations

- 额外方法：

|名称|说明|入参|
|:---:|:---:|:---:|
|open|移动端或设置了侧边栏自动隐藏时打开抽屉，否则展开|-|
|close|移动端或设置了侧边栏自动隐藏时关闭抽屉，否则折叠|-|
|switch|切换侧边栏的状态，open和close的聚合方法|`(action: string)`，'open'或'close'，为其他值时会把侧边栏改为相反的状态)|


### navbarStore

这里存放导航栏的基础数据，使用`import {navbarGetters, navbarMutations} from 'el-admin-layout'`引入


#### navbarGetters

|名称|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|theme|主题|`'light'`、`'dark'`|`'light'`|


#### navbarMutations

具备所有方法


### pageStore

这里存放路由页面的基础数据，使用`import {pageGetters, pageMutations} from 'el-admin-layout'`引入


#### pageGetters

|名称|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|transition|路由过渡动画配置|`Transition`||
|showIframe|是否显示iframe|`boolean`|`false`|
|currentIframe|当前iframe的src|`string`|`''`|
|iframeList|所有iframe的src数组|`array`|`[]`|
|showLogo|是否显示logo|`boolean`|`true`|
|position|分层结构|`'top-bottom'`、`'left-right'`|`'left-right'`|
|showHeader|是否显示页头|`boolean`|`true`|
|showFooter|是否显示页脚|`boolean`|`true`|
|showBackToTop|是否显示返回顶部按钮|`boolean`|`true`|

- **Transition Attributes**
  |名称|说明|类型|默认|
  |:---:|:---:|:---:|:---:|
  |default|当未启用多页签时的路由动画|`string`|`'el-fade-in'`|
  |next|要访问的tab顺序高于上一个访问的tab时的路由动画|`string`|`'left-out'`|
  |prev|要访问的tab顺序不高于上一个访问的tab时的路由动画|`string`|`'right-out'`|
  |curr|当前使用的路由动画|`string`|`'el-fade-in'`|
  

#### pageMutations

- 额外方法：

|名称|说明|入参|
|:---:|:---:|:---:|
|addIframe|向iframe数组中添加新的src，会去重|`(src: string)`|
|delIframe|删除iframe数组指定的src|`(src: string)`|
|openIframe|显示指定的iframe|`({src: string})`|
|closeIframe|关闭指定的iframe|`({src: string, del: boolean 是否在关闭后删除该iframe})`|

注意，`pageMutations.transition`会使用`Object.assign`将传入的值与原始值进行合并！


### tagsViewStore

这里存放多页签的基础数据，使用`import {tagsViewGetters, tagsViewMutations} from 'el-admin-layout'`引入


#### tagsViewGetters

|名称|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|enabled|是否启用|`boolean`|`true`|
|enableCache|是否启用缓存功能|`boolean`|`true`|
|visitedViews|页签栏中的页签数组|`array`|`[]`|
|cachedViews|缓存的路由页面key的数组|`array<string>`|`[]`|


#### tagsViewMutations

- 有变动的原始方法：

|名称|说明|入参|
|:---:|:---:|:---:|
|enabled|停用时会移除所有缓存，并且重置路由过渡动画|`(v: boolean)`|
|enableCache|停用时会移除所有缓存|`(v: boolean)`|

- 额外方法：

|名称|说明|入参|
|:---:|:---:|:---:|
|addTagOnly|在页签栏上添加一个页签，path已存在的不会重复添加|`(v: 路由对象)`|
|addCacheOnly|加入缓存，当设置了不缓存、未设置唯一标识、已被缓存时调用无效|`(v: 路由对象)`|
|addTagAndCache|同时调用`addTagOnly`、`addCacheOnly`|`(v: 路由对象)`|
|delTagOnly|根据path从页签栏中移除一个页签|`(v: 路由对象)`|
|delCacheOnly|删除对应的缓存|`(v: 路由对象)`|
|delTagAndCache|同时调用`delTagOnly`、`delCacheOnly`|`(v: 路由对象)`|
|delOtherTagAndCache|移除其他的非固定页签以及其他的缓存|`(v: 路由对象)`|
|delAllCache|移除所有缓存||
|delAllTagAndCache|移除所有非固定页签和所有缓存||


## 可修改的常量

使用方式：
```js
import {Const} from 'el-admin-layout'

console.log(Const.xxx)
Const.xxx = 'test'
```

|常量|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|maxMobileWidth|移动端的最大宽度|`number`|500|
|iconRenderer|渲染图标的方法|`function(h: vue的createElement, icon)`||
|redirectPath|redirect的路由路径，以'/'开头|`string`|`'/redirect'`|
|routerKeyGenerator|获取每个路由对应的唯一key的方法|`function(route)`||
|routerTitleGenerator|获取路由标题的方法|`function(route, currentRoute)`||

- iconRenderer默认值：
```js
(h, icon) => h('i', {class: `icon ${icon}`})
```

- routerKeyGenerator默认值：
```js
route => {
    const {name, path, fullPath, meta: {usePathKey, useFullPathKey} = {}} = route
    return usePathKey ? path : useFullPathKey ? fullPath : name
}
```

- routerTitleGenerator默认值：
```js
(route, currentRoute = route) => {
    const {title, dynamicTitle} = route.meta || {}

    return typeof dynamicTitle === 'function'
        ? dynamicTitle(currentRoute) || title
        : title
}
```


## 辅助API

`el-admin-layout`提供了`refreshPage`、`closeCurrentPage`两个方法，使用`import {refreshPage, closeCurrentPage} from 'el-admin-layout'`引入


### refreshPage(router, route[, replace]): Promise | undefined

刷新指定的路由页面，返回vue-router跳转的结果

- `router`： vue-router实例
- `route` ：需要刷新的路由对象，默认为当前路由
- `replace {boolean}`：是否使用replace进行跳转


### closeCurrentPage(router[, next]): Promise | undefined

关闭当前页，如果next非空则跳转到next页面，并返回vue-router.replace的结果

- `router`： vue-router实例
- `next {string}`：跳转的目标页面，作为第一个参数传入vue-router.replace


## 样式

`el-admin-layout`使用`scss`，并且对`element-ui`的`el-menu`做了直接的样式覆盖


### SCSS变量

具体请查看`src/style/var.scss`，都有注释，此处不作说明

注意！如果修改了`$max-mobile-width`，请同时修改[常量](#可修改的常量)中的`maxMobileWidth`；如果修改了`$menu-padding`，请同时修改[Aside Props](#aside-props)中的`inlineIndent`


### 辅助样式

框架提供了`hide-on-mobile`、`max-view-height`两个类名

- `hide-on-mobile`：屏幕宽度<=`$max-mobile-width`时隐藏
- `max-view-height`：路由页面的最大高度，需要自行引入(`import from 'el-admin-layout/src/style/maxViewHeight.scss'`)，配合`.full`可以实现路由页面占满剩余空间



## 不同导航模式在桌面、移动端的表现差异

**1.桌面端**

- 侧边栏导航：侧边栏菜单为完整菜单，顶部菜单不渲染

- 顶部导航：侧边栏菜单不渲染，顶部菜单为完整菜单

- 混合导航：顶部菜单为完整菜单的所有根节点，侧边栏菜单为当前激活的顶部菜单的子级

- 双层侧边栏导航：侧边栏分为最左侧的根节点栏、二级子菜单，顶部菜单不渲染

**2.移动端**

- 侧边栏导航：侧边栏菜单为完整菜单，顶部菜单不渲染，侧边栏为抽屉模式

- 顶部导航：设置无效，效果等同于侧边栏导航

- 混合导航：设置无效，效果等同于侧边栏导航

- 双层侧边栏导航：设置无效，效果等同于侧边栏导航

### 侧边栏在桌面、移动端的表现差异

**1.桌面端**

未设置自动隐藏时，折叠状态依据用户设置
设置了自动隐藏时，折叠状态无效，侧边栏为抽屉模式

当导航模式为*双层侧边栏导航*时，以下设置无效：
- 折叠
- 折叠时显示父级
- 自动隐藏

**2.移动端**

侧边栏只能为抽屉模式
