<template>
  <h1>Get my lcoation</h1>
  <button @click="askLocation()">Get geo location</button>
</template>

<script>
import Promisify from './Promisify.js';
import Loader from './Loader.vue';

export default {
  components: {
    Promisify,
    Loader
  },
  props: {
    msg: String
  },
  data() {
    return {
      count: 0,
      promise: null
    }
  },
  methods: {
    askLocation() {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      function success(pos) {
        const { latitude, longitude, accuracy } = pos.coords;

        console.log('Your current position is:');
        console.log(`Latitude : ${latitude}`);
        console.log(`Longitude: ${longitude}`);
        console.log(`More or less ${accuracy} meters.`);
      }

      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }

      navigator.geolocation.getCurrentPosition(success, error, options);
    }
  }
}
</script>
