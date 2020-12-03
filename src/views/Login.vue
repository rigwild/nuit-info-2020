<template>
  <section class="container py-5 my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5 text-left">
        <Promised :promise="promise">
          <template #combined="{ isPending, error }">
            <div>
              <form @submit.prevent="sendForm">
                <div class="row">
                  <div class="col">
                    <h1>Connexion</h1>
                    <p class="lead">
                      Entrez vos identifiants pour accéder à votre tableau de
                      bord.
                    </p>
                  </div>
                </div>
                <b-form-group label="Adresse email" label-for="email">
                  <b-form-input
                    v-model="form.email"
                    id="email"
                    type="email"
                    placeholder="Email"
                    :disabled="isPending"
                    required
                  />
                </b-form-group>

                <b-form-group label="Mot de passe" label-for="password">
                  <b-form-input
                    v-model="form.password"
                    id="password"
                    type="password"
                    placeholder="Mot de passe"
                    :disabled="isPending"
                    required
                  />
                </b-form-group>

                <div class="row mt-4">
                  <div class="col">
                    <button
                      class="btn btn-secondary"
                      type="submit"
                      :disabled="isPending"
                    >
                      Connexion
                    </button>
                  </div>
                </div>

                <div class="mt-4 text-center form-result-box">
                  <Loader v-if="isPending" />
                  <b-alert :show="!!error" dismissible variant="danger">
                    {{ error && (error.message || error) }}
                  </b-alert>
                </div>
              </form>

              <!-- DEBUG BUTTONS -->
              <div class="mt-3">
                <p>Debug</p>
                <button
                  @click="
                    form = {
                      email: 'me@rigwild.dev',
                      password: 'me@rigwild.dev'
                    }
                  "
                  class="btn btn-primary btn-sm"
                  :disabled="isPending"
                >
                  User
                </button>
              </div>
            </div>
          </template>
        </Promised>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex'

import Loader from '@/components/Loader'

import CommonData from '@/mixins/CommonData.vue'

export default {
  components: {
    Loader
  },
  mixins: [CommonData],
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false
    }
  },
  methods: {
    ...mapActions(['login']),

    async sendForm() {
      try {
        if (!this.form.email || !this.form.password) {
          this.promise = Promise.reject('All fields are required.')
          return
        }

        this.promise = this.login(this.form.email, this.form.password)
      }
      catch (error) {
        this.promise = Promise.reject(error.message)
      }
    }
  }
}
</script>
