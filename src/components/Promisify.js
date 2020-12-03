import { defineComponent, ref, toRefs, unref, watch } from 'vue';

export default defineComponent({
  name: 'Promisify',
  props: {
      promise: {},
  },
  setup(props, { slots }) {
    const { promise } = toRefs(props);
    const isPending = ref(false);
    const error = ref(null);
    const data = ref(null);
    let expired;
    const update = () => {
      console.log('AAAA');
      if (expired)
        expired.value = true;
      const exp = (expired = ref(false));
      isPending.value = true
      error.value = null
      data.value = null
      Promise.resolve(promise.value)
        .then(
          res => (!exp.value && (data.value = res, isPending.value = false)),
          err => (!exp.value && (error.value = err, isPending.value = false))
        );
    };
    watch(() => unref(promise), update);
    update();
    return () => slots.combined ? slots.combined({ isPending: unref(isPending), error: unref(error), data: unref(data) }) : null
  }
});
