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
        <q-btn-dropdown color="teal" filled label="Extra Filters" behavior="menu">
          <q-list>
            <q-item>
              <q-select color="tal" label="Axa OX" :options="[1, 2, 3, 4, 5]" style="width: 250px;" behavior="menu"
                multiple />
            </q-item>

            <q-item>
              <q-select color="tal" filled v-model="oxOption" label="Axa OX" :options="oxOptions" style="width: 250px;"
                behavior="menu" />
            </q-item>
          </q-list>
        </q-btn-dropdown>
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
      <BarChart :chartData="chartData" :options="options" ref="barChart" style="height: 500px; width: 90vw;"
        v-if="!isAgeOx" />
      <BarChart :chartData="chartData" :options="options" ref="barChart" style="height: 500px; width: 90vw;" v-else />
      <!-- <LineChart :chartData="testData" :options="options" ref="lineChart" style="height: 500px; width: 90vw;" /> -->
    </div>
  </div>
</template>

<script setup>

import { BarChart, LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { computed, ref, onMounted, watch } from 'vue';
import zoomPlugin from 'chartjs-plugin-zoom';
import useQuery from 'src/compositionFunctions/useQuery';
Chart.register(...registerables);
Chart.register(zoomPlugin);
const { getRegionalData } = useQuery()

const datasets = ref([])
const barChart = ref(null)
const labels = ref([])
const yearOptions = ref(['2019-Q1', '2019-Q2', '2019-Q3', '2019-Q4', '2020-Q1', '2020-Q2', '2020-Q3', '2020-Q4', '2021-Q1', '2021-Q2', '2021-Q3', '2021-Q4'])
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


const chartData = computed(() => ({
  labels: labels.value,
  datasets: datasets.value
}));



onMounted(async () => {
  const test = await getRegionalData(yearOption.value, 'T', residencyOption.value, 'barChart');
  if (graphOption.value === 'BARA' && oxOption.value === 'NIVELUL EDUCATIEI') {
    educationOxBarchart(test)
  }
  if (graphOption.value === 'BARA' && oxOption.value === 'GRUPE VARSTA') {
    ageOxBarchart(test)
  }
  console.log(chartData.value)
})


function educationOxBarchart(queryResponse) {
  while (labels.value.length) {

    labels.value.pop()
    console.log(labels.value)
  }
  datasets.value.length = 0
  labels.value = Array.from([...new Set(queryResponse.map(x => x.educationNavigation.educationLevel))])
  const ageValues = [...new Set(queryResponse.map(x => x.ageNavigation.age))]
  for (let i = 0; i < ageValues.length; i++) {
    datasets.value.push({ data: queryResponse.filter(x => x.ageNavigation.age === ageValues[i]).map(x => x.val), label: ageValues[i] })
  }
  isAgeOx.value = false
}

function ageOxBarchart(queryResponse) {

  while (labels.value.length) {

    labels.value.pop()
    console.log(labels.value)
  }
  datasets.value.length = 0
  labels.value = Array.from([...new Set(queryResponse.map(x => x.ageNavigation.age))])
  const educationLevels = [...new Set(queryResponse.map(x => x.educationNavigation.educationLevel))]
  for (let i = 0; i < educationLevels.length; i++) {
    datasets.value.push({ data: queryResponse.filter(x => x.educationNavigation.educationLevel === educationLevels[i]).map(x => x.val), label: educationLevels[i] })
  }
  isAgeOx.value = true
}

async function fetchData() {
  const test = await await getRegionalData(yearOption.value, 'T', residencyOption.value, 'barChart');
  if (graphOption.value === 'BARA' && oxOption.value === 'NIVELUL EDUCATIEI') {
    educationOxBarchart(test)
  }
  if (graphOption.value === 'BARA' && oxOption.value === 'GRUPE VARSTA') {
    ageOxBarchart(test)
  }
  console.log(chartData.value)
}

function resetZoom() {
  barChart.value.chartInstance.resetZoom()
}

</script>
