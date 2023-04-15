<template>
  <div class="q-pa-md">
    <div class="rowContainer">
      Sort By Date:
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
import { Requests } from 'src/models/Requests';
import { ref } from 'vue'
const items = ref([{}, {}, {}, {}, {}])
</script>
