---
pageClass: demo
---

# 演示用例

全部代码都放上来的话太多了，所以只放了layout的部分，完整源码可以前去[GitHub仓库](https://github.com/toesbieya/el-admin-layout) 的example目录下查看

::: details demo的菜单
<<< @/../el-admin-layout/example/common/menu/index.js
:::

::: details demo的样式（个别会有自己的特殊样式）
```css
html, body, #app {
    height: 100%;
    margin: 0;
}
```
:::


## 基础使用

最基本的例子，只需要传入菜单即可

<CodePreviewer src="base-use.html">
<<< @/../el-admin-layout/example/基础使用/layout/index.vue
</CodePreviewer>


## 从服务器加载菜单

store的数据变化会触发视图更新，利用这一点来实现异步编程。通过`appStore.loadingMenu`可以控制菜单的加载情况

<CodePreviewer src="async-load-menu.html">
<<< @/../el-admin-layout/example/从服务器加载菜单/layout/index.vue
</CodePreviewer>


## 自定义menu

导航菜单分为侧边栏菜单和顶栏菜单，前者仅在移动端或非head导航模式下渲染，后者仅在非移动端和非aside导航模式下渲染。
两者都有`menu-icon`（自定义菜单图标）和`menu-content`（自定义菜单内容）插槽

这两个插槽都会传入`{menu: 菜单对象, depth: 菜单当前的层级深度}`

<CodePreviewer src="custom-menu.html">
<Tab>
<TabPanel label="index.vue">
<Content slot-key="custom-menu:index.vue"/>
</TabPanel>
<TabPanel label="index.scss">
<Content slot-key="custom-menu:index.scss"/>
</TabPanel>
</Tab>
</CodePreviewer>

::: slot custom-menu:index.vue
<<< @/../el-admin-layout/example/自定义menu/layout/index.vue
:::
::: slot custom-menu:index.scss
<<< @/../el-admin-layout/example/自定义menu/style/index.scss
:::

::: tip 注意
自定义侧边栏菜单的icon时，如果设置了`asideStore.showParentOnCollapse`， 那么侧边栏折叠时，弹出菜单父级的深度会比未折叠时+1
:::


## 自定义汉堡包位置

汉堡包就是控制侧边栏折叠的按钮，默认是位于侧边栏的底部（移动端时会位于顶栏左侧）

<CodePreviewer src="custom-hamburger-position.html">
<Tab>
<TabPanel label="index.vue">
<Content slot-key="custom-hamburger-position:index.vue"/>
</TabPanel>
<TabPanel label="HeaderLeft.vue">
<Content slot-key="custom-hamburger-position:HeaderLeft.vue"/>
</TabPanel>
</Tab>
</CodePreviewer>

::: slot custom-hamburger-position:index.vue
<<< @/../el-admin-layout/example/自定义汉堡包位置/layout/index.vue
:::
::: slot custom-hamburger-position:HeaderLeft.vue
<<< @/../el-admin-layout/example/自定义汉堡包位置/layout/HeaderLeft.vue
:::


## 自定义页头

默认的页头会带有一个面包屑，如果不想要可以通过page页面的`header`插槽来自行定制

<CodePreviewer src="custom-page-header.html">
<<< @/../el-admin-layout/example/自定义页头/layout/index.vue
</CodePreviewer>


## 自定义页脚

el-admin-layout并不提供默认的页脚组件，有需要的可以用page页面的`footer`插槽来自行定制

<CodePreviewer src="custom-page-footer.html">
<<< @/../el-admin-layout/example/自定义页脚/layout/index.vue
</CodePreviewer>

::: tip 注意
如果需要修改页脚的高度，建议通过修改[scss变量](../api/样式.md)中的`$page-footer-height`
:::


## 侧边栏搜索框

通过侧边栏的`header`插槽将搜索框放到侧边栏顶部，使用`asideStore.postMenus`确定最终需要渲染的菜单，最后通过侧边栏的`menu-content`插槽实现高亮搜索词

其中有用到jsx语法和函数式组件，以及一些涉及el-admin-layout源码的代码，不过核心还是上面的三点

<CodePreviewer src="aside-search.html">
<Tab>
<TabPanel label="index.vue">
<Content slot-key="aside-search:index.vue"/>
</TabPanel>
<TabPanel label="AsideHeader.vue">
<Content slot-key="aside-search:AsideHeader.vue"/>
</TabPanel>
<TabPanel label="AsideMenuContent.vue">
<Content slot-key="aside-search:AsideMenuContent.vue"/>
</TabPanel>
<TabPanel label="MenuSearch.vue">
<Content slot-key="aside-search:MenuSearch.vue"/>
</TabPanel>
<TabPanel label="util.js">
<Content slot-key="aside-search:util.js"/>
</TabPanel>
<TabPanel label="index.scss">
<Content slot-key="aside-search:index.scss"/>
</TabPanel>
</Tab>
</CodePreviewer>

::: slot aside-search:index.vue
<<< @/../el-admin-layout/example/侧边栏搜索框/layout/index.vue
:::
::: slot aside-search:AsideHeader.vue
<<< @/../el-admin-layout/example/侧边栏搜索框/layout/AsideHeader.vue
:::
::: slot aside-search:AsideMenuContent.vue
<<< @/../el-admin-layout/example/侧边栏搜索框/layout/AsideMenuContent.vue
:::
::: slot aside-search:MenuSearch.vue
<<< @/../el-admin-layout/example/侧边栏搜索框/layout/MenuSearch.vue
:::
::: slot aside-search:util.js
<<< @/../el-admin-layout/example/侧边栏搜索框/layout/util.js
:::
::: slot aside-search:index.scss
<<< @/../el-admin-layout/example/侧边栏搜索框/style/index.scss
:::


## 模拟移动端

可能有时候需要让el-admin-layout在桌面端以移动端的形式渲染，可以通过`Const.maxMobileWidth`和`appStore.isMobile`实现

<CodePreviewer src="simulate-mobile.html">
<<< @/../el-admin-layout/example/模拟移动端/layout/index.vue
</CodePreviewer>

::: tip 注意
这种方式会让一些css失效，比如[辅助类hide-on-mobile](../guide/样式.md)
:::


## 设置抽屉

el-admin-layout并不像ant-design-pro那样会有一个设置抽屉（这东东自己写更快），所以需要自己搞定

本示例只是列出了比较常用的设置项，所有的设置项请查看[数据控制](../api/数据控制.md)

<CodePreviewer src="setting-drawer.html">
<Tab>
<TabPanel label="index.vue">
<Content slot-key="setting-drawer:index.vue"/>
</TabPanel>
<TabPanel label="SettingDrawer.vue">
<Content slot-key="setting-drawer:SettingDrawer.vue"/>
</TabPanel>
<TabPanel label="index.scss">
<Content slot-key="setting-drawer:index.scss"/>
</TabPanel>
</Tab>
</CodePreviewer>

::: tip 小优化
像设置抽屉这种和其他组件基本没有关联的组件，建议自己控制数据，这样不会说每打开一次抽屉，父组件就render一次
:::

::: slot setting-drawer:index.vue
<<< @/../el-admin-layout/example/设置抽屉/layout/index.vue
:::
::: slot setting-drawer:SettingDrawer.vue
<<< @/../el-admin-layout/example/设置抽屉/layout/SettingDrawer.vue
:::
::: slot setting-drawer:index.scss
<<< @/../el-admin-layout/example/设置抽屉/style/index.scss
:::


## 持久化页签

这个功能不看源码就做的话，可能会出问题，所以出一个demo

打开几个页签然后刷新iframe即可看到效果（当然也可以直接跳转到iframe的地址）

这个demo会将页签数据存储到sessionStorage里，键是`'eal-test-persist-tags'`，关闭页面即可清除

<CodePreviewer src="persist-tags.html">
<<< @/../el-admin-layout/example/持久化页签/layout/index.vue
</CodePreviewer>


## 仿旧版七牛云侧边栏

说实话，如果真有这种需求，强烈建议自己写layout，因为这种肯定是需要去看源码的（像插槽的传递、父子组件关系等等），
如果在el-admin-layout基础上搞，你看看demo就知道有多麻烦了

<CodePreviewer src="old-qiniu-aside.html">
<Tab>
<TabPanel label="index.vue">
<Content slot-key="old-qiniu-aside:index.vue"/>
</TabPanel>
<TabPanel label="root.vue">
<Content slot-key="old-qiniu-aside:root.vue"/>
</TabPanel>
<TabPanel label="sub.vue">
<Content slot-key="old-qiniu-aside:sub.vue"/>
</TabPanel>
<TabPanel label="index.scss">
<Content slot-key="old-qiniu-aside:index.scss"/>
</TabPanel>
</Tab>
</CodePreviewer>


::: slot old-qiniu-aside:index.vue
<<< @/../el-admin-layout/example/仿旧版七牛云侧边栏/layout/index.vue
:::
::: slot old-qiniu-aside:root.vue
<<< @/../el-admin-layout/example/仿旧版七牛云侧边栏/layout/OldQiniuSidebar/root.vue
:::
::: slot old-qiniu-aside:sub.vue
<<< @/../el-admin-layout/example/仿旧版七牛云侧边栏/layout/OldQiniuSidebar/sub.vue
:::
::: slot old-qiniu-aside:index.scss
<<< @/../el-admin-layout/example/仿旧版七牛云侧边栏/style/index.scss
:::


## 仿chrome页签

一个简易版本，样式参考了[chrome-tabs](https://github.com/adamschwartz/chrome-tabs)

<CodePreviewer src="chrome-tabs.html">
<Tab>
<TabPanel label="index.vue">
<Content slot-key="chrome-tabs:index.vue"/>
</TabPanel>
<TabPanel label="var.scss">
<Content slot-key="chrome-tabs:var.scss"/>
</TabPanel>
<TabPanel label="index.scss">
<Content slot-key="chrome-tabs:index.scss"/>
</TabPanel>
<TabPanel label="chrome-tabs.scss">
<Content slot-key="chrome-tabs:chrome-tabs.scss"/>
</TabPanel>
</Tab>
</CodePreviewer>


::: slot chrome-tabs:index.vue
<<< @/../el-admin-layout/example/仿chrome页签/layout/index.vue
:::
::: slot chrome-tabs:var.scss
<<< @/../el-admin-layout/example/仿chrome页签/style/var.scss
:::
::: slot chrome-tabs:index.scss
<<< @/../el-admin-layout/example/仿chrome页签/style/index.scss
:::
::: slot chrome-tabs:chrome-tabs.scss
<<< @/../el-admin-layout/example/仿chrome页签/style/chrome-tabs.scss
:::
