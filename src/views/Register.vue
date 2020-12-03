<template>
  <section class="container py-5 my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5 text-left">
        <form @submit.prevent="sendForm" class="fdb-box">
          <div class="row">
            <div class="col">
              <h1>Inscription</h1>
              <p class="lead">Créez votre compte pour accéder au service.</p>
            </div>
          </div>

          <b-form-group label="Adresse email" label-for="email">
            <b-form-input
              v-model="form.email"
              id="email"
              type="email"
              placeholder="Adresse email"
              :disabled="loading"
              required
            />
          </b-form-group>

          <b-form-group label="Nom" label-for="name">
            <b-form-input v-model="form.name" id="name" placeholder="Nom" :disabled="loading" required />
          </b-form-group>

          <b-form-group label="Mot de passe" label-for="password">
            <b-form-input
              v-model="form.password"
              id="password"
              type="password"
              placeholder="Mot de passe"
              :disabled="loading"
              required
            />
          </b-form-group>

          <div class="row mt-4">
            <div class="col">
              <button class="btn btn-secondary" type="submit" :disabled="loading">Inscription</button>
            </div>
          </div>
          <div class="mt-4 text-center">
            <Loader v-if="loading" />
            <b-alert :show="!!error" dismissible variant="danger">{{ error }}</b-alert>
            <b-alert :show="success" dismissible variant="success">
              Your account was created. You can now log in.
            </b-alert>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex'

import Loader from '@/components/Loader'

export default {
  components: {
    Loader
  },
  data() {
    return {
      form: {
        email: '',
        name: '',
        password: ''
      },
      loading: false,
      error: null,
      success: false
    }
  },
  methods: {
    ...mapActions(['register']),

    async sendForm() {
      try {
        if (['email', 'name', 'password'].some(x => !this.form[x])) throw new Error('All fields are required.')

        this.error = null
        this.loading = true
        await this.register({
          email: this.form.email,
          name: this.form.name,
          password: this.form.password
        })
        this.success = true
        this.$router.push({ name: 'Login' })
      }
      catch (error) {
        this.error = error.message
      }
      finally {
        this.loading = false
      }
    }
  }
}
</script>
