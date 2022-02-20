import Vue from 'vue'
import { install, Store } from 'vuex'
import setting from './module/setting'

Vue.use(install)

export default new Store({ modules: { setting } })
