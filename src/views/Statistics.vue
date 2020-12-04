<template>
  <div>
    <h1>Statistics</h1>

    <h5>Amount of registered activities: {{ reports_count }}</h5>
    <h5>Amount of unique users: {{ users_count }}</h5>
    <h5>Average activity duration: {{ new Intl.DateTimeFormat('default', { timeZone: 'UTC', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(+report_avg_duration) }}</h5>

    <h5>Consumed:</h5>
    <ul>
      <li v-for="product of consumed" :key="product.product_id">
        {{ product.name }} : {{ product.count }}
      </li>
    </ul>

    <h5>Reported:</h5>
    <ul>
      <li v-for="product of reported" :key="product.product_id">
        {{ product.name }} : {{ product.count }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { statistics, Statistics } from '../rest/index'

export default {
  data() {
    return {
      products: null,
      reports_count: null,
      users_count: null,
      report_avg_duration: null
    } as { [key in keyof Statistics]: Statistics[key] | null } & { consumed: Statistics['products'], reported: Statistics['products'] }
  },
  async mounted() {
    Object.assign(this, await statistics());
    const { true: consumed, false: reported } = this.products.reduce((acc, p) => (acc[p.is_consumable].push(p), acc), { 'true': [], 'false': [] });
    this.consumed = consumed;
    this.reported = reported;
    // this.products = this.products.sort((a, b) => {
    //   if (a.is_consumable && !b.is_consumable)
    //     return 1
    //   if (!a.is_consumable && b.is_consumable)
    //     return 1
    //   return 0
    // })
  }
}
</script>

<style scoped>
li {
  font-size: 13px;
}
</style>
