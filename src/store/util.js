/**
 * 为Vue.observer返回的对象设置getter
 *
 * @template T
 * @param store {T}
 * @returns {{[key in keyof T]: T[key]}}
 */
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

/**
 * 为Vue.observer返回的对象设置mutation
 *
 * @template T
 * @param store {T}
 * @returns {{[key in keyof T]: function(val: T[key]): void}}
 */
export function createMutations(store) {
  return Object.keys(store).reduce((obj, key) => {
    obj[key] = v => store[key] = v
    return obj
  }, Object.create(null))
}
