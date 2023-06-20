<template>
  <div class="fit column wrap content-center">
    <div class="rowContainer row justify-evenly">
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="graphOption" :label="$t('chart_type')" :options="graphOptions"
          style="width: 250px;" behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="tal" filled v-model="oxOption" :label="$t('report')" :options="oxOptions" style="width: 250px;"
          behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="residencyOption" :label="$t('residency_area')" :options="residencyOptions"
          style="width: 250px;" behavior="menu" :disable="isResidencyDisabled" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="yearOption" :label="$t('year')" :options="yearOptions"
          style="width: 250px;" behavior="menu" :disable="isTimeDisabled" />
      </div>

      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="resetZoom">
          {{ $t('reset_zoom') }}
        </q-btn>
      </div>
      <div class="row col-1 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="fetchData">
          {{ $t('reload') }}
        </q-btn>
      </div>
      <div class="row col-1 q-pa-md content-center justify-evenly">
        <q-btn :disable="!canDownload" class="q-pa-md fit" color="teal" @click="downloadAsPdf">
          {{ $t('download') }}
          <q-tooltip v-if="canUserDownload" :offset="[10, 10]">
            {{ $t('can_download') }}
          </q-tooltip>
          <q-tooltip v-else :offset="[10, 10]">
            {{ $t('need_download') }}
          </q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <LineChart id="chart" :chartData="chartData" :options="lineChartOptions" ref="chart"
        style="height: 500px; width: 95vw;" v-if="isTimeOx && !isLineDifference" />
      <LineChart id="chart" :chartData="chartData" :options="lineChartOptions" ref="chart"
        style="height: 500px; width: 95vw;" v-if="isTimeOx && isLineDifference" />
      <BarChart id="chart" :chartData="chartData" :options="barChartoptions" ref="chart"
        style="height: 500px; width: 95vw;" v-if="!isTimeOx && !isAgeOx" />
      <BarChart id="chart" :chartData="chartData" :options="barChartoptions" ref="chart"
        style="height: 500px; width: 95vw;" v-if="!isTimeOx && isAgeOx" />

    </div>
  </div>
</template>

<script setup>

