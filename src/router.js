import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('./views/Home.vue') },
  { path: '/location', component: () => import('./views/Location.vue') },
  { path: '/addReport', component: () => import('./views/Activity.vue') },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
