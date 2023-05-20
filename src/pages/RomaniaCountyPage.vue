<template>
  <div class="fit column wrap content-center">
    <div class="rowContainer row justify-evenly">
      <div class="row col-3 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="yearOption" label="Year Quarter" :options="yearOptions"
          style="width: 250px;" behavior="menu" />
      </div>
      <div class="row col-3 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="resetZoom">
          Reset Zoom
        </q-btn>
      </div>
      <div class="row col-3 q-pa-md content-center justify-evenly">
        <q-btn :disable="!canDownload" class="q-pa-md fit" color="teal" @click="downloadAsPdf">
          Download
        </q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <BarChart id="chart" :chartData="testData" :options="options" ref="barChart" style="height: 500px; width: 90vw;" />
    </div>
  </div>
</template>

<script setup>

import { BarChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { computed, ref, onMounted, watch, } from 'vue';
import zoomPlugin from 'chartjs-plugin-zoom';
import useQuery from 'src/compositionFunctions/useQuery';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Exporter from "vue-chartjs-exporter";
import { userStore } from 'src/stores/userStore';

Chart.register(...registerables);
Chart.register(zoomPlugin);
Chart.register(ChartDataLabels);

const { getRegionalData, getAvailableTime } = useQuery()
const { canUserDownload } = userStore()

const canDownload = computed(() => canUserDownload())
const datasets = ref([])
const barChart = ref(null)
const labels = ref([])
const yearOptions = ref([])
const yearOption = ref('2020')

const options = ref({
  plugins: {
    title: {
      display: true,
      text: 'Rata de Angajare pe Judete'
    },
    datalabels: {
      color: 'black',
      anchor: 'start',
      rotation: '-90',
      align: 'end'
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
  yearOptions.value = (await getAvailableTime('regional')).sort()
  yearOption.value = yearOptions.value[yearOptions.value.length - 1]
  const response = await getRegionalData(yearOption.value, '', '', '', 'barChart');
  createDataSets(response)
})


function createDataSets(queryResponse) {
  datasets.value.length = 0;
  labels.value = [...Object.keys(queryResponse)]
  let maleValues = [], femaleValues = [], total = [];
  for (let i = 0; i < labels.value.length; i++) {
    maleValues.push(queryResponse[labels.value[i]]['M'])
    femaleValues.push(queryResponse[labels.value[i]]['F'])
    total.push(queryResponse[labels.value[i]]['T'])
  }
  datasets.value.push({ data: maleValues, label: 'M', hidden: true })
  datasets.value.push({ data: femaleValues, label: 'F', hidden: true })
  datasets.value.push({ data: total, label: 'T', hidden: false })
}

watch(() => yearOption.value, async () => {
  const response = await getRegionalData(yearOption.value, '', '', '', 'barChart');
  createDataSets(response)
})

function resetZoom() {
  barChart.value.chartInstance.resetZoom()
}

function downloadAsPdf() {
  const exp = new Exporter([document.getElementById("chart")])
  exp.export_pdf().then((pdf) => pdf.save(`CountyEmploymentRate${yearOption.value}.pdf`));
}


</script>
