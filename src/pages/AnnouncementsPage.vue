<template>
  <div class="q-pa-md">
    <div class="rowContainer">
      Sort By Date:
    </div>
    <q-infinite-scroll @load="onLoad" :offset="250">
      <div class="row fit ">
        <AnnouncementTile v-for="(item, index) in items" :key="index" :announcement="item" />
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
import AnnouncementTile from 'src/components/AnnouncementTile.vue';
import { Announcement } from 'src/models/Announcement';
import { ref } from 'vue'
const items = ref([new Announcement(1, 'MAJOR', '27/12/2020', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\
 Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum', 'New Data to be added'), new Announcement(2, 'MAJOR', '27 / 12 / 2020', 'assadfdsafsdafadsfasdfads', 'test')])
console.log(items.value)
</script>
