import {isEmpty, debounce} from "el-admin-layout/src/util"

export {isEmpty, debounce}

/**
 * 将source合并到target中
 * 仅对target中存在的键进行合并
 * 仅当遇到对象值时进行递归
 *
 * @param target
 * @param source
 */
export function mergeObj(target, source) {
    if (isEmpty(target, source)) return

    for (const key of Object.keys(target)) {
        if (!(key in source)) continue

        //数组类型直接赋值，不做深拷贝
        if (Array.isArray(target[key])) {
            target[key] = source[key] || []
            continue
        }

        //number类型不考虑NaN
        if (typeof target[key] === 'number') {
            target[key] = source[key] || 0
            continue
        }

        //非空对象递归处理
        if (target[key] !== null && typeof target[key] === 'object') {
            mergeObj(target[key], source[key])
            continue
        }

        target[key] = source[key]
    }
}
