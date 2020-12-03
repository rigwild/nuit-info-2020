<template>
  <div>
    <div class="container">
      <h1>Comptables</h1>

      <div class="text-center">
        <b-button :to="{ name: 'UserAccountantsListNew' }" class="btn btn-primary mb-3">Ajouter un comptable</b-button>
      </div>

      <Promised :promise="promise">
        <template #combined="{ isPending, data, error }">
          <div>
            <div v-if="isPending" class="text-center">
              <Loader />
            </div>
            <div v-else-if="data">
              <p v-if="data.length === 0">Aucun comptable enregistré.</p>
              <div v-else>
                <AccountantsList :data="data" />
              </div>
            </div>

            <b-alert :show="!!error" class="text-center" dismissible variant="danger">{{ error }}</b-alert>
          </div>
        </template>
      </Promised>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import Loader from '@/components/Loader'
import AccountantsList from '@/components/AccountantsList'

import CommonData from '@/mixins/CommonData.vue'
import CommonUtils from '@/mixins/CommonUtils.vue'

export default {
  components: {
    Loader,
    AccountantsList
  },
  mixins: [CommonData, CommonUtils],
  mounted() {
    this.promise = this.getUserChosenAccountantsList()
  },
  methods: {
    ...mapActions(['getUserChosenAccountantsList'])
  }
}
</script>
