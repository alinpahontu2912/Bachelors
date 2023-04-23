<template>
  <div class=" row items-align content-center align-center">
    <q-card class="fit column wrap justify-start items-start content-start col-11 bg-grey-2" style="height: 600px">
      <q-card-section class="fit row wrap col-11 q-pa-md">
        <div class="rowContainer row col-6 ">
          <div>
            <Pie :data="pieData" ref="test" style="height: 200px;" />
          </div>
        </div>
        <div class="rowContainer row col-6 items-center justify-center content-center">
          <q-list class="rowContainer row col-12 ">
            <q-item class="col-12 items-center justify-center content-center">Total Users: {{ stats.totalUsers }}</q-item>
            <q-item class="col-12 items-center justify-center content-center">Total Requests: {{ stats.totalRequsts
            }}</q-item>
            <q-item class="col-12 items-center justify-center content-center">Total Feedback: {{ stats.totalFeedback
            }}</q-item>
            <q-item class="col-12 items-center justify-center content-center"><q-btn>
                Create Announcement
              </q-btn></q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-card-section class="fit row q-pa-md">
        <div class="q-px-md">
          <BarChart :chartData="barData" :options="options" ref="barChart" style="height: 400px; width: 90vw;" />
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

ChartJS.register(ArcElement, Tooltip, Legend, ...registerables)
const { getAdminStats, getNewUserStats } = useQuery()

const stats = ref({ totalUsers: 0, totalFeedback: 0, totalRequsts: 0 })

const pieLabels = ref([])
const pieDatasets = ref([])
const barLabels = ref([])
const barDatasets = ref([])

const pieData = computed(() => ({
  labels: pieLabels.value,
  datasets: pieDatasets.value
}));

const barData = computed(() => ({
  labels: barLabels.value,
  datasets: barDatasets.value
}));

const options = ref({
  responsive: true,
  maintainAspectRatio: true,
})


onMounted(async () => {
  const adminStats = await getAdminStats()
  pieLabels.value = Object.keys(adminStats['jobs'])
  pieDatasets.value = [createPieDataSet(Object.values(adminStats['jobs']))]
  const newUsersData = await getNewUserStats()
  barLabels.value = Object.keys(newUsersData).map(x => new Date(x).toLocaleDateString("en-US"))
  console.log(barLabels.value)
  barDatasets.value = createBarDataSet(Object.values(newUsersData))
  stats.value = { totalUsers: adminStats['stats']['totalusers'], totalFeedback: adminStats['stats']['totalFeedback'], totalRequsts: adminStats['stats']['totalrequests'] }

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
    label: 'New Users',
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
