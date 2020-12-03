<template>
  <div class="container text-center">
    <Promised :promise="promise">
      <template #combined="{ isPending, error, data }">
        <div>
          <p v-if="isPending">Pending...</p>
          <p v-if="error">{{ error }}</p>
          <p v-if="data">{{ data }}</p>
        </div>
      </template>
    </Promised>
  </div>
</template>

<script>
import { helloWorld } from '#/index'

export default {
  data() {
    return {
      promise: null
    }
  },
  mounted() {
    this.promise = helloWorld('john')
  }
}
</script>
