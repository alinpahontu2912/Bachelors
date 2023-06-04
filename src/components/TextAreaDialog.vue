<template>
  <q-dialog v-model="triggered">
    <q-card class="row">
      <q-card-section class="rowContainer q-pb-none col-12">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pa-md columnContainer justify-center col-12 row">
        <q-input v-model="text" filled type="textarea" class="col-12" @update:model-value="test"
          style="min-width: 300px;" />
        <q-item>{{ $t('remaining_characters') }} {{ characters }}</q-item>
        <q-btn color="teal text-white" flat :label='buttonText' class="item-small col-5 q-pa-md" v-close-popup
          @click="sendQuery" />
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="alert">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ result }}</div>
      </q-card-section>
      <q-card-actions>
        <q-btn flat label="OK" color="secondary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, inject } from 'vue'
import { EVENT_KEYS } from 'src/utils/eventKeys';
import useQuery from 'src/compositionFunctions/useQuery';
import { userStore } from 'src/stores/userStore';

const { getUserId } = userStore()
const { sendFeedback, createRequest } = useQuery()

const props = defineProps({
  title: String,
  buttonText: String,
  type: String
})

const text = ref('')
const characters = ref(2000)
const triggered = ref(false)
const bus = inject('bus')
const result = ref('')
const alert = ref(false)

bus.on(EVENT_KEYS.DATA_DOWNLOAD_REQUEST, () => {
  if (props.type === EVENT_KEYS.DATA_DOWNLOAD_REQUEST)
    triggered.value = true;
})

bus.on(EVENT_KEYS.LEAVE_FEEDBACK, () => {
  if (props.type === EVENT_KEYS.LEAVE_FEEDBACK)
    triggered.value = true;
})

function test() {
  characters.value = 2000 - text.value.length
}

async function sendQuery() {
  if (props.type === EVENT_KEYS.LEAVE_FEEDBACK) {
    const data = await sendFeedback(getUserId(), text.value)
    result.value = data ? 'SUCCESS' : 'SOMWTHING WENT WRONG'
    alert.value = true
  }
  if (props.type === EVENT_KEYS.DATA_DOWNLOAD_REQUEST) {
    const data = await createRequest(getUserId(), text.value)
    console.log(data)
    result.value = data ? 'SUCCESS' : 'SOMWTHING WENT WRONG'
    alert.value = true
  }
}


</script>
<style>
.columnContainer {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.rowContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.item-small {
  flex-grow: 1;
}

.item-medium {
  flex-grow: 3;

}
</style>
