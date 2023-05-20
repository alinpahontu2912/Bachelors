<template>
  <div class="fit column wrap content-center">
    <div class="rowContainer row ">
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="sexOption" label="Sex" :options="sexOptions" style="width: 250px"
          behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="ageOption" label="Age" :options="ageOptions" style="width: 250px"
          behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="educationOption" label="Education" :options="educatonOptions"
          style="width: 250px" behavior="menu" />
      </div>
      <div class="row col-3 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="resetZoom">
          Reset Zoom
        </q-btn>
      </div>
      <div class="row col-3 q-pa-md content-center justify-evenly">
        <q-btn :disable="!canDownload" class="q-pa-md fit" color="teal" @click="downlaodAsPdf">
          Download
        </q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <LineChart id="chart" :chartData="testData" :options="options" ref="lineChart"
        style="width: 90vw; height: 500px;" />
    </div>
  </div>
</template>

<script setup>

import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { computed, ref, onMounted, watch } from 'vue';
import zoomPlugin from 'chartjs-plugin-zoom';
import useQuery from 'src/compositionFunctions/useQuery';
import Exporter from "vue-chartjs-exporter";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import utilities from 'src/utils/utilities.js'
import { userStore } from 'src/stores/userStore';

Chart.register(...registerables);
Chart.register(zoomPlugin);
Chart.register(ChartDataLabels);

const { getEuropeanData } = useQuery()
const { randomColor, getAgeId, getEducationId } = utilities()
const { canUserDownload } = userStore()

const canDownload = computed(() => canUserDownload())
const sexOptions = ref(['T'])
const ageOptions = ref(['15-24'])
const educatonOptions = ref(['0-2'])
const ageOption = ref('15-24')
const sexOption = ref('T')
const educationOption = ref('0-2')
const colorDict = ref([])
const datasets = ref([])
const lineChart = ref(null)
const options = ref({
  layout: {
    padding: {
      right: 100,
      left: 100
    }
  },
  spanGaps: true,
  scales: {
    x: {
      ticks: {
        autoSkip: true,
        maxTicksLimit: 8
      }
    }
  },

  parsing: {
    xAxisKey: 'x',
    yAxisKey: 'y',
    parsing: false
  },
  plugins: {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Employment Rate EU'
    },
    datalabels: {
      color: 'black',
      anchor: 'end',
      align: 'right',
      color: chart => {
        return chart.dataset.backgroundColor
      },
      formatter: function (value, context) {
        console.log(context)
        if (context.dataIndex === context.dataset.data.length - 1) {
          return value.y + " " + context.dataset.label
        } else {
          return value.y
        }
      }
    },
    legend: {
      display: true
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
  }
})
const testData = computed(() => ({
  labels: ['2020-Q1', '2020-Q2', '2020-Q3', '2020-Q4'],
  datasets: datasets.value
}));

onMounted(async () => {
  for (let i = 0; i < 50; i++) {
    colorDict.value.push('#' + randomColor())
  }
  const response = await getEuropeanData('', '', sexOption.value, 1, 1, 'line');
  createDataSets(Object.keys(response), Object.values(response))
})

function createDataSets(countries, data) {
  datasets.value.length = 0;
  for (let i = 0; i < data.length; i++) {
    datasets.value.push({
      label: countries[i],
      data: data[i].map(element => { return { x: element.key, y: element.value } }),
      backgroundColor: colorDict.value[i],
      borderColor: colorDict.value[i],
      hidden: true,
    })
  }
}

function resetZoom() {
  lineChart.value.chartInstance.resetZoom()
}

async function fetchData() {
  const response = await getEuropeanData('', '', sexOption.value, getAgeId(ageOption.value), getEducationId(educationOption.value), 'line');
  createDataSets(Object.keys(response), Object.values(response))
}

function downlaodAsPdf() {
  const exp = new Exporter([document.getElementById("chart")])
  exp.export_pdf().then((pdf) => pdf.save("EuEmploymentRate.pdf"));
}

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
