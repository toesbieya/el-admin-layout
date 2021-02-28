import Vue from 'vue'
import {install, Store} from 'vuex'

Vue.use(install)

const moduleFiles = require.context('./module', true, /\.js$/)

const modules = moduleFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = moduleFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})

export default new Store({modules})
