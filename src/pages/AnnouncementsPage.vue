<template>
  <div class="q-pa-md">
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
const awaitData = ref(false)
const dateOption = ref('DESC')
const statusOption = ref('ALL')
const scroll = ref(null)

function getTypeId() {
  switch (statusOption.value) {
    case 'ALL':
      return 0
    case 'UPDATE':
      return 1
    case 'MAINTENANCE':
      return 2
    case 'MENTENANTA':
      return 2
  }
}

async function onLoad(index, done) {
  const newEntries = await getAllAnnouncements(index, dateOption.value, getTypeId(statusOption.value), done, items.value)
  awaitData.value = newEntries > 0 ? true : false
}


</script>
