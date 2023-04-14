<template>
  <div class="columnContainer row col-6 q-pa-md">
    <q-card flat bordered class=" q-pa-md col-12">
      <q-card-section class="row justify-center content-center align-center col-12">
        <div class="text-h5 text-bold text-italic text-uppercase col-9 q-pa-md row justify-start">
          <p>{{ announcement.title }}</p>
        </div>
        <div class="text-h5 text-bold col-3 q-pa-md row justify-center" style="background-color: var(---bg-primary)">
          <q-btn flat disabled rounded :text-color="color">{{ announcement.type }}</q-btn>
        </div>
      </q-card-section>
      <q-card-section class="col-10 row wrap" style="height: 150px; overflow-y: scroll;">
        <div>
          {{ announcement.value }}
        </div>
      </q-card-section>
      <q-card-section class="row justify-center content-center align-center col-12">
        <div class="text-h7 text-bold col-8 q-pa-md row justify-start">
          Posted On: {{ announcement.creationTime }}
        </div>
        <div class="text-h7 text-bold text-italic col-4 q-pa-md row justify-center">
          <q-btn color="teal" @click="openCard">
            See More
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
  <AnnouncementCard :announcement="announcement" />
</template>
<script setup>
import { ref, defineProps, onMounted, inject } from 'vue'
import { Announcement } from 'src/models/Announcement.js'
import { EVENT_KEYS } from 'src/utils/eventKeys';
import AnnouncementCard from './AnnouncementCard.vue';
const props = defineProps({
  announcement: Announcement
})
const bus = inject('bus')
const color = ref('')
onMounted(() => {
  switch (props.announcement.type) {
    case 'MAJOR':
      color.value = 'purple-10'
      break;
    case 'MINOR':
      color.value = 'primary'
      break;
    default:
      color.value = 'deep-orange-14'
  }
})

function openCard() {
  bus.emit(EVENT_KEYS.OPEN_ANNOUNCEMENT, props.announcement.id)
}

</script>
