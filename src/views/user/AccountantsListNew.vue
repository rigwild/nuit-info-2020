<template>
  <div>
    <div class="container">
      <b-button :to="{ name: 'UserAccountantsList' }" variant="link">
        <feather type="arrow-left" size="13px" />
        Liste des comptables
      </b-button>

      <h2>Ajouter un comptable</h2>

      <Promised :promise="promise">
        <template #combined="{ isPending, data, error }">
          <div>
            <form @submit.prevent="sendForm">
              <b-form-group label="Adresse email" label-for="email">
                <b-form-input v-model="form.accountantEmail" id="email" type="email" placeholder="Email" :disabled="isPending" required />
              </b-form-group>

              <button class="btn btn-secondary" type="submit" :disabled="isPending">Ajouter</button>

              <div class="mt-4 text-center form-result-box">
                <Loader v-if="isPending" />
                <b-alert :show="!!data || !!error" dismissible :variant="error ? 'danger' : 'success'">
                  <template v-if="error">{{ error }}</template>
                  <template v-else-if="data">
                    Le comptable "{{ data.accountantEmail }}" a été ajouté à la liste de vos comptables.
                  </template>
                </b-alert>
              </div>
            </form>
          </div>
        </template>
      </Promised>
    </div>
  </div>
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
        accountantEmail: null
      }
    }
  },
  methods: {
    ...mapActions(['addUserChosenAccountants']),

    async sendForm() {
      try {
        this.promise = this.addUserChosenAccountants(this.form)
      }
      catch (error) {
        this.promise = Promise.reject(error.message)
      }
    }
  }
}
</script>
