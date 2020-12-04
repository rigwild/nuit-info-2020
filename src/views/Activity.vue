<template>
  <button v-if="!activityStartTimestamp && !activityEndTimestamp" @click="startActivity">Start</button>
  <DoingActivity v-else-if="!activityEndTimestamp" @finish="endActivity" />
  <ReportActivity
    v-else-if="activityStartTimestamp && activityEndTimestamp"
    :startActivityTimestamp="activityStartTimestamp"
    :endActivityTimestamp="activityEndTimestamp"
    @done="activityStartTimestamp = null"
    @cancel="activityEndTimestamp = (activityStartTimestamp = null)"
  />
  <div v-else class="alert alert-success" role="alert">
    Your activity was succesfully recorded! 💖
  </div>
</template>

<script>
import DoingActivity from '../components/DoingActivity.vue';
import ReportActivity from '../components/ReportActivity.vue';
import { activityEndTimestamp, activityStartTimestamp, startActivity, stopActivity } from '../state'

export default {
  components: {
    DoingActivity,
    ReportActivity
  },
  data() {
    return {
      activityStartTimestamp: activityStartTimestamp,
      activityEndTimestamp: activityEndTimestamp
    };
  },
  methods: {
    startActivity() {
      this.activityStartTimestamp = startActivity();
    },
    endActivity() {
      this.activityEndTimestamp = stopActivity();
      this.$forceUpdate();
    }
  }
}
</script>

<style>

</style>