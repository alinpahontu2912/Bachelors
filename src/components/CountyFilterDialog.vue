<template>
  <q-dialog>
    <q-card class="row col-12 justify-evenly content-center" style="width: 500px; max-width: 80vw;">
      <q-card-section class="row col-12 justify-evenly content-center">
        <div class=" text-h6 ">Alege Filtre</div>
      </q-card-section>
      <q-card-section>
        <div class="row col-12 q-pa-md content-center justify-evenly">
          <q-select color="teal" outlined v-model="queryParams.endYear" :label="$t('start')" :options="yearOptions"
            style="width: 250px" behavior="menu" clearable />
        </div>
        <div class="row col-12 q-pa-md content-center justify-evenly">
          <q-select color="teal" outlined v-model="queryParams.startYear" :label="$t('end')" :options="yearOptions"
            style="width: 250px" behavior="menu" clearable />
        </div>
        <div class="row col-12 q-pa-md content-center justify-evenly">
          <q-select multiple color="teal" outlined v-model="queryParams.sex" :label="$t('sex')" :options="sexOptions"
            style="width: 250px" behavior="menu" clearable />
        </div>
        <div class="row col-12 q-pa-md content-center justify-evenly">
          <q-select multiple color="teal" outlined v-model="queryParams.counties" :label="$t('county')"
            :options="countyOptions" style="width: 250px" behavior="menu" clearable />
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

const { getCountyNames, getAvailableTime } = useQuery()
const bus = inject('bus')
const yearOptions = ref([])
const countyOptions = ref([])
const sexOptions = ref(['M', 'F', 'T'])


const queryParams = ref({
  startYear: '',
  endYear: '',
  sex: [],
  countries: []
})

function sendQueryParams() {
  const params = {}
  params.startYear = queryParams.value.startYear
  params.endYear = queryParams.value.endYear
  params.counties = queryParams.value.counties == null ? [] : queryParams.value.counties
  params.sex = queryParams.value.sex == null ? [] : queryParams.value.sex
  bus.emit(EVENT_KEYS.CHANGE_COUNTY_FILTERS, params)
}

onMounted(async () => {
  yearOptions.value = (await getAvailableTime('regional')).sort()
  countyOptions.value = await getCountyNames()
})

</script>
<style scoped>
.q-dialog__backdrop {
  backdrop-filter: blur(10px);
}
</style>
