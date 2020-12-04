<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Surfor</a>
    <a class="navbar-brand" href="#">{{ JSON.stringify(location, null, 2) }}</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" :class="{ 'active': $route.fullPath === '/' }">
          <router-link to="/" class="nav-link">Hello World</router-link>
        </li>
        <li class="nav-item" :class="{ 'active': $route.fullPath === '/location' }">
          <router-link to="/location" class="nav-link">Location</router-link>
        </li>
        <li class="nav-item" :class="{ 'active': $route.fullPath === '/addReport' }">
          <router-link to="/addReport" class="nav-link">Add report</router-link>
        </li>
      </ul>
    </div>
  </nav>

  <div class="container py-2">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { location } from './state'

export default {
  components: {
    HelloWorld
  },
  data() {
    return {
      location
    }
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .15s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.pointer {
  cursor: pointer !important;
}
</style>