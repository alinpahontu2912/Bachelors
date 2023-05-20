<template>
  <div class="fit row q-px-md">
    <q-table class="col-12 my-sticky-header-table q-pa-md" ref="tableRef" flat bordered title="Rata de angajare pe judete"
      :rows="rows" :columns="columns" row-key="id" :loading="loading" :filter="filter" @request="onRequest"
      binary-state-sort :pagination="pagination" separator="cell">
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-slot:top-right>
        <div class="row col-2 q-pa-md content-center justify-evenly">
          <q-select color="teal" outlined v-model="endYear" label="START" :options="yearOptions" style="width: 150px"
            behavior="menu" clearable />
        </div>
        <div class="row col-2 q-pa-md content-center justify-evenly">
          <q-select color="teal" outlined v-model="startYear" label="END" :options="yearOptions" style="width: 150px"
            behavior="menu" clearable />
        </div>
        <div class="row col-2 q-pa-md content-center justify-evenly">
          <q-select color="teal" outlined v-model="sexOption" label="Sex" :options="sexOptions" style="width: 150px"
            behavior="menu" clearable />
        </div>
        <q-input class="q-px-md" borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn class="q-px-md" color="secondary" icon-right="archive" label="Export CSV" no-caps @click="exportTable" />
      </template>
    </q-table>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import useQuery from 'src/compositionFunctions/useQuery'
import { exportFile } from 'quasar'
const { getRegionalData, getAvailableTime } = useQuery()

const columns = [{
  name: 'judet',
  required: true,
  label: 'JUDET',
  align: 'center',
  field: row => row.region,
  format: val => `${val}`,
  sortable: true
},
{
  name: 'year',
  label: 'AN',
  align: 'center',
  field: row => row.yearQuarter,
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
  name: 'employment',
  label: 'RATA ANGAJARE',
  align: 'center',
  field: row => row.val,
  format: val => `${val}`,
  sortable: true
}]

const yearOptions = ref([])
const startYear = ref('')
const endYear = ref('')
const sexOptions = ref(['M', 'F', 'T'])
const sexOption = ref('')
const rows = ref([])
const filter = ref('')
const tableRef = ref()
const loading = ref(false)
const pagination = ref({
  rowsPerPage: 9
})

async function onRequest() {
  loading.value = true
  rows.value = await getRegionalData(startYear.value, endYear.value, sexOption.value, '', 'table')
  loading.value = false

}

watch(() => startYear.value, async () => {
  rows.value = await getRegionalData(startYear.value, endYear.value, sexOption.value, '', 'table')
})

watch(() => endYear.value, async () => {
  rows.value = await getRegionalData(startYear.value, endYear.value, sexOption.value, '', 'table')
})

watch(() => sexOption.value, async () => {
  rows.value = await getRegionalData(startYear.value, endYear.value, sexOption.value, '', 'table')
})

onMounted(async () => {
  yearOptions.value = (await getAvailableTime('regional')).sort()
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

