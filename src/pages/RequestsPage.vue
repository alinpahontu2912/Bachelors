<template>
  <div class="rowContainer row ">
    <div class="row col-4 q-pa-md content-center justify-evenly">
      <q-select color="teal" filled v-model="dateOption" :label="$t('sort_by_date')" :options="dateOptions"
        style="width: 250px" behavior="menu" />
    </div>
    <div class="row col-4 q-pa-md content-center justify-evenly">
      <q-select color="teal" filled v-model="statusOption" :label="$t('sort_by_status')" :options="statusOptions"
        style="width: 250px" behavior="menu" />
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
  <SuccessDialog text="requestSolved" />
  <ErrorDialog text="requestNotSolved" />
</template>
<script setup>
import ErrorDialog from 'src/components/ErrorDialog.vue';
import SuccessDialog from 'src/components/SuccessDialog.vue';
import RequestTile from 'src/components/RequestTile.vue';
import useQuery from 'src/compositionFunctions/useQuery';
import utilities from 'src/utils/utilities.js'
import { ref, watch, inject } from 'vue'
import { EVENT_KEYS } from 'src/utils/eventKeys';

const { getAllRequests } = useQuery()
const { getStatusId } = utilities()

const dateOptions = ref(['ASC', 'DESC'])
const dateOption = ref('DESC')
const statusOptions = ref(['ALL', 'ACCEPTED', 'REJECTED', 'PROCESSING'])
const statusOption = ref('ALL')
const items = ref([])
const scroll = ref(null)
const awaitData = ref(false)
const bus = inject('bus')

async function reloadData() {
  items.value.length = 0
  scroll.value.reset()
  scroll.value.trigger()
}

watch(() => dateOption.value, async () => {
  await reloadData();
})

watch(() => statusOption.value, async () => {
  await reloadData();
})

bus.on(EVENT_KEYS.SUCCESS, async (data) => {
  await reloadData();
})

bus.on(EVENT_KEYS.ERROR, async (data) => {
  await reloadData();
})

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
