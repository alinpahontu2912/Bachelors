<template>
  <div class=" row items-align content-center align-center">
    <q-card class="fit column wrap justify-start items-start content-start col-11 bg-grey-2" style="height: 600px">
      <q-card-section class="fit row wrap col-11 q-pa-md">
        <div class="rowContainer row col-4 ">
          <div class="q-px-lg">
            <div class="row justify-evenly"><strong>{{ $t('users_by_profession') }}</strong></div>
            <Pie :data="pieData1" ref="test" :options="pie1Options" style="height: 230px;" />
          </div>
        </div>
        <div class="rowContainer row col-4 ">
          <div class="q-px-lg">
            <div class="row justify-evenly"><strong>{{ $t('users_download_rights') }}</strong></div>
            <Pie :data="pieData2" ref="test" :options="pie2Options" style="height: 230px;" />
          </div>
        </div>
        <div class="rowContainer row col-4 items-center justify-center content-center">
          <q-list class="rowContainer row col-12 ">
            <q-item class="col-12 items-center justify-center content-center"><strong>{{ $t('total_users') }} {{
              stats.totalUsers
            }}</strong></q-item>
            <q-item class="col-12 items-center justify-center content-center"><strong>{{ $t('total_requests') }} {{
              stats.totalRequests
            }} {{ $t('out_of_which') }} {{ stats.unansweredRequests }} {{ $t('unanswered') }}</strong></q-item>
            <q-item class="col-12 items-center justify-center content-center"><strong>{{ $t('total_messages') }} {{
              stats.totalFeedback
            }} {{ $t('out_of_which') }} {{ stats.unansweredMessages }} {{ $t('unanswered') }}</strong></q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-card-section class="fit row q-pa-md">
        <div class="q-px-md">
          <div class="row justify-evenly"><strong>{{ $t('new_users') }}</strong></div>
          <BarChart :chartData="barData" :options="options" ref="barChart" style="height: 300px; width: 90vw;" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend, registerables } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { BarChart } from 'vue-chart-3';
import { ref, computed, onMounted } from 'vue';
import useQuery from 'src/compositionFunctions/useQuery';
import { useI18n } from 'vue-i18n';

ChartJS.register(ArcElement, Tooltip, Legend, ...registerables)
const { getAdminStats, getNewUserStats } = useQuery()

const stats = ref({})

const jobs = ref([])
const permissionJobs = ref([])
const { t } = useI18n()

const pieLabels1 = computed(() => jobs.value.map(job => { return t(job) }))
const pieDatasets1 = ref([])

const pieLabels2 = computed(() => permissionJobs.value.map(job => { return t(job) }))
const pieDatasets2 = ref([])

const barLabels = ref([])
const barDatasets = ref([])

const pie1Options = ref({})
const pie2Options = ref({})

const pieData1 = computed(() => ({
  labels: pieLabels1.value,
  datasets: pieDatasets1.value
}));

const pieData2 = computed(() => ({
  labels: pieLabels2.value,
  datasets: pieDatasets2.value
}));

const barData = computed(() => ({
  labels: barLabels.value,
  datasets: barDatasets.value
}));

const options = ref({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    },
  }
})

onMounted(async () => {
  const adminStats = await getAdminStats()
  jobs.value = Object.keys(adminStats['jobs'])
  pieDatasets1.value = [createPieDataSet(Object.values(adminStats['jobs']))]

  permissionJobs.value = Object.keys(adminStats['permissionJobs'])
  pieDatasets2.value = [createPieDataSet(Object.values(adminStats['permissionJobs']))]

  const newUsersData = await getNewUserStats()
  barLabels.value = Object.keys(newUsersData).map(x => new Date(x).toLocaleDateString("en-US"))
  barDatasets.value = createBarDataSet(Object.values(newUsersData))
  stats.value = {
    totalUsers: adminStats['stats']['totalusers'],
    totalFeedback: adminStats['stats']['totalFeedback'],
    totalRequests: adminStats['stats']['totalrequests'],
    unansweredMessages: adminStats['stats']['unansweredMessages'],
    unansweredRequests: adminStats['stats']['unansweredRequests']
  }
})

function createPieDataSet(data) {
  return {
    data: data,
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
  }
}

function createBarDataSet(data) {
  return [{
    label: 'NEW USERS',
    data: data,
  }]
}

</script>
<style>
.columnContainer {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.rowContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.item-small {
  flex-grow: 1;
}

.item-medium {
  flex-grow: 3;

}
</style>
