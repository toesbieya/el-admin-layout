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
