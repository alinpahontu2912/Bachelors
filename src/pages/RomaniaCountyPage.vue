<template>
  <div class="fit column wrap content-center">
    <div class="rowContainer row justify-evenly">
      <div class="row col-3 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="yearOption" :label="$t('year')" :options="yearOptions"
          style="width: 250px;" behavior="menu" />
      </div>
      <div class="row col-3 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="sexOption" :label="$t('sex')" :options="sexOptions" style="width: 250px;"
          behavior="menu" />
      </div>
      <div class="row col-3 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="resetZoom">
          {{ $t('reset_zoom') }}
        </q-btn>
      </div>
      <div class="row col-3 q-pa-md content-center justify-evenly">
        <q-btn :disable="!canDownload" class="q-pa-md fit" color="teal" @click="downloadAsPdf">
          <q-icon name="information" v-if="!canDownload">
            <q-tooltip>
              {{ $t('need_download') }}
            </q-tooltip>
          </q-icon>
          {{ $t('download') }}
          <q-tooltip persistent :offset="[10, 10]">
            {{ $t('can_download') }}
          </q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <div class="row justify-evenly"><strong>{{ $t('county_employment_rate') }}</strong></div>
      <BarChart id="chart" :chartData="testData" :options="options" ref="barChart" style="height: 550px; width: 90vw;" />
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
const sexOptions = ref(['M', 'F', 'T'])
const yearOption = ref('2021')
const sexOption = ref('M')


const options = ref({
  plugins: {
    legend: {
      display: false
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
  const response = await getRegionalData(yearOption.value, '', sexOption.value, '', 'barChart');
  labels.value = response[0]
  createDataSets(response[1])
})


function createDataSets(queryResponse) {
  datasets.value.length = 0;
  datasets.value.push({ data: queryResponse })
}

watch(() => yearOption.value, async () => {
  const response = await getRegionalData(yearOption.value, '', sexOption.value, '', 'barChart');
  labels.value = response[0]
  createDataSets(response[1])
})

watch(() => sexOption.value, async () => {
  const response = await getRegionalData(yearOption.value, '', sexOption.value, '', 'barChart');
  labels.value = response[0]
  createDataSets(response[1])
})


function resetZoom() {
  barChart.value.chartInstance.resetZoom()
}

function downloadAsPdf() {
  const exp = new Exporter([document.getElementById("chart")])
  exp.export_pdf().then((pdf) => pdf.save(`CountyEmploymentRate_${sexOption.value}_${yearOption.value}.pdf`));
}

</script>
