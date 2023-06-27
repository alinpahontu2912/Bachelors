<template>
  <div class="columnContainer row col-6 q-pa-md">
    <q-card flat bordered class="row  q-pa-md col-12">
      <q-card-section class="row justify-center content-center align-center col-12">
        <div class="text-h5 text-bold text-italic text-uppercase col-9 q-pa-md row justify-start">
          <p>{{ announcement.title }}</p>
        </div>
        <div class="text-h5 text-bold col-3 q-pa-md row justify-center" style="background-color: var(---bg-primary)">
          <q-btn flat disabled rounded :text-color="color">{{ announcement.type }}</q-btn>
        </div>
      </q-card-section>
      <q-card-section class="col-11 row wrap" style="height: 150px; overflow-y: scroll;">
        <div>
          {{ (announcement.value) }}
        </div>
      </q-card-section>
      <q-card-section class="row justify-center content-center align-center col-12">
        <div class="text-h7 text-bold col-9 q-pa-md row justify-start">
          {{ $t('posted_on') }} {{ announcement.creationTime }}
        </div>
        <div class="text-h7 text-bold text-italic col-3 q-pa-md row justify-center">
          <q-btn color="teal" @click="openCard">
            {{ $t('see_more') }}
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
  <AnnouncementCard :announcement="announcement" />
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import { EVENT_KEYS } from 'src/utils/eventKeys';
import AnnouncementCard from './AnnouncementCard.vue';
const props = defineProps({
  announcement: Object
})
const bus = inject('bus')
const color = ref('')
onMounted(() => {
  switch (props.announcement.type) {
    case 'UPDATE':
      color.value = 'purple-10'
      break;
    case 'MAINTENANCE':
      color.value = 'deep-orange-14'
      break;
    default:
      color.value = 'black'
  }
})

function openCard() {
  bus.emit(EVENT_KEYS.OPEN_ANNOUNCEMENT, props.announcement.id)
}


</script>
