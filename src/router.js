import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('./views/Statistics.vue') },
  { path: '/activity', component: () => import('./views/Activity.vue') },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
