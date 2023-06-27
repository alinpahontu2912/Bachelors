<template>
  <div class="rowContainer row col-12 q-pa-md">
    <q-card class="row rowContainer col-12 bg-grey-3">
      <q-item class="rowContainer row col-12 bg-teal-7" style="height: 350px;">
        <q-item-section avatar class=" columnContainer row item-medium content-center align-center justify-center col-2 ">
          <div class=" col-12 item-medium q-pa-sm">
            <q-icon name="account_circle" size="5em" color="white">
              <q-tooltip>
                {{ message.email }}
              </q-tooltip>
            </q-icon>
          </div>
          <div class="col-12 item-medium text-bold q-pa-sm text-white">{{ message.requestTime }}</div>
        </q-item-section>
        <q-item-section
          class="columnContainer col-8 bg-white row item-medium content-center  align-center justify-around">
          <div class="row col-12 q-pa-md fit nowrap" style="overflow-y: scroll; display: flex;
          flex-direction: column; min-height: 300px; max-height: 300px;">
            <div class="q-pa-xs">
              {{ message.value }}
            </div>
          </div>
        </q-item-section>
        <q-item-section side class="row item-medium content-center align-center justify-center col-2">
          <div class="row col-12 item-medium  q-pa-md">
            <q-list class="row content-center justify-center align-center col-12">
              <q-item>
                <q-btn class="row col-12" :disable="message.status == 1" color="green" :label="$t('mark_as_read')"
                  @click="markRead()" />
              </q-item>
              <q-item>
                <q-btn class="row col-12" color="red" :label="$t('reply')" @click="dialog = !dialog" />
              </q-item>
            </q-list>
          </div>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
  <ReplyDialog :messageId="message.id" v-model="dialog" />
</template>
<script setup>
import useQuery from 'src/compositionFunctions/useQuery';
import ReplyDialog from './ReplyDialog.vue';
import { ref, inject } from 'vue'
import { EVENT_KEYS } from 'src/utils/eventKeys';

const { sendMessage } = useQuery()

const dialog = ref(false)
const bus = inject('bus')

const props = defineProps({
  message: Object
})

async function markRead() {
  const result = await sendMessage(props.message.id, '')
  if (result == 200) {
    bus.emit(EVENT_KEYS.SUCCESS)
  } else {
    bus.emit(EVENT_KEYS.ERROR)
  }
}

</script>

