<template>
  <div class="fit column wrap content-center">
    <div class="rowContainer row ">
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="yearOption" label="Year Quarter" :options="yearOptions"
          style="width: 250px" behavior="menu" />
      </div>
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
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="resetZoom" :loading="loading">
          Reset Zoom
        </q-btn>
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="fetchData" :loading="loading">
          Reload
        </q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <BarChart :chartData="testData" :options="options" ref="barChart" style="height: 550px;" />
    </div>
  </div>
</template>

<script setup>

import { BarChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import { computed, ref, onMounted, } from 'vue';
import useQuery from 'src/compositionFunctions/useQuery';
import { colorDict } from 'src/utils/CountryColours'
const { getEuropeanData } = useQuery()

Chart.register(...registerables);
Chart.register(zoomPlugin);

const datasets = ref([])
const barChart = ref(null)
const labels = ref([])
const sexOptions = ref(['T'])
const ageOptions = ref(['Y15-24'])
const educatonOptions = ref(['0-2'])
const yearOptions = ref([])
const yearOption = ref('2020-Q4')
const ageOption = ref('Y15-24')
const sexOption = ref('T')
const educationOption = ref('0-2')

const options = ref({
  plugins: {
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
  const test = await getEuropeanData('2020-Q4', 'T', 1, 1, 'barChart');
  labels.value = test.map(element => { return element.countryCodeNavigation.name })
  createDataSets(test)
  yearOptions.value.push(...generateYearQuarters(2020, 2021))
})


function createDataSets(queryResponse) {
  datasets.value.length = 0;
  let data = []
  let colors = []
  queryResponse.forEach(element => {
    data.push(element.val)
    console.log(element.countryCodeNavigation.name)
    colors.push(colorDict[element.countryCodeNavigation.name] ? colorDict[element.countryCodeNavigation.name] : '#A5C8ED')
  })
  datasets.value.push({ data: data, label: 'Employment rate', backgroundColor: colors })//backgroundColor: backgroundColors })
  console.log(datasets.value)
}

async function fetchData() {
  const response = await getEuropeanData(yearOption.value, sexOption.value, getAgeId(ageOption.value), getEducationId(educationOption.value), 'barChart');
  labels.value = response.map(element => { return element.countryCodeNavigation.name })
  createDataSets(response)
}

function getAgeId(age) {
  switch (age) {
    case 'Y15-24':
      return 1
    case 'Y25-54':
      return 2
    default:
      return 3
  }
}

function getEducationId(education) {
  switch (education) {
    case '0-2':
      return 1
    case '3-4':
      return 2
    default:
      return 3
  }
}

function resetZoom() {
  barChart.value.chartInstance.resetZoom()
}

function generateYearQuarters(start, end) {
  let result = []
  for (let i = 0; i < end - start; i++) {
    for (let j = 1; j <= 4; j++) {
      result.push(start + i + "-Q" + j)
    }
  }
  return (result)
}

</script>
