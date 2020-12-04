import { createApp } from 'vue'

import App from './App.vue'
import './index.css'

const app = createApp(App)

import { router } from './router'
app.use(router)

import 'bootstrap/dist/css/bootstrap.css'

import VueFeather from 'vue-feather'
app.use(VueFeather)

import { Promised } from 'vue-promised'
app.component('Promised', Promised)

import Promisify from './components/Promisify.js'
app.component('Promisify', Promisify)

app.mount('#app')
