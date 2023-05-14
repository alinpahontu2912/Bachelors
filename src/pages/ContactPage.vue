<template>
  <div class="rowContainer row ">
    <div class="row col-4 q-pa-md content-center justify-evenly">
      <q-select color="teal" filled v-model="dateOption" label="Sort By Date" :options="dateOptions" style="width: 250px"
        behavior="menu" />
    </div>
    <div class="row col-4 q-pa-md content-center justify-evenly">
      <q-select color="teal" filled v-model="statusOption" label="Sort By Status" :options="statusOptions"
        style="width: 250px" behavior="menu" />
    </div>
  </div>
  <q-infinite-scroll @load="onLoad" :offset="250" ref="scroll">
    <div class="row fit ">
      <MessageTile v-for="(item, index) in items" :key="index" :message="item" />
    </div>
    <template v-slot:loading v-if="awaitData">
      <div class="row justify-center q-my-md">
        <q-spinner-dots color="teal" size="80px" />
      </div>
    </template>
  </q-infinite-scroll>
</template>
<script setup>
import MessageTile from 'src/components/MessageTile.vue';
import { ref, watch } from 'vue'
import useQuery from 'src/compositionFunctions/useQuery';

const { getAllMessages } = useQuery()
const dateOptions = ref(['ASC', 'DESC'])
const dateOption = ref('DESC')
const statusOptions = ref(['ALL', 'REPLIED', 'NOT REPLIED'])
const statusOption = ref('ALL')
const items = ref([])
const scroll = ref(null)
const awaitData = ref(false)

async function reloadData() {
  items.value.length = 0
  scroll.value.reset()
  scroll.value.trigger()
}

function getStatusId() {
  switch (statusOption.value) {
    case 'ALL':
      return -1
    case 'REPLIED':
      return 1
    case 'NOT REPLIED':
      return 0
  }
}

watch(() => dateOption.value, async () => {
  await reloadData();
})

watch(() => statusOption.value, async () => {
  await reloadData();
})


async function onLoad(index, done) {
  const newEntries = await getAllMessages(index, dateOption.value, getStatusId(statusOption.value), done, items.value)
  awaitData.value = newEntries > 0 ? true : false
}


</script>
<style >
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
