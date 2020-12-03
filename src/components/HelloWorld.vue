<template>
  <h1>{{ msg }}</h1>
  <button @click="update()">count is: {{ count }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
  <Promisify :promise="promise">
    <template #combined="{ isPending, data, error }">
      <div v-if="isPending" class="text-center">
        <Loader />
      </div>

      <div v-else-if="data">
        <p v-if="data.length === 0">Vide</p>
        <div v-else>
          <pre>{{ JSON.stringify(data, null, 2) }}</pre>
        </div>
      </div>

      <div v-if="!!error" class="alert alert-danger" role="alert">{{ error }}</div>
    </template>
  </Promisify>
</template>

<script>
import Promisify from './Promisify.js';
import Loader from './Loader.vue';

export default {
  name: 'HelloWorld',
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
    update() {
      this.count++;
      this.promise = new Promise(res => setTimeout(() => res('ok!'), 3000))
    }
  }
}
</script>
