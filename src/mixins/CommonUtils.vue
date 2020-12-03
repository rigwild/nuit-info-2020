<script>
// @ts-check

import { toHumanDate, toHumanDateTime } from '../utils'

export default {
  computed: {
    filterByValidationState() {
      return (data, neededValidationState) => data.filter(x => x.validationState === neededValidationState)
    },
    toHumanDate() {
      return date => toHumanDate(new Date(date))
    },
    toHumanDateTime() {
      return dateTime => toHumanDateTime(new Date(dateTime))
    },
    booleanFeatherIcon() {
      return bool => (bool ? 'check' : 'x')
    }
  },
  methods: {
    windowAlert(message) {
      alert(message) // eslint-disable-line no-alert
    },
    windowConfirm(message) {
      return confirm(message) // eslint-disable-line no-alert
    },
    windowPrompt(question, defaultAnswer) {
      return prompt(question, defaultAnswer) // eslint-disable-line no-alert
    }
  }
}
</script>
