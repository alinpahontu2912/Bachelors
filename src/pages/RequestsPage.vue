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
    <q-infinite-scroll @load="onLoad" :offset="250">
      <div class="row fit ">
        <!-- <AnnouncementTile v-for="(item, index) in items" :key="index" :announcement="item" /> -->
        <RequestTile v-for="(item, index) in items" :key="index" :request="item" />

      </div>
      <template v-slot:loading>
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
  loading.value = true;
  items.value.length = 0;
  const data = await getAllRequests(dateOption.value, getStatusId(statusOption.value))
  data.forEach(element => {
    items.value.push({ id: element.id, issuer: element.issuer, requestTime: new Date(element.requestTime).toDateString(), motivation: element.motivation, status: element.status, email: element.issuerNavigation.email })
    items.value.push({ id: element.id, issuer: element.issuer, requestTime: new Date(element.requestTime).toDateString(), motivation: element.motivation, status: element.status, email: element.issuerNavigation.email })
    items.value.push({ id: element.id, issuer: element.issuer, requestTime: new Date(element.requestTime).toDateString(), motivation: element.motivation, status: element.status, email: element.issuerNavigation.email })

  });
  loading.value = false;
}

onMounted(async () => {
  const data = await getAllRequests(dateOption.value, getStatusId(statusOption.value))
  data.forEach(element => {
    items.value.push({ id: element.id, issuer: element.issuer, requestTime: new Date(element.requestTime).toDateString(), motivation: element.motivation, status: element.status, email: element.issuerNavigation.email })
    items.value.push({ id: element.id, issuer: element.issuer, requestTime: new Date(element.requestTime).toDateString(), motivation: element.motivation, status: element.status, email: element.issuerNavigation.email })
    items.value.push({ id: element.id, issuer: element.issuer, requestTime: new Date(element.requestTime).toDateString(), motivation: element.motivation, status: element.status, email: element.issuerNavigation.email })

  });
})


</script>
