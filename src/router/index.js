import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'

Vue.use(Router)

import user from './user'

export const routes = [
  {
    path: '/rest',
    name: 'Rest test',
    component: () => import('@/views/RestCall.vue'),
    meta: {
      needLoggedIn: false,
      neededAccountType: null
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      needLoggedIn: false,
      neededAccountType: null
    }
  },
  {
    path: '/error/:error',
    name: 'Error',
    component: () => import('@/views/Error.vue'),
    props: true,
    meta: {
      needLoggedIn: false,
      neededAccountType: null
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    props: true,
    meta: {
      needLoggedIn: false,
      neededAccountType: null
    }
  },
  ...user
]

const redirectToAccountDefaultPage = (to, from, next) => {
  if (store.getters.accountType === 'user') return next({ name: user[0].name })
}

const router = new Router({ routes, mode: 'history' })

router.beforeEach((to, from, next) => {
  // Redirect to login page if user is not logged in and want to go to a login-need page or `/`
  if (!store.getters.isLoggedIn && (to.meta.needLoggedIn || to.path === '/')) return next({ name: 'Login' })

  // Redirect to dashboard if user is logged in and want to go to a no-login-need page or `/`
  if (store.getters.isLoggedIn && (to.name === 'Login' || to.name === 'Register' || to.path === '/'))
    return redirectToAccountDefaultPage(to, from, next)

  // Redirect to error page if user tries to visit a page he is not allowed to see
  if (to.meta.neededAccountType && store.state.user.accountType !== to.meta.neededAccountType)
    return next({
      name: 'Error',
      params: { error: 'Vous ne possédez pas les permissions requises pour accéder à cette page.' }
    })

  next()
})

export default router
