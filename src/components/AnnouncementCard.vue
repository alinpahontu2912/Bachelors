<template>
  <q-dialog v-model="triggered">
    <q-card flat bordered class="bg-grey-2" style="width: 500px;">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">{{ announcement.title }}</div>
            <div class="text-subtitle2">Posted On: {{ announcement.creationTime }}</div>
          </div>
          <div class="col-auto">
            <q-btn color="grey-7" round flat icon="close" v-close-popup>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section style="height: 50vh" class="scroll">
        {{ announcement.value }}
      </q-card-section>

    </q-card>
  </q-dialog>
</template>
<script setup>
import { EVENT_KEYS } from 'src/utils/eventKeys';
import { ref, inject, defineProps } from 'vue'

const props = defineProps({
  announcement: Object
})

const bus = inject('bus')
const triggered = ref(false)
bus.on(EVENT_KEYS.OPEN_ANNOUNCEMENT, (id) => {
  if (props.announcement.id === id)
    triggered.value = true
})
</script>
<style scoped>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
</style>
