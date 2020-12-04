import { defineComponent, ref, toRefs, unref, watch } from 'vue';

export default defineComponent({
  name: 'Promisify',
  props: {
    promise: {}
  },
  setup(props, { slots }) {
    const { promise } = toRefs(props);
    const isPending = ref(false);
    const error = ref(undefined);
    const data = ref(promise.value instanceof Promise ? undefined : promise.value);
    let expired;
    const update = () => {
      if (expired)
        expired.value = true;
      const exp = (expired = ref(false));
      isPending.value = true
      error.value = undefined
      data.value = undefined
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
