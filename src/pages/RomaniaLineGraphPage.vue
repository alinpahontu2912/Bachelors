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
      <LineChart id="test" :chartData="testData" :options="options" ref="lineChart" style="height: 500px; width: 90vw;" />
    </div>
  </div>
</template>

<script setup>

import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { computed, ref, onMounted, } from 'vue';
import zoomPlugin from 'chartjs-plugin-zoom';
import useQuery from 'src/compositionFunctions/useQuery';
import Exporter from "vue-chartjs-exporter";
import ChartDataLabels from 'chartjs-plugin-datalabels';
const { getRegionalData } = useQuery()
Chart.register(...registerables);
Chart.register(zoomPlugin);
Chart.register(ChartDataLabels);

const colorDict = ref([])
const datasets = ref([])
const lineChart = ref(null)
const labels = ref([])
const sexOptions = ref(['F', 'M'])
const sexOption = ref('M')
const test = ref(true)
const options = ref({
  layout: {
    padding: {
      right: 80
    }
  },
  plugins: {
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Custom Chart Title'
    },
    datalabels: {
      color: 'black',
      anchor: 'end',
      align: 'right',
      color: chart => {
        return chart.dataset.backgroundColor
      },
      formatter: function (value, context) {
        if (test.value) {
          if (context.dataIndex === context.dataset.data.length - 1) {
            return context.dataset.label
          } else {
            return ''
          }
        }
        else {
          if (context.dataIndex === context.dataset.data.length - 1) {
            return context.dataset.label
          }
        }
      }
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pan: {
          enabled: true,
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


const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

const testData = computed(() => ({
  labels: labels.value,
  datasets: datasets.value
}));



onMounted(async () => {
  for (let i = 0; i < 50; i++) {
    colorDict.value.push('#' + randomColor())
  }
  const test = await getRegionalData('', sexOption.value, '', 'line');
  createDataSets(test)
})


function createDataSets(queryResponse) {
  const regions = [...new Set(queryResponse.map(x => x.region))]
  labels.value = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021']
  datasets.value.length = 0;
  for (let i = 0; i < regions.length; i++) {

    datasets.value.push({ data: queryResponse.filter(x => x.region == regions[i]).map(x => x.val), label: regions[i], hidden: true, backgroundColor: colorDict.value[i], borderColor: colorDict.value[i] })
  }
}

async function fetchData() {
  test.value = !test.value
  lineChart.value.chartInstance.update()
  const exp = new Exporter([document.getElementById("test")])
  exp.export_pdf().then((pdf) => pdf.save("test.pdf"));

  // const response = await getRegionalData('', sexOption.value, '', 'line');
  // createDataSets(response)
}

function resetZoom() {
  lineChart.value.chartInstance.resetZoom()
}
</script>
