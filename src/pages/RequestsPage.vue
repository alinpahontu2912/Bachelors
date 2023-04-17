<template>
  <div class="q-pa-md">
    <div class="rowContainer row ">
      <div class="row col-4 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="dateOption" label="Sort By Date" :options="dateOptions"
          style="width: 250px" behavior="menu" />
      </div>
      <div class="row col-4 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="statusOption" label="Sort By Status" :options="statusOptions"
          style="width: 250px" behavior="menu" />
      </div>
      <div class="row col-4 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md" color="teal" @click="reloadData" :loading="loading">
          Reload
        </q-btn>
      </div>
    </div>
    <q-infinite-scroll @load="onLoad" :offset="250" ref="scroll">
      <div class="row fit ">
        <RequestTile v-for="(item, index) in items" :key="index" :request="item" />
      </div>
      <template v-slot:loading v-if="awaitData">
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="teal" size="80px" />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>
<script setup>
import RequestTile from 'src/components/RequestTile.vue';
import { onMounted, ref } from 'vue'
import useQuery from 'src/compositionFunctions/useQuery';

const { getAllRequests } = useQuery()
const dateOptions = ref(['ASC', 'DESC'])
const dateOption = ref('DESC')
const statusOptions = ref(['ALL', 'ACCEPTED', 'REJECTED', 'PROCESSING'])
const statusOption = ref('ALL')
const items = ref([])
const loading = ref(false)
const scroll = ref(null)
const awaitData = ref(false)

function getStatusId() {
  switch (statusOption.value) {
    case 'ALL':
      return 0
    case 'PROCESSING':
      return 1
    case 'ACCEPTED':
      return 2
    case 'REJECTED':
      return 3
  }
}

async function reloadData() {
  items.value.length = 0
  scroll.value.reset()
  scroll.value.trigger()
}

async function onLoad(index, done) {
  const newEntries = await getAllRequests(index, dateOption.value, getStatusId(statusOption.value), done, items.value)
  awaitData.value = newEntries > 0 ? true : false
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
