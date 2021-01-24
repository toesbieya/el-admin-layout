//为Vue.observer返回的对象设置getter
export function createGetters(store) {
    const getters = Object.create(null)
    Object.defineProperties(
        getters,
        Object.keys(store).reduce((obj, key) => {
            obj[key] = {
                enumerable: true,
                get: () => store[key]
            }
            return obj
        }, {})
    )
    return getters
}

//为Vue.observer返回的对象设置mutation
export function createMutations(store) {
    return Object.keys(store).reduce((obj, key) => {
        obj[key] = v => store[key] = v
        return obj
    }, Object.create(null))
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
