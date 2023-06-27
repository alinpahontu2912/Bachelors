<template>
  <q-dialog>
    <q-card class="row">
      <q-card-section class="rowContainer q-pb-none col-12">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pa-md row justify-center col-12 ">
        <q-input v-model="announcement.announcementTitle" filled class="col-6 q-px-sm" :label="$t('ancTitle')"
          color="bg-teal" />
        <q-select filled outlined class="col-6 q-px-sm" :label="$t('ancType')" v-model="announcement.announcementType"
          :options="ancTypes" color="bg-teal"></q-select>
        <q-item></q-item>
        <q-input v-model="announcement.announcementValue" filled type="textarea" class="col-12"
          @update:model-value="countCharacters" style="min-width: 500px;" />
        <div class="row col-12 justify-evenly content-center">
          <q-item class="col-12 content-center justify-center">{{ $t('remaining_characters') }} {{ characters }}</q-item>
          <q-btn color="teal text-white" flat :label="$t('send_announcement')" class="item-small col-12 q-pa-md"
            v-close-popup @click="sendAnnouncement" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { userStore } from 'src/stores/userStore';
import useQuery from 'src/compositionFunctions/useQuery'
import utilities from 'src/utils/utilities';
import { EVENT_KEYS } from 'src/utils/eventKeys';
import bus from 'src/boot/bus';

const { t } = useI18n();
const { getAnnouncementType } = utilities()
const { postNewAnnouncement } = useQuery()
const { getUserId } = userStore()
const characters = ref(2000)
const announcement = ref({
  announcementTitle: '',
  announcementValue: '',
  announcementType: ''
})
const types = ['UPDATE', 'MAINTENANCE']
const ancTypes = computed(() => types.map(type => t(type)))

function countCharacters() {
  characters.value = 2000 - announcement.value.announcementValue.length
}

async function sendAnnouncement() {
  const response = await postNewAnnouncement(
    announcement.value.announcementTitle,
    getAnnouncementType(announcement.value.announcementType),
    announcement.value.announcementValue, getUserId())
  if (response) bus.emit(EVENT_KEYS.SUCCESS)
  else bus.emit(EVENT_KEYS.ERROR)
}

</script>
