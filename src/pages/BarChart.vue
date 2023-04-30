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
        <q-btn class="q-pa-md fit" color="teal" @click="resetZoom">
          Reset Zoom
        </q-btn>
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="fetchData">
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
import { computed, ref, onMounted, } from 'vue';
import zoomPlugin from 'chartjs-plugin-zoom';
import useQuery from 'src/compositionFunctions/useQuery';
import utilities from 'src/utils/utilities.js'
Chart.register(...registerables);
Chart.register(zoomPlugin);

const { getEuropeanData } = useQuery()
const { getAgeId, getEducationId, generateYearQuarters } = utilities()
const datasets = ref([])
const barChart = ref(null)
const labels = ref([])
const sexOptions = ref(['T'])
const ageOptions = ref(['15-24'])
const educatonOptions = ref(['0-2'])
const yearOptions = ref([])
const yearOption = ref('2020-Q4')
const ageOption = ref('15-24')
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
  const response = await getEuropeanData(yearOption.value, sexOption.value, getAgeId(ageOption.value), getEducationId(educationOption.value), 'barChart');
  labels.value = response[0]
  createDataSets(response[1])
  yearOptions.value.push(...generateYearQuarters(2020, 2021))
})


function createDataSets(queryResponse) {
  datasets.value.length = 0;
  datasets.value.push({ data: queryResponse, label: 'Employment rate' })
  console.log(datasets.value)
}

async function fetchData() {
  const response = await getEuropeanData(yearOption.value, sexOption.value, getAgeId(ageOption.value), getEducationId(educationOption.value), 'barChart');
  labels.value = response[0]
  createDataSets(response[1])
}

function resetZoom() {
  barChart.value.chartInstance.resetZoom()
}

</script>
