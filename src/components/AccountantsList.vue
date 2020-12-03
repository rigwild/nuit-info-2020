<template>
  <div>
    <h2>Comptables liés</h2>
    <div>
      <p v-if="data.length === 0">Aucun comptable lié.</p>
      <b-table v-else striped hover :fields="fields" :items="data" responsive>
        <template #cell(addedTimestamp)="{ item }">
          {{
            toHumanDateTime(item.addedTimestamp)
          }}
        </template>
        <template #cell(acceptedTimestamp)="{ item }">
          {{
            toHumanDateTime(item.acceptedTimestamp)
          }}
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import CommonUtils from '@/mixins/CommonUtils.vue'

export default {
  mixins: [CommonUtils],
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      fields: [
        { key: 'accountantName', label: 'Comptable', sortable: true },
        { key: 'accountantEmail', label: 'Adresse email', sortable: true },
        { key: 'addedTimestamp', label: 'Date d\'ajout', sortable: true },
        { key: 'acceptedTimestamp', label: 'Date de liason', sortable: true }
      ]
    }
  }
}
</script>
