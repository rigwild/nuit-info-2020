<template>
  <div class="container text-center">
    <img src="https://media1.giphy.com/media/5nh8FKSRtxFEyuajGc/giphy.gif">
    <h4 class="my-4">Enjoy your activity! 🏄</h4>
    <div class="mt-5">
      <button @click="$emit('finish')" type="button" class="btn btn-primary btn-lg">I finished my activity! 🌊</button>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 100%;
}
</style>
