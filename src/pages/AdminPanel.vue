<template>
  <div class=" row items-align content-center align-center">
    <q-card class="fit column wrap justify-start items-start content-start col-11 bg-grey-2" style="height: 600px">
      <q-card-section class="fit row wrap justify-start items-start content-start col-11 q-pa-md">
        <div class="rowContainer row col-6 ">
          <div>
            <Doughnut :data="data" :options="options" ref="test" v-if="!click" style="height: 200px;" />
          </div>
        </div>
        <div class="rowContainer row col-6">
          <q-list class="rowContainer row col-12">
            <q-item class="col-12">Test1</q-item>
            <q-item class="col-12">Test1</q-item>
            <q-item class="col-12">Test1</q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-separator class="fit row wrap" style="width: 10px;" />
      <q-card-section class="fit row wrap justify-start items-start content-start col-11 q-pa-md bg-red"
        style="height: 200px;">
        <div class="row justify-center items-center content-center col-12" style="height: 400px;">
          <div class="col-3 column">
            <div class="col-12 column justify-center items-center content-center">
              <div>New Users</div>
              <q-btn>Get Data</q-btn>
            </div>
          </div>
          <div class="col-9 column justify-center items-center content-center">Graps</div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { ref, computed } from 'vue';
ChartJS.register(ArcElement, Tooltip, Legend)

const test = ref(null)
const click = ref(false)
const ceva = ref([40, 50, 20, 80])
const reactiveData = ref({
  labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [2, 4, 5]
    }
  ]
})


const data = computed(() => {
  return reactiveData.value
})

const options = ref({
  responsive: true,
  maintainAspectRatio: false
})

function updateData() {
  reactiveData.value.datasets[0].data.value = [10, 30, 40, 90]
  //test.value.update()

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
<!-- <template>
  <q-btn @click="updateData">Test</q-btn>
  <div>
    <Doughnut :data="data" :options="options" ref="test" v-if="!click" />
  </div>
</template>

<script setup>


</script> -->
