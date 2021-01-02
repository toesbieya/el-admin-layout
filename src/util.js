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
