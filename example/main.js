import Vue from 'vue'
import Element from 'element-ui'
import App from './App'
import router from './router'
import './style/index.scss'

Vue.use(Element)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