import { BarChart, LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { computed, ref, onMounted, watch } from 'vue';
import zoomPlugin from 'chartjs-plugin-zoom';
import useQuery from 'src/compositionFunctions/useQuery';
import utilities from 'src/utils/utilities.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Exporter from "vue-chartjs-exporter";
import { userStore } from 'src/stores/userStore';
import { useI18n } from 'vue-i18n';

Chart.register(...registerables);
Chart.register(zoomPlugin);
Chart.register(ChartDataLabels);

const { getRegionalData, getAvailableTime } = useQuery()
const { randomColor } = utilities()
const { canUserDownload } = userStore()
const { t } = useI18n()


const canDownload = computed(() => canUserDownload())
const colorDict = ref([])
const datasets = ref([])
const chart = ref(null)
const labels = ref([])
const yearOptions = ref([])
const yearOption = ref('2020-Q1')
const graphOptions = computed(() => [t('line_type'), t('bar_type')])
const graphOption = ref('BARA') //age_level_comparison
const oxOption = ref(t('age_level_comparison'))
const residencyOptions = ref(['URBAN', 'RURAL'])
const residencyOption = ref('URBAN')


const oxOptions = computed(() => {
  return graphOption.value == t('line_type') ? [t('number_employed_people'), t('residency_area_difference')] : [t('education_level_comparison'), t('age_level_comparison')]
})
const isBarChartSelected = computed(() => {
  return graphOption.value == t('bar_type') ? true : false
})
const isTimeDisabled = computed(() => {
  return graphOption.value == t('line_type')
})

const isResidencyDisabled = computed(() => {
  return oxOption.value == t('residency_area_difference')
})

watch(() => oxOptions.value, () => {
  oxOption.value = null
})

watch(() => graphOption.value, () => {
  if (graphOption.value == 'LINIAR') {
    yearOption.value = null
  }
})

const isAgeOx = ref(false)
const isTimeOx = ref(false)
const isLineDifference = ref(false)

const barChartoptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      color: 'black',
      anchor: 'start',
      rotation: '-90',
      align: 'end',
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

const lineChartOptions = ref({
  layout: {
    padding: {
      left: 180,
      right: 180
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      color: 'black',
      anchor: 'end',
      align: 'right',
      color: chart => {
        return chart.dataset.backgroundColor
      },
      formatter: function (value, context) {
        if (context.dataIndex === context.dataset.data.length - 1) {
          return value + " " + context.dataset.label
        } else {
          return value
        }
      }
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

const chartData = computed(() => ({
  labels: labels.value,
  datasets: datasets.value
}));

onMounted(async () => {
  yearOptions.value = (await getAvailableTime('residency')).sort()
  for (let i = 0; i < 50; i++) {
    colorDict.value.push('#' + randomColor())
  }
  const test = await getRegionalData(yearOption.value, '', 'T', residencyOption.value, 'barChart');
  ageOx(test)

})


function educationOx(queryResponse) {
  labels.value.length = 0
  datasets.value.length = 0
  labels.value = Array.from([...new Set(queryResponse.map(x => x.educationNavigation.educationLevel))])
  const ageValues = [...new Set(queryResponse.map(x => x.ageNavigation.age))]
  for (let i = 0; i < ageValues.length; i++) {
    datasets.value.push({ data: queryResponse.filter(x => x.ageNavigation.age === ageValues[i]).map(x => x.val), label: ageValues[i] })
  }
  isAgeOx.value = false
  isTimeOx.value = false
}

function ageOx(queryResponse) {
  labels.value.length = 0
  datasets.value.length = 0
  labels.value = Array.from([...new Set(queryResponse.map(x => x.ageNavigation.age))])
  const educationLevels = [...new Set(queryResponse.map(x => x.educationNavigation.educationLevel))]
  for (let i = 0; i < educationLevels.length; i++) {
    datasets.value.push({ data: queryResponse.filter(x => x.educationNavigation.educationLevel === educationLevels[i]).map(x => x.val), label: educationLevels[i] })
  }
  isAgeOx.value = true
  isTimeOx.value = false
}

function timeOx(queryResponse) {
  labels.value.length = 0
  datasets.value.length = 0
  labels.value = [...yearOptions.value]
  const educationLevels = [...new Set(queryResponse.map(x => x.educationNavigation.educationLevel))]
  const ageGroups = [...new Set(queryResponse.map(x => x.ageNavigation.age))]
  for (let i = 0; i < educationLevels.length; i++) {
    for (let j = 0; j < ageGroups.length; j++) {
      datasets.value.push({
        data: queryResponse.filter(x => x.educationNavigation.educationLevel === educationLevels[i] && x.ageNavigation.age === ageGroups[j]).map(x => x.val),
        label: educationLevels[i] + " " + ageGroups[j],
        hidden: true,
        backgroundColor: colorDict.value[i * educationLevels.length + j],
        borderColor: colorDict.value[i * educationLevels.length + j]
      })
    }
  }
  isTimeOx.value = true
}

function gapOx(queryResponse) {
  labels.value.length = 0
  datasets.value.length = 0
  labels.value = [...yearOptions.value]
  const educationLevels = [...new Set(queryResponse.map(x => x.education))]
  const ageGroups = [...new Set(queryResponse.map(x => x.age))]
  for (let i = 0; i < educationLevels.length; i++) {
    for (let j = 0; j < ageGroups.length; j++) {
      datasets.value.push({
        data: queryResponse.filter(x => x.education === educationLevels[i] && x.age === ageGroups[j]).map(x => x.value),
        label: educationLevels[i] + " " + ageGroups[j],
        hidden: true,
        backgroundColor: colorDict.value[i * educationLevels.length + j],
        borderColor: colorDict.value[i * educationLevels.length + j]
      })
    }
  }
  isTimeOx.value = true
}

async function fetchData() {
  if (oxOption.value === t('education_level_comparison')) {
    const response = await getRegionalData(yearOption.value, '', 'T', residencyOption.value, 'barChart');
    educationOx(response)
  }
  if (oxOption.value === t('age_level_comparison')) {
    const response = await getRegionalData(yearOption.value, '', 'T', residencyOption.value, 'barChart');
    ageOx(response)
  }
  if (oxOption.value === t('number_employed_people')) {
    const response = await getRegionalData('', '', 'T', residencyOption.value, 'line')
    timeOx(response)
  }
  if (oxOption.value === t('residency_area_difference')) {
    const response = await getRegionalData('', '', 'T', 'GAP', 'line')
    gapOx(response)
  }
}

function resetZoom() {
  chart.value.chartInstance.resetZoom()
}

function downloadAsPdf() {
  const exp = new Exporter([document.getElementById("chart")])
  exp.export_pdf().then((pdf) => pdf.save(`EmployabilityCaseStudy${oxOption.value}_${residencyOption.value}_${yearOption.value}.pdf`));
}

</script>
