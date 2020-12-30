import Vue from 'vue'
import Element from 'element-ui'
import './style/index.scss'
import App from './App'
import router from './router'

Vue.use(Element)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
