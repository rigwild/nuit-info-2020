<template>
  <div v-if="!activityStartTimestamp && !activityEndTimestamp" class="text-center">
    <p>When you are ready to start your activity, press the button below, go do your thing and come back to add your report! 📝</p>
    <button @click="startActivity" type="button" class="btn btn-primary btn-lg">
      Start an activity 🏄
    </button>
  </div>
  <DoingActivity v-else-if="!activityEndTimestamp" @finish="endActivity" />
  <ReportActivity
    v-else-if="activityStartTimestamp && activityEndTimestamp"
    :startActivityTimestamp="activityStartTimestamp"
    :endActivityTimestamp="activityEndTimestamp"
    @done="done"
    @cancel="cancel"
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
      activityEndTimestamp: activityEndTimestamp,
      timer: null
    };
  },
  created() {
    if (activityEndTimestamp.value && !activityStartTimestamp.value)
      activityEndTimestamp.value = null;
  },
  unmounted() {
    clearTimeout(this.timer);
  },
  watch: {
    activityStartTimestamp() {
      if (this.activityEndTimestamp && !this.activityStartTimestamp)
        this.timer = setTimeout(() => this.cancel(), 3000);
      else
        clearTimeout(this.timer);
    }
  },
  methods: {
    startActivity() {
      activityStartTimestamp.value = new Date();
    },
    endActivity() {
      activityEndTimestamp.value = new Date();
    },
    done() {
      activityStartTimestamp.value = null;
    },
    cancel() {
      this.done()
      activityEndTimestamp.value = null;
    }
  }
}
</script>

<style>

</style>
