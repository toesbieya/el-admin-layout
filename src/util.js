import {appGetters, tagsViewMutations} from "./store"
import cssVar from './style/var.scss'

const maxMobileWidth = parseFloat(cssVar.maxMobileWidth)

/*公用工具开始*/

/**
 * 判断是否为空值，undefined、null、'' 都视为空值
 *
 * @param str         不定参数
 * @return {boolean}  若为空值，返回true，否则返回false
 */
export function isEmpty(...str) {
    return str.some(i => i === undefined || i === null || i === '')
}

/**
 * 根据传入值的类型，返回基础起始值
 *
 * @param v
 * @return {boolean|{}|string|*[]|number|null}
 */
export function getInitialValue(v) {
    if (v === undefined || v === null) return null
    if (typeof v === 'string') return ''
    if (typeof v === 'boolean') return false
    if (typeof v === 'number') return 0
    if (typeof v === 'object') return {}
    if (Array.isArray(v)) return []
}

/**
 * 防抖
 *
 * @param func {function}      原函数
 * @param wait {number}        防抖间隔，单位毫秒
 * @param immediate {boolean}  是否立即执行一次
 * @return {function}          经过防抖包装后的函数
 */
export function debounce(func, wait = 100, immediate = false) {
    let timeout, args, context, timestamp, result

    const later = function () {
        // 据上一次触发时间间隔
        const last = new Date().getTime() - timestamp

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = window.setTimeout(later, wait - last)
        }
        else {
            timeout = null
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function () {
        context = this
        args = arguments
        timestamp = new Date().getTime()
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = window.setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
}

//将传入对象的所有函数的this绑定为其自身
export function bindThis(obj, root = obj) {
    if (!obj || typeof obj !== 'object') return

    Object.entries(obj).forEach(([k, v]) => {
        if (typeof v === 'function') {
            obj[k] = v.bind(root)
        }
        bindThis(v, root)
    })

    return obj
}

export function deepClone(source) {
    if (source === null || typeof source !== 'object' || source instanceof Promise) {
        return source
    }

    if (Array.isArray(source)) {
        return source.map(i => deepClone(i))
    }
    else {
        return Object.keys(source).reduce((obj, key) => {
            obj[key] = deepClone(source[key])
            return obj
        }, {})
    }
}

/*公用工具结束*/


//获取路由页面缓存所需的key
export function getRouterViewCacheKey({name, path, fullPath, meta = {}}) {
    const {usePathKey, useFullPathKey} = meta
    return usePathKey ? path : useFullPathKey ? fullPath : name
}

//获取侧边栏的菜单，如果是双层侧边栏导航时，获取的是子菜单
export function getSidebarMenus() {
    const menus = appGetters.menus

    if (!Array.isArray(menus)) {
        return []
    }

    //移动端时，侧边栏只会按侧边栏导航模式渲染
    if (appGetters.isMobile) {
        return menus
    }

    switch (appGetters.navMode) {
        case 'aside':
            return menus
        case 'head':
            return []
        case 'aside-two-part':
        case 'mix':
            const root = menus.find(i => i.path === appGetters.activeRootMenu)
            return root ? root.children || [] : []
        default:
            return []
    }
}

/**
 * 路由刷新
 *
 * @param route               需要刷新的路由对象
 * @param router              vue-router实例
 * @param replace {boolean}   是否使用replace进行跳转
 * @return {Promise}          返回vue-router跳转的结果
 */
export function refreshPage(route, router, replace = true) {
    tagsViewMutations.delCacheOnly(route)
    const to = `/redirect${route.fullPath}`
    return router[replace ? 'replace' : 'push'](to)
}

/**
 * 关闭当前页，如果传入next则跳转到next页面
 *
 * @param router                vue-router实例
 * @param next {string|route}   跳转的目标页面，作为第一个参数传入vue-router.replace
 * @return {undefined|Promise}  仅在next有值时，返回vue-router.replace的结果
 */
export function closeCurrentPage(router, next) {
    tagsViewMutations.delTagAndCache(router.currentRoute)
    if (!isEmpty(next)) {
        return router.replace(next)
    }
}

/**
 * 根据body宽度判断是否为移动端，是则返回true
 *
 * @return {boolean}
 */
export function isMobile() {
    const rect = document.body.getBoundingClientRect()
    return rect.width <= maxMobileWidth
}

//为Vue.observer返回的对象设置getter
export function createGetters(store) {
    const getters = Object.create({})
    Object.defineProperties(
        getters,
        Object.keys(store).reduce((obj, key) => {
            obj[key] = {
                enumerable: true,
                get() {
                    return store[key]
                }
            }
            return obj
        }, {})
    )
    return getters
}

//为Vue.observer返回的对象设置mutation
export function createMutations(store, all = false) {
    const keys = Object.keys(store)
    const obj = {}
    keys.forEach(key => {
        obj[key] = v => store[key] = v
    })
    if (all) {
        obj['$all'] = v => {
            keys.forEach(key => {
                store[key] = v && v[key] || getInitialValue(store[key])
            })
        }
    }
    return obj
}

