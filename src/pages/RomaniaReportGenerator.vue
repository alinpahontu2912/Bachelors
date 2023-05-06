<template>
  <div class="fit column wrap content-center">
    <div class="rowContainer row justify-evenly">
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="graphOption" label="Tip Grafic" :options="graphOptions"
          style="width: 250px;" behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="tal" filled v-model="oxOption" label="Axa OX" :options="oxOptions" style="width: 250px;"
          behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="residencyOption" label="Mediu de Rezidenta" :options="residencyOptions"
          style="width: 250px;" behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="yearOption" label="Trimestru" :options="yearOptions" style="width: 250px;"
          behavior="menu" :disable="isTimeDisabled" />
      </div>

      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="resetZoom">
          Reset Zoom
        </q-btn>
      </div>
      <div class="row col-1 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="fetchData">
          Reload
        </q-btn>
      </div>
      <div class="row col-1 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="downloadAsPdf">
          Download
        </q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <LineChart id="chart" :chartData="chartData" :options="lineChartOptions" ref="chart"
        style="height: 500px; width: 95vw;" v-if="isTimeOx" />
      <BarChart id="chart" :chartData="chartData" :options="barChartoptions" ref="chart"
        style="height: 500px; width: 95vw;" v-if="!isTimeOx && !isAgeOx && isBarChartSelected" />
      <BarChart id="chart" :chartData="chartData" :options="barChartoptions" ref="chart"
        style="height: 500px; width: 95vw;" v-if="!isTimeOx && isAgeOx && isBarChartSelected" />
      <LineChart id="chart" :chartData="chartData" :options="lineChartOptions" ref="chart"
        style="height: 500px; width: 95vw;" v-if="!isTimeOx && !isAgeOx && !isBarChartSelected" />
      <LineChart id="chart" :chartData="chartData" :options="lineChartOptions" ref="chart"
        style="height: 500px; width: 95vw;" v-if="!isTimeOx && isAgeOx && !isBarChartSelected" />

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

Chart.register(...registerables);
Chart.register(zoomPlugin);
Chart.register(ChartDataLabels);

const { getRegionalData } = useQuery()
const { randomColor } = utilities()

const colorDict = ref([])
const datasets = ref([])
const chart = ref(null)
const labels = ref([])
const yearOptions = ref(['2019-Q1', '2019-Q2', '2019-Q3', '2019-Q4', '2020-Q1', '2020-Q2', '2020-Q3', '2020-Q4', '2021-Q1', '2021-Q2', '2021-Q3', '2021-Q4', '2022-Q1', '2022-Q2', '2022-Q3'])
const yearOption = ref('2020-Q1')
const graphOptions = ref(['LINIAR', 'BARA'])
const graphOption = ref('BARA')
const oxOption = ref('GRUPE VARSTA')
const residencyOptions = ref(['URBAN', 'RURAL'])
const residencyOption = ref('URBAN')
const oxOptions = computed(() => {
  return graphOption.value == 'LINIAR' ? ['NIVELUL EDUCATIEI', 'GRUPE VARSTA', 'TIMP'] : ['NIVELUL EDUCATIEI', 'GRUPE VARSTA']
})
const isBarChartSelected = computed(() => {
  return graphOption.value == 'BARA' ? true : false
})
const isTimeDisabled = computed(() => {
  return graphOption.value == 'LINIAR' && oxOption.value == 'TIMP'
})

const isAgeOx = ref(false)
const isTimeOx = ref(false)

const barChartoptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Studiu angajabilitate medii de rezidenta'
    },
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
        console.log()
        if (context.dataIndex === context.dataset.data.length - 1) {
          return value + " " + context.dataset.label
        } else {
          return value
        }
      }
    },
    title: {
      display: true,
      text: 'Studiu angajabilitate medii de rezidenta'
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
  const total = educationLevels.length * ageGroups.length;
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

async function fetchData() {
  const test = isTimeDisabled.value ? await getRegionalData('', '', 'T', residencyOption.value, 'line') : await getRegionalData(yearOption.value, '', 'T', residencyOption.value, 'barChart');
  if (oxOption.value === 'NIVELUL EDUCATIEI') {
    educationOx(test)
  }
  if (oxOption.value === 'GRUPE VARSTA') {
    ageOx(test)
  }
  if (oxOption.value === 'TIMP') {
    timeOx(test)
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
