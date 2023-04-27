<template>
  <div class="fit column wrap content-center">
    <div class="rowContainer row ">
      <div class="row col-3 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="sexOption" label="Sex" :options="sexOptions" style="width: 250px"
          behavior="menu" />
      </div>
      <div class="row col-3 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="ageOption" label="Age" :options="ageOptions" style="width: 250px"
          behavior="menu" />
      </div>
      <div class="row col-3 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="educationOption" label="Education" :options="educatonOptions"
          style="width: 250px" behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="resetZoom" :loading="loading">
          Reset Zoom
        </q-btn>
      </div>
      <div class="row col-1 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="fetchData" :loading="loading">
          Reload
        </q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <LineChart :chartData="testData" :options="options" ref="lineChart" style="width: 90vw;" />
    </div>
  </div>
</template>

<script setup>

import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import { computed, ref, onMounted } from 'vue';
import useQuery from 'src/compositionFunctions/useQuery';
import { colorDict } from 'src/utils/CountryColours'
import Test from 'src/utils/Test';

Chart.register(...registerables);
Chart.register(zoomPlugin);

const { getData } = useQuery()
const { getNextPoint } = Test()
const sexOptions = ref(['T'])
const ageOptions = ref(['Y15-24'])
const educatonOptions = ref(['0-2'])
const ageOption = ref('Y15-24')
const sexOption = ref('T')
const educationOption = ref('0-2')

const labels = ref([])
const datasets = ref([])
const lineChart = ref(null)
const options = ref({
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
  const test = await getData('', 'T', 1, 1, 'line');
  createDataSets(Object.keys(test), Object.values(test))
  console.log(testData.value)
  console.log(Object.keys(test)[1])
  console.log(Object.values(test)[1])
})

function createDataSets(countries, data, color) {
  console.log(data)
  datasets.value.length = 0;
  for (let i = 0; i < data.length; i++) {
    datasets.value.push({
      label: countries[i],
      data: data[i].map(element => { return { x: element.key, y: element.value } }),
      hidden: true,
      // backgroundColor: colorDict[element.countryCode] ? colorDict[element.countryCode] : '#A5C8ED'
    })
  }
}

function resetZoom() {
  lineChart.value.chartInstance.resetZoom()
}


</script>
