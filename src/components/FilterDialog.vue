<template>
  <q-dialog>
    <q-card class="row col-12 justify-evenly content-center" style="width: 500px; max-width: 80vw;">
      <q-card-section class="row col-12 justify-evenly content-center">
        <div class=" text-h6 ">Alege Filtre</div>
      </q-card-section>
      <q-card-section>
        <div class="row col-12 q-pa-md content-center justify-evenly">
          <q-select color="teal" outlined v-model="queryParams.startYear" :label="$t('start')" :options="yearOptions"
            style="width: 250px" behavior="menu" clearable />
        </div>
        <div class="row col-12 q-pa-md content-center justify-evenly">
          <q-select color="teal" outlined v-model="queryParams.endYear" :label="$t('end')" :options="yearOptions"
            style="width: 250px" behavior="menu" clearable />
        </div>
        <div class="row col-12 q-pa-md content-center justify-evenly">
          <q-select color="teal" multiple outlined v-model="queryParams.residencyOption" :label="$t('residency')"
            :options="residencyOptions" style="width: 250px" behavior="menu" clearable />
        </div>
        <div class="row col-12 q-pa-md content-center justify-evenly">
          <q-select multiple color="teal" outlined v-model="queryParams.ageGroup" :label="$t('age')" :options="ageOptions"
            style="width: 250px" behavior="menu" clearable />
        </div>
        <div class="row col-12 q-pa-md content-center justify-evenly">
          <q-select multiple color="teal" outlined v-model="queryParams.educationLevel" :label="$t('education')"
            :options="educationOptions" style="width: 250px" behavior="menu" clearable />
        </div>
      </q-card-section>
      <q-card-section class="row col-12 justify-evenly content-center">
        <q-btn v-close-popup class="bg-teal text-white" :label="$t('filter_now')" @click="sendQueryParams" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, inject, onMounted } from 'vue'
import { EVENT_KEYS } from 'src/utils/eventKeys'
import useQuery from 'src/compositionFunctions/useQuery'

const bus = inject('bus')
const { getAvailableTime } = useQuery()
const yearOptions = ref([])
const ageOptions = ref(['15-24', '25-34', '35-49', '50-54', '55-59', '60-64'])
const residencyOptions = ref(['URBAN', 'RURAL'])
const educationOptions = ref(['PRIMAR', 'GIMNAZIU', 'LICEU', 'UNIVERSITAR'])


const queryParams = ref({
  startYear: '',
  endYear: '',
  residencyOption: [],
  ageGroup: [],
  educationLevel: []
})

function sendQueryParams() {
  const params = {}
  params.startYear = queryParams.value.startYear
  params.endYear = queryParams.value.endYear
  params.residencyOption = (queryParams.value.residencyOption == null || queryParams.value.residencyOption.length == 2) ? 'BOTH' : queryParams.value.residencyOption[0]
  params.educationOptions = queryParams.value.educationLevel == null ? [] : queryParams.value.educationLevel
  params.ageGroup = queryParams.value.ageGroup == null ? [] : queryParams.value.ageGroup
  bus.emit(EVENT_KEYS.CHANGE_REGIONAL_FILTERS, params)
}

onMounted(async () => {
  yearOptions.value = (await getAvailableTime('residency')).sort()
})

</script>
<style scoped>
.q-dialog__backdrop {
  backdrop-filter: blur(10px);
}
</style>
