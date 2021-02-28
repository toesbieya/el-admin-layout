import Vue from 'vue'
import VueRouter from 'vue-router'
import Element from 'element-ui'
import App from '@example/App'
import store from './store'
import router from './router'
import './style/index.scss'

Vue.use(VueRouter).use(Element)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
