<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
    <!-- <Loader /> -->
  </div>
</template>

<script>
import HelloWorld from '../components/HelloWorld.vue'
import Loader from '../components/Loader.vue'

export default {
  components: {
    HelloWorld,
    Loader
  }
}
</script>
