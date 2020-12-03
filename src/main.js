import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

import VueFeather from 'vue-feather'
Vue.use(VueFeather)

import { Promised } from 'vue-promised'
Vue.component('Promised', Promised)

// Check environment variable is set
if (!process.env.VUE_APP_API_PREFIX) throw new Error('Missing API_PREFIX environment variable')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
