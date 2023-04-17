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
        <AnnouncementTile v-for="(item, index) in items" :key="index" :announcement="item" />
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
import { ref } from 'vue'
import AnnouncementTile from 'src/components/AnnouncementTile.vue';
import useQuery from 'src/compositionFunctions/useQuery';

const { getAllAnnouncements } = useQuery()
const items = ref([])
const loading = ref(false)
const awaitData = ref(false)
const dateOptions = ref(['ASC', 'DESC'])
const dateOption = ref('DESC')
const statusOptions = ref(['ALL', 'MAJOR', 'MINOR', 'MAINTENANCE'])
const statusOption = ref('ALL')
const scroll = ref(null)

function getTypeId() {
  switch (statusOption.value) {
    case 'ALL':
      return 0
    case 'MAJOR':
      return 1
    case 'MINOR':
      return 2
    case 'MAINTENANCE':
      return 3
  }
}

async function onLoad(index, done) {
  const newEntries = await getAllAnnouncements(index, dateOption.value, getTypeId(statusOption.value), done, items.value)
  awaitData.value = newEntries > 0 ? true : false
}

async function reloadData() {
  items.value.length = 0
  scroll.value.reset()
  scroll.value.trigger()
}

</script>
