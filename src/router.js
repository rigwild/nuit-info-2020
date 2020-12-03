import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('./components/HelloWorld.vue') },
  { path: '/about', component: () => import('./components/HelloWorld.vue') }
]
export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
