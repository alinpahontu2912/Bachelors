<template>
  <div class="fit row q-px-md" @changeFilters="test">
    <q-table class="col-12 my-sticky-header-table q-pa-md" ref="tableRef" flat bordered title="Rata de angajare pe judete"
      :rows="rows" :columns="columns" row-key="id" :loading="loading" @request="onRequest" binary-state-sort
      :pagination="pagination" separator="cell">
      <template v-slot:top-right>
        <div class="row col-2 q-pa-md content-center justify-evenly">
          <q-btn class="q-pa-md" color="secondary" icon-right="archive" label="Export CSV" no-caps @click="exportTable" />
        </div>
        <div class="row col-2 q-pa-md content-center justify-evenly">
          <q-btn class="q-pa-md" color="secondary" label="ALEGE FILTRE" no-caps @click="triggered = !triggered" />
        </div>
      </template>
    </q-table>
  </div>
  <EuropeFilterDialog v-model="triggered" />
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import useQuery from 'src/compositionFunctions/useQuery'
import { exportFile } from 'quasar'
import { EVENT_KEYS } from 'src/utils/eventKeys'
import EuropeFilterDialog from 'src/components/EuropeFilterDialog.vue'

const { getEuropeanData } = useQuery()
const bus = inject('bus')
const queryParams = ref({
  startYear: '',
  endYear: '',
  sex: [],
  ageGroup: [],
  educationOptions: [],
  countries: []
})
const triggered = ref(false)
const rows = ref([])

const columns = [{
  name: 'time',
  label: 'TRIMESTRU',
  align: 'center',
  field: row => row.yearQuarter,
  format: val => `${val}`,
  sortable: true
},
{
  name: 'country',
  required: true,
  label: 'TARA',
  align: 'center',
  field: row => row.countryCodeNavigation.name,
  format: val => `${val}`,
  sortable: true
},
{
  name: 'sex',
  label: 'SEX',
  align: 'center',
  field: row => row.sex,
  format: val => `${val}`,
  sortable: true
},
{
  name: 'age',
  label: 'VARSTA',
  align: 'center',
  field: row => row.ageNavigation.age,
  format: val => `${val}`,
  sortable: true
},
{
  name: 'education',
  label: 'NIVELUL EDUCATIEI',
  align: 'center',
  field: row => row.educationNavigation,
  format: val => `${val.educationLevel}`,
  sortable: true,
  sort: (a, b) => a.id - b.id
},
{
  name: 'value',
  label: 'RATA DE ANGAJARE',
  align: 'center',
  field: row => row.val,
  format: val => `${val}`,
  sortable: true
}]

const tableRef = ref()
const loading = ref(false)
const pagination = ref({
  rowsPerPage: 10
})



async function onRequest() {
  loading.value = true
  const response = await getEuropeanData(queryParams.value.startYear, queryParams.value.endYear, '', '', '', 'table');
  rows.value = filterResults(response)
  loading.value = false

}

function filterResults(data) {
  let filterData = data

  console.log(queryParams.value)
  if (queryParams.value.educationOptions.length != 0) {
    filterData = filterData.filter(element => queryParams.value.educationOptions.includes(element.educationNavigation.educationLevel))
  }
  if (queryParams.value.ageGroup.length != 0) {
    filterData = filterData.filter(element => queryParams.value.ageGroup.includes(element.ageNavigation.age))
  }
  if (queryParams.value.sex.length != 0) {
    filterData = filterData.filter(element => queryParams.value.sex.includes(element.sex))
  }
  if (queryParams.value.countries.length != 0) {
    filterData = filterData.filter(element => queryParams.value.countries.includes(element.countryCodeNavigation.name))
  }

  return filterData
}

bus.on(EVENT_KEYS.CHANGE_EUROPE_FILTERS, async (data) => {
  queryParams.value = data
  await onRequest()
})


onMounted(async () => {
  await tableRef.value.requestServerInteraction()
})

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  return `"${formatted}"`
}

function exportTable() {
  const content = [columns.map(col => wrapCsvValue(col.label))].concat(
    tableRef.value.filteredSortedRows.map(row => columns.map(col => wrapCsvValue(
      typeof col.field === 'function'
        ? col.field(row)
        : row[col.field === void 0 ? col.name : col.field],
      col.format,
      row
    )).join(','))
  ).join('\r\n')

  const status = exportFile(
    'table-export.csv',
    content,
    'text/csv'
  )

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning'
    })
  }
}
</script>
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  max-height: 650px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: white

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>


