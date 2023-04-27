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
          style="width: 250px;" behavior="menu" :multiple="!isBarChartSelected" />
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
      <div class="row col-2 q-pa-md content-center justify-evenly">
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
import { computed, ref, onMounted, watch } from 'vue';
import zoomPlugin from 'chartjs-plugin-zoom';
import useQuery from 'src/compositionFunctions/useQuery';
Chart.register(...registerables);
Chart.register(zoomPlugin);

const { getData } = useQuery()


const datasets = ref([])
const barChart = ref(null)
const labels = ref([])
const yearOptions = ref(['2019-Q1', '2019-Q2', '2019-Q3', '2019-Q4', '2020-Q1', '2020-Q2', '2020-Q3', '2020-Q4', '2021-Q1', '2021-Q2', '2021-Q3', '2021-Q4'])
const yearOption = ref('2020-Q1')
const graphOptions = ref(['LINIAR', 'BARA'])
const graphOption = ref('LINIAR')
const oxOption = ref('NIVELUL EDUCATIEI')
const residencyOptions = ref(['URBAN', 'RURAL'])
const residencyOption = ref()
const oxOptions = computed(() => {
  return graphOption.value == 'LINIAR' ? ['NIVELUL EDUCATIEI', 'GRUPE VARSTA', 'TIMP'] : ['NIVELUL EDUCATIEI', 'GRUPE VARSTA']
})
const isBarChartSelected = computed(() => {
  return graphOption.value == 'BARA' ? true : false
})
const isTimeDisabled = computed(() => {
  return graphOption.value == 'LINIAR' && oxOption.value == 'TIMP'
})


watch(graphOption, () => {
  yearOption.value = null
  oxOption.value = null
  residencyOption.value = null
})



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
  const test = await getData('2020', 'T', '0', '0', 'barChart', 'ROMANIA');
  createDataSets(test)
})


function createDataSets(queryResponse) {
  let maleValues = queryResponse.filter(x => x.sex == 'M').map(x => x.val)
  let femaleValues = queryResponse.filter(x => x.sex == 'F').map(x => x.val)
  labels.value = [...new Set(queryResponse.map(x => x.region))]
  datasets.value.length = 0;
  datasets.value.push({ data: maleValues, label: 'M' })
  datasets.value.push({ data: femaleValues, label: 'F' })

}

async function fetchData() {
  const test = await getData(yearOption.value, 'T', '0', '0', 'barChart', 'ROMANIA');
  createDataSets(test)
}

function resetZoom() {
  barChart.value.chartInstance.resetZoom()
}

</script>
