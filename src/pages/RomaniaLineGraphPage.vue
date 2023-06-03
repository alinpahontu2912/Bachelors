<template>
  <div class="fit column wrap content-center">
    <div class="rowContainer row justify-evenly">
      <div class="row col-4 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="compareOption" :label="$t('evolution')" :options="compareOptions"
          style="width: 350px" behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="resetZoom">{{ $t('reset_zoom') }}</q-btn>
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-btn :disable="!canDownload" class="q-pa-md fit" color="teal" @click="downloadAsPdf">
          {{ $t('download') }}
        </q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <LineChart id="chart" :chartData="testData" :options="options" ref="lineChart"
        style="height: 500px; width: 90vw;" />
    </div>
  </div>
</template>

<script setup>

import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { computed, ref, onMounted, watch } from 'vue';
import zoomPlugin from 'chartjs-plugin-zoom';
import useQuery from 'src/compositionFunctions/useQuery';
import Exporter from "vue-chartjs-exporter";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import utilities from 'src/utils/utilities.js'
import { userStore } from 'src/stores/userStore';
import { useI18n } from 'vue-i18n';

const { randomColor } = utilities()
const { getRegionalData, getAvailableTime } = useQuery()
const { canUserDownload } = userStore()
const { t } = useI18n()

Chart.register(...registerables);
Chart.register(zoomPlugin);
Chart.register(ChartDataLabels);

const canDownload = computed(() => canUserDownload())
const colorDict = ref([])
const datasets = ref([])
const lineChart = ref(null)
const labels = ref([])
const compareOptions = computed(() => [t('men_employment_rate'), t('women_employment_rate'), t('total_employment_rate'), t('sex_difference_employment')])
const sexOptions = ref(['M', 'F', 'T', 'M-F'])
const compareOption = ref(t('total_employment_rate'))
const options = ref({
  layout: {
    padding: {
      right: 80
    }
  },
  plugins: {
    responsive: true,
    maintainAspectRatio: false,
    datalabels: {
      color: 'black',
      anchor: 'end',
      align: 'right',
      color: chart => {
        return chart.dataset.backgroundColor
      },
      formatter: function (value, context) {
        if (context.dataIndex === context.dataset.data.length - 1) {
          return value + " " + context.dataset.label
        } else {
          return value
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

const testData = computed(() => ({
  labels: labels.value,
  datasets: datasets.value
}));



onMounted(async () => {
  for (let i = 0; i < 50; i++) {
    colorDict.value.push('#' + randomColor())
  }
  labels.value = (await getAvailableTime('regional')).sort()
  let sexOption = sexOptions.value[compareOptions.value.indexOf(compareOption.value)]

  const test = await getRegionalData('', '', sexOption, '', 'line');
  createDataSets(test)
})


function createDataSets(queryResponse) {
  const regions = [...new Set(queryResponse.map(x => x.region))]
  datasets.value.length = 0;
  for (let i = 0; i < regions.length; i++) {
    datasets.value.push({ data: queryResponse.filter(x => x.region == regions[i]).map(x => x.val), label: regions[i], hidden: true, backgroundColor: colorDict.value[i], borderColor: colorDict.value[i] })
  }
}

watch(() => compareOption.value, async () => {

  let sexOption = sexOptions.value[compareOptions.value.indexOf(compareOption.value)]
  const response = await getRegionalData('', '', sexOption, '', 'line');
  createDataSets(response)
})


function downloadAsPdf() {
  const exp = new Exporter([document.getElementById("chart")])
  exp.export_pdf().then((pdf) => pdf.save(`CountyEmploymentRate${compareOption.value}.pdf`));
}

function resetZoom() {
  lineChart.value.chartInstance.resetZoom()
}
</script>
