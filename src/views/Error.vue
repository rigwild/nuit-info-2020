<template>
  <div class="container text-center">
    <b-alert show variant="danger">{{ error }}</b-alert>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: String,
      required: true
    }
  }
}
</script>
