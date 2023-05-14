<template>
  <q-dialog>
    <q-card class="row">
      <q-card-section class="rowContainer q-pb-none col-12">
        <div class="text-h6">RASPUNDE AICI</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pa-md columnContainer justify-center col-12 row">
        <q-input v-model="text" filled type="textarea" class="col-12" @update:model-value="countCharacters"
          style="min-width: 500px;" />
        <q-item>Remaining Characters: {{ characters }}</q-item>
        <q-btn color="teal text-white" flat label="TRIMITE RASPUNS" class="item-small col-5 q-pa-md" v-close-popup
          @click="sendMessage(messageId, text)" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from 'vue';
import useQuery from 'src/compositionFunctions/useQuery';

const props = defineProps({
  messageId: Number
})


const text = ref('')
const characters = ref(2000)
const { sendMessage } = useQuery()

function countCharacters() {
  characters.value = 2000 - text.value.length
}
</script>
