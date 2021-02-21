import Vue from 'vue'
import Element from 'element-ui'
import App from './App'
import store from './store'
import router from './router'
import './style/index.scss'

Vue.use(Element)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
