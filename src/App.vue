<template>
  <div id="app">
    <header class="bg-light">
      <div class="container">
        <b-navbar toggleable="lg" type="light" class="navbar-expand-md">
          <b-navbar-brand to="/">
            <img src="@/assets/logo.png" height="30" alt="logo" />
          </b-navbar-brand>

          <b-navbar-toggle target="nav-collapse" />

          <b-collapse id="nav-collapse" is-nav>
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
              <template v-if="isLoggedIn">
                <router-link
                  v-for="(aRoute, index) in currentUserAvailableRoutes.filter(x => x.meta && x.meta.menuBarName)"
                  :key="index"
                  exact-active-class="active"
                  class="nav-link"
                  :to="aRoute.path"
                  tag="b-nav-item"
                >
                  {{ aRoute.meta.menuBarName }}
                </router-link>
                <b-nav-item>
                  <a href="#" class="btn btn-outline-primary ml-md-3" @click.prevent="setLoggedOut">{{ email }} - Déconnexion</a>
                </b-nav-item>
              </template>
              <template v-else>
                <router-link exact-active-class="active" class="nav-link" :to="{ name: 'Login' }" tag="b-nav-item">
                  Connexion
                </router-link>
                <router-link exact-active-class="active" class="nav-link" :to="{ name: 'Register' }" tag="b-nav-item">
                  Inscription
                </router-link>
              </template>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
    </header>

    <div>
      <transition name="fade">
        <router-view class="py-4" />
      </transition>
    </div>

    <footer class="fdb-block footer-small">
      <div class="container">
        <div class="row align-items-center text-center">
          <div class="col-12 col-lg-4 text-lg-left">© 2020 Company</div>

          <div class="col-12 col-lg-4 mt-4 mt-lg-0">
            <img alt="image" src="@/assets/logo.png" height="40" />
          </div>

          <div class="col-12 col-lg-4 text-lg-right mt-4 mt-lg-0">
            <ul class="nav justify-content-lg-end justify-content-center">
              <li class="nav-item">
                <router-link class="nav-link" to="/">Privacy policy</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/">Terms of service</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import userRoutes from '@/router/user'

export default {
  computed: {
    ...mapGetters(['isLoggedIn', 'email', 'accountType']),

    currentUserAvailableRoutes() {
      if (this.isLoggedIn) {
        if (this.accountType === 'user') return userRoutes
      }
      return null
    }
  },
  methods: {
    ...mapMutations(['setLoggedOut'])
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.15s;
}
.fade-enter-active {
  transition-delay: 0.15s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.pointer {
  cursor: pointer !important;
}

.btn-purple {
  color: #fff !important;
  background-color: #6e76e5 !important;
  border-color: #6e76e5 !important;
}
.btn-yellow {
  color: #fff !important;
  background-color: #ffc107 !important;
  border-color: #ffc107 !important;
}
.btn-cyan {
  color: #fff !important;
  background-color: #6ee3d8 !important;
  border-color: #74e4da !important;
}

.popover {
  max-width: 100% !important;
}
.max-width-1500 {
  max-width: 1500px !important;
}
</style>
