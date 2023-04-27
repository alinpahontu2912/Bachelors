<template>
  <div class="fit column wrap content-center">
    <div class="rowContainer row justify-evenly">
      <div class="row col-4 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="sexOption" label="Sex" :options="sexOptions" style="width: 250px"
          behavior="menu" />
      </div>
      <div class="row col-4 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="resetZoom">Reset Zoom</q-btn>
      </div>
      <div class="row col-4 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="fetchData">
          Reload
        </q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <LineChart :chartData="testData" :options="options" ref="lineChart" style="height: 500px; width: 90vw;" />
    </div>
  </div>
</template>

<script setup>

import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import { computed, ref, onMounted, } from 'vue';
import useQuery from 'src/compositionFunctions/useQuery';
const { getData } = useQuery()

Chart.register(...registerables);
Chart.register(zoomPlugin);

const datasets = ref([])
const lineChart = ref(null)
const labels = ref([])
const sexOptions = ref(['F', 'M'])
const sexOption = ref('M')

const options = ref({
  plugins: {
    title: {
      display: true,
      text: 'Custom Chart Title'
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
  const test = await getData('', 'M', '0', '0', 'line', 'ROMANIA');
  createDataSets(test)

})


function createDataSets(queryResponse) {
  // let maleValues = queryResponse.filter(x => x.sex == 'M').map(x => x.val)
  // let femaleValues = queryResponse.filter(x => x.sex == 'F').map(x => x.val)
  const regions = [...new Set(queryResponse.map(x => x.region))]
  labels.value = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021']
  datasets.value.length = 0;
  for (let i = 0; i < regions.length; i++) {
    datasets.value.push({ data: queryResponse.filter(x => x.sex == 'M' && x.region == regions[i]).map(x => x.val), label: regions[i] + ' M', hidden: true, display: false })
  }
  console.log(datasets.value)
}

async function fetchData() {
  const response = await getData(yearOption.value, null, null, null, 'barChart', 'ROMANIA');
  labels.value = response.map(element => { return element.countryCodeNavigation.name })
  // createDataSets(response)
  console.log(response);
}

function resetZoom() {
  lineChart.value.chartInstance.resetZoom()
}
</script>
