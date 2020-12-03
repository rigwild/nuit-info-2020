// @ts-check

import { login, register } from '#/index'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import router from './router'
// import { shortenApiCall, shortenApiCallFormData } from './utils'

Vue.use(Vuex)

const defaultState = () =>
  JSON.parse(
    JSON.stringify({
      token: null,
      user: {
        email: null,
        accountType: null
      }
    })
  )

export const API_ROUTES = {
  login: '/login',
  register: '/register',
  user: {
    accountantsList: () => '/user/accountantsList',
    uploadedDocuments: () => '/user/uploadedDocuments',
    uploadedDocument: documentId => `/user/uploadedDocuments/${documentId}`
  }
}

export default new Vuex.Store({
  state: {
    token: null,
    user: {
      email: null,
      accountType: null
    }
  },

  actions: {
    register(_, { email, password, linkedinId, accountType, name }) {
      return register({ email, password, linkedinId, accountType, name })
      // return shortenApiCall(API_ROUTES.register, { email, password, linkedinId, accountType, name })
    },

    async login({ commit }, { email, password }) {
      const res = await login(email, password)
      // const res = await shortenApiCall(API_ROUTES.login, { email, password })
      commit('setLoggedIn', res)
      // Redirect the page to `/` so vue-router rule redirects to appropriate dashboard
      router.push('/')
    },

    // //////////////////
    // USER ACTIONS
    // //////////////////

    getUserChosenAccountantsList() {
      return shortenApiCall(API_ROUTES.user.accountantsList())
    },
    addUserChosenAccountants(_, { accountantEmail }) {
      return shortenApiCall(
        API_ROUTES.user.accountantsList(),
        { accountantEmail },
        'PUT'
      )
    },
    getUserUploadedDocuments() {
      return shortenApiCall(API_ROUTES.user.uploadedDocuments)
    },
    getUserUploadedDocument(_, { documentId }) {
      return shortenApiCall(API_ROUTES.user.uploadedDocument(documentId))
    },
    async editUserUploadedDocument(_, { documentId }) {
      await shortenApiCallFormData(
        API_ROUTES.user.uploadedDocument(documentId),
        {},
        'PATCH'
      )
      router.push('/')
    },
    addUserDocument(_, { validatorAccountantId, document }) {
      return shortenApiCallFormData(
        API_ROUTES.user.uploadedDocuments,
        {
          validatorAccountantId,
          document
        },
        'PUT'
      )
    }
  },

  mutations: {
    setLoggedIn(state, { token, username: email, accountType }) {
      state.token = token
      state.user.email = email
      state.user.accountType = accountType
    },
    setLoggedOut(state) {
      const getDefault = defaultState()
      state.token = getDefault.token
      state.user.email = getDefault.user.email
      state.user.accountType = getDefault.user.accountType
      router.push('/')
    }
  },

  getters: {
    isLoggedIn(state) {
      return !!state.user.email
    },
    email(state) {
      return state.user.email
    },
    accountType(state) {
      return state.user.accountType
    }
  },

  plugins: [createPersistedState({ key: 'vuex-store' })]
})
