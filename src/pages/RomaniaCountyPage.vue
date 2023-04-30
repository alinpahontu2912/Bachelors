<template>
  <div class="fit column wrap content-center">
    <div class="rowContainer row justify-evenly">
      <div class="row col-4 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="yearOption" label="Year Quarter" :options="yearOptions"
          style="width: 250px;" behavior="menu" />
      </div>
      <div class="row col-4 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="resetZoom">
          Reset Zoom
        </q-btn>
      </div>
      <div class="row col-4 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="fetchData">
          Reload
        </q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <BarChart :chartData="testData" :options="options" ref="barChart" style="height: 500px; width: 90vw;" />
    </div>
  </div>
</template>

<script setup>

import { BarChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { computed, ref, onMounted, } from 'vue';
import zoomPlugin from 'chartjs-plugin-zoom';
import useQuery from 'src/compositionFunctions/useQuery';
Chart.register(...registerables);
Chart.register(zoomPlugin);

const { getRegionalData } = useQuery()


const datasets = ref([])
const barChart = ref(null)
const labels = ref([])
const yearOptions = ref([])
const yearOption = ref('2020')

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
  for (let i = 2010; i <= 2021; i++) {
    yearOptions.value.push((i).toString())
  }
  const test = await getRegionalData('2021', 'T', '', 'barChart');
  createDataSets(test)
})


function createDataSets(queryResponse) {
  let maleValues = queryResponse.filter(x => x.sex == 'M').map(x => x.val)
  let femaleValues = queryResponse.filter(x => x.sex == 'F').map(x => x.val)
  labels.value = [...new Set(queryResponse.map(x => x.region))]
  datasets.value.length = 0;
  datasets.value.push({ data: maleValues, label: 'M' })
  datasets.value.push({ data: femaleValues, label: 'F' })
  console.log(testData.value)
}

async function fetchData() {
  const test = await getRegionalData(yearOption.value, 'T', '', 'barChart');
  createDataSets(test)
}

function resetZoom() {
  barChart.value.chartInstance.resetZoom()
}

</script>
