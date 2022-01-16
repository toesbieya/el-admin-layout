export { getters as appGetters, mutations as appMutations, getMenuByFullPath } from './app'
export { getters as asideGetters, mutations as asideMutations } from './aside'
export { getters as headerGetters, mutations as headerMutations } from './header'
export { getters as pageGetters, mutations as pageMutations } from './page'
export { getters as tagsViewGetters, mutations as tagsViewMutations } from './tagsView'

/**
 * 简化从store中批量取值的过程
 *
 * @type {import('types/store').mapGetters}
 */
export const mapGetters = (store, propNames) => {
  return propNames.reduce((map, prop) => {
    map[prop] = () => store[prop]
    return map
  }, {})
}
