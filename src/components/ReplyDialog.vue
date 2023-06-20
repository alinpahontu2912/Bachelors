<template>
  <q-dialog>
    <q-card class="row">
      <q-card-section class="rowContainer q-pb-none col-12">
        <div class="text-h6">{{ $t('answer_here') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pa-md columnContainer justify-center col-12 row">
        <q-input v-model="text" filled type="textarea" class="col-12" @update:model-value="countCharacters"
          style="min-width: 500px;" />
        <q-item>{{ $t('remaining_characters') }} {{ characters }}</q-item>
        <q-btn color="teal text-white" flat :label="$t('send_message')" class="item-small col-5 q-pa-md" v-close-popup
          @click="sendMail" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, inject } from 'vue';
import useQuery from 'src/compositionFunctions/useQuery';
import { EVENT_KEYS } from 'src/utils/eventKeys';

const props = defineProps({
  messageId: Number
})

const text = ref('')
const characters = ref(2000)
const bus = inject('bus')
const { sendMessage } = useQuery()

function countCharacters() {
  characters.value = 2000 - text.value.length
}

async function sendMail() {
  const response = await sendMessage(props.messageId, text.value)
  if (response != null) {
    bus.emit(EVENT_KEYS.SUCCESS, response)
  }
  else {
    bus.emit(EVENT_KEYS.ERROR, response)
  }
}
</script>
