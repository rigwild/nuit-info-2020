<template>
  <div class="container text-center">
    <div class="alert alert-danger" role="alert">{{ error }}</div>
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
