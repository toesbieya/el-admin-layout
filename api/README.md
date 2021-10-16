# 路由和菜单

## 路由meta配置

路由meta即vue-router中的`meta`，所有的配置项如下：

|属性|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|title|路由标题，用于页签栏|`string`|-|
|dynamicTitle|title的动态形式，优先使用|`function(route)`|-|
|pageHeader|是否显示页头|`boolean`|`true`|
|pageFooter|是否显示页脚|`boolean`|`true`|
|noCache|是否**不**缓存页面|`boolean`|-|
|activeMenu|指定激活菜单的fullPath|`string`|-|
|iframe|需要打开的iframe的地址|`string`|-|
|usePathKey|是否使用route.path作为唯一key|`boolean`|-|
|useFullPathKey|是否使用route.fullPath作为唯一key|`boolean`|-|

## 菜单配置

### 菜单配置项

|属性|说明|类型|
|:---:|:---:|:---:|
|fullPath|菜单的唯一key，叶子节点时对应路由的path全路径，以`'http'`开头时视为外链|`string`|
|meta|菜单meta|`object`|
|children|子级菜单|`array`|

::: warning
除非是外链，否则不要在`fullPath`中使用url参数！像`'/index?x=1'`这种
:::

### 菜单meta配置项

|属性|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|title|菜单标题，必须要有值|`string`|-|
|sort|菜单排序值，值越小越靠前|`number`|10000|
|icon|菜单图标|`string`|-|
|affix|是否在页签栏中固定显示|`boolean`|- |

::: tip 注意
路由meta配置项和菜单meta配置项都有`title`，但是两者效果不同，请注意区分！
:::
