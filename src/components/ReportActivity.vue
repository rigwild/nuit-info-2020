<template>
  <div>
    <h1>Add an activity</h1>

    <form @submit.prevent="sendForm">
      <Promisify :promise="promise">
        <template #combined="{ isPending, error }">
          <div v-if="isPending" class="text-center">
            <Loader />
          </div>

          <div v-else-if="!!error" class="alert alert-danger" role="alert">{{ error }}</div>

          <div v-else>
            <h2>Products you consumed</h2>
            <div class="form-group">
              <div v-for="aProduct of consumableProducts" :key="aProduct.id" class="form-check">
                <input class="form-check-input" type="checkbox" @change="aProduct.checked = !aProduct.checked" :value="aProduct.id" :checked="aProduct.checked" :id="`product-consumable-${aProduct.id}`">
                <label class="form-check-label" :for="`product-consumable-${aProduct.id}`">
                  {{ aProduct.name }}
                </label>
              </div>
            </div>
            
            <h2>Products you found on the beach</h2>
            <div class="form-group">
              <div v-for="aProduct of reportedProducts" :key="aProduct.id" class="form-check">
                <input class="form-check-input" type="checkbox" @change="aProduct.checked = !aProduct.checked" :value="aProduct.id" :checked="aProduct.checked" :id="`product-reported-${aProduct.id}`">
                <label class="form-check-label" :for="`product-reported-${aProduct.id}`">
                  {{ aProduct.name }}
                </label>
              </div>
            </div>

            <h2>Your activity</h2>
            <div class="form-group">
              <div v-for="(anActivity, index) of activitiesList" :key="anActivity.activity_id" class="form-check">
                <input class="form-check-input" type="radio" @click="activity = anActivity.activity_id" :id="`activity-${anActivity.activity_id}`" name="activity" :checked="index === 0">
                <label class="form-check-label" :for="`activity-${anActivity.activity_id}`">
                  {{ anActivity.name }}
                </label>
              </div>
            </div>
          </div>
        </template>
      </Promisify>
      
      <p v-if="!location">Accept the geolocation prompt to continue 🌍</p>
      <button type="reset" @click="cancel" class="btn btn-secondary">Cancel</button>
      <button type="submit" :disabled="!location || !(consumableProducts.length || reportedProducts.length) || isSendingForm" class="btn btn-primary ml-3">Submit</button>

      <div>
        <Loader v-if="isSendingForm" />
      </div>

    </form>
  </div>
</template>

<script lang="ts">
import { activities as getActivities, products as getProducts, Product, Activity, report } from '../rest/index.js'
import Loader from '../components/Loader.vue'

import { deviceId, getLocation, location, activityStartTimestamp } from '../state'
import { Ref } from 'vue'

interface CheckableProduct extends Product {
  checked: boolean;
}

export default {
  components: {
    Loader,
  },
  props: ['startActivityTimestamp', 'endActivityTimestamp'],
  data() {
    return {
      promise: null,
      location,
      consumableProducts: [],
      reportedProducts: [],
      activitiesList: [],
      activity: null,
      activityStartTimestamp: this.startActivityTimestamp,
      activityEndTimestamp: this.endActivityTimestamp,

      isSendingForm: false,
      hasValidatedForm: false
    } as {
      promise: Promise<unknown> | null,
      location: Ref<[number, number]> | null,
      consumableProducts: CheckableProduct[],
      reportedProducts: CheckableProduct[],
      activitiesList: Activity[],
      activity: Activity['activity_id'] | null,
      activityStartTimestamp: Date | null,
      isSendingForm: boolean
      hasValidatedForm: boolean
    }
  },
  mounted() {
    this.promise = this.load();
  },
  methods: {
    async load() {
      const [, { consumables, reportables }, activities] = await Promise.all([
        getLocation().catch(err => {
          alert('You must accept the geolocation prompt to continue.')
          this.$router.push('/')
        }),
        getProducts(),
        getActivities()
      ]);
      this.consumableProducts = consumables.map(x => ({ ...x, checked: false }))
      this.reportedProducts = reportables.map(x => ({ ...x, checked: false }))
      this.activitiesList = activities
      this.activity = activities[0].activity_id
    },
    async sendForm() {
      this.isSendingForm = true
      await new Promise(res => setTimeout(res, 3000))
      await report({
        activityId: this.activity,
        deviceId: deviceId.value,
        position: this.location,
        products: this.consumableProducts.concat(this.reportedProducts).filter(x => x.checked).map(x => x.id),
        activityStartedAt: this.activityStartedAt,
        activityEndedAt: this.activityEndedAt
      })
        .finally(() => {
          this.isSendingForm = false
          this.hasValidatedForm = true
          this.$emit('done');
          setTimeout(() => this.$router.push('/'), 3000)
        })
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>
