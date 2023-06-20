<template>
  <div class="fit column wrap content-center">
    <div class="rowContainer row ">
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="yearOption" :label="$t('year')" :options="yearOptions" style="width: 250px"
          behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="sexOption" :label="$t('sex')" :options="sexOptions" style="width: 250px"
          behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="ageOption" :label="$t('age')" :options="ageOptions" style="width: 250px"
          behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="educationOption" :label="$t('education')" :options="educatonOptions"
          style="width: 250px" behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="resetZoom">
          {{ $t('reset_zoom') }}
        </q-btn>
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-btn :disable="!canDownload" class="q-pa-md fit" color="teal" @click="downloadAsPdf">
          <q-icon name="information">
            <q-tooltip>
              {{ $t('need_download') }}
            </q-tooltip>
          </q-icon>
          {{ $t('download') }}
          <q-tooltip persistent :offset="[10, 10]">
            {{ $t('can_download') }}
          </q-tooltip>

        </q-btn>

      </div>
    </div>
    <div class="q-pa-md">
      <div class="row justify-evenly"><strong>{{ $t('employment_rate') }}</strong></div>
      <BarChart id="chart" :chartData="testData" :options="options" ref="barChart" style="height: 550px;" />
    </div>
  </div>
</template>
<script setup>
import { BarChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { computed, ref, onMounted, watch } from 'vue';
import { userStore } from 'src/stores/userStore';
import { useI18n } from 'vue-i18n';
import zoomPlugin from 'chartjs-plugin-zoom';
import useQuery from 'src/compositionFunctions/useQuery';
import utilities from 'src/utils/utilities.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Exporter from "vue-chartjs-exporter";


Chart.register(...registerables)
Chart.register(zoomPlugin)
Chart.register(ChartDataLabels)

const { getEuropeanData } = useQuery()
const { getAgeId, getEducationId, generateYearQuarters } = utilities()
const { canUserDownload } = userStore()

const { t } = useI18n()
const canDownload = computed(() => canUserDownload())
const datasets = ref([])
const barChart = ref(null)
const labels = ref([])
const sexOptions = ref(['T', 'M', 'F'])
const sexOption = ref('T')
const ageOptions = ref(['15-24', '25-54', '55-64'])
const educatonOptions = computed(() => [t('max_sec'), t('max_high'), t('univ')])
const yearOptions = ref([])
const yearOption = ref('2020-Q4')
const ageOption = ref('15-24')
const educationOption = ref(t('max_sec'))

const options = ref({
  plugins: {
    legend: {
      display: false
    },
    datalabels: {
      color: 'black',
      anchor: 'start',
      rotation: '-90',
      align: 'end'
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pan: {
          enabled: true
        },
        drag: {
          enabled: true,
          mode: 'x'
        },
        mode: 'xy',
      }
    }
  },

})


const testData = computed(() => ({
  labels: labels.value,
  datasets: datasets.value
}));

onMounted(async () => {
  const response = await getEuropeanData(yearOption.value, '', sexOption.value, getAgeId(ageOption.value), getEducationId(educationOption.value), 'barChart');
  labels.value = response[0]
  createDataSets(response[1])
  yearOptions.value.push(...generateYearQuarters(2020, 2021))
})


function createDataSets(queryResponse) {
  datasets.value.length = 0;
  datasets.value.push({ data: queryResponse, label: 'RATA DE ANGAJARE' })
}

async function fetchData() {
  const response = await getEuropeanData(yearOption.value, '', sexOption.value, getAgeId(ageOption.value), getEducationId(educationOption.value), 'barChart');
  labels.value = response[0]
  createDataSets(response[1])
}

function resetZoom() {
  barChart.value.chartInstance.resetZoom()
}

function downloadAsPdf() {
  const exp = new Exporter([document.getElementById("chart")])
  exp.export_pdf().then((pdf) => pdf.save(`EUEmploymentRate${yearOption.value}_${sexOption.value}_${ageOption.value}_${educationOption.value}.pdf`));
}

watch(() => yearOption.value, () => {
  fetchData()
})
watch(() => sexOption.value, () => {
  fetchData()
})
watch(() => ageOption.value, () => {
  fetchData()
})
watch(() => educationOption.value, () => {
  fetchData()
})
</script>
