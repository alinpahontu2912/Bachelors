<template>
  <q-dialog v-model="triggered">
    <q-card style="width: 300px">
      <q-card-section>
        <div class="text-h6">{{ $t('error') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ $t(text) }}
      </q-card-section>

      <q-card-actions class="bg-white text-teal">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { EVENT_KEYS } from 'src/utils/eventKeys';
import { ref, inject } from 'vue'
const bus = inject('bus')
const triggered = ref(false)

const props = defineProps({
  text: String
})

bus.on(EVENT_KEYS.ERROR, () => {
  triggered.value = true
})
</script>
