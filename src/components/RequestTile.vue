<template>
  <div class="rowContainer row col-12 q-pa-md">
    <q-card class="row rowContainer col-12 bg-grey-3">
      <q-item class="rowContainer row col-12 bg-teal-7">
        <q-item-section avatar class="columnContainer row item-medium content-center align-center justify-center col-2 ">
          <div class="col-12 item-medium q-pa-sm">
            <q-icon name="account_circle" size="5em" color="white">
              <q-tooltip>
                {{ request.email }}
              </q-tooltip>
            </q-icon>
          </div>
          <div class="col-12 item-medium text-bold q-pa-sm text-white">{{ request.requestTime }}</div>
        </q-item-section>
        <q-item-section
          class="columnContainer col-8 bg-white row item-medium content-center  align-center justify-around">
          <div class="row col-12 q-pa-md text-bold text-italic">{{ $t('motivation') }}</div>
          <div class="row col-12 q-pa-md fit nowrap" style="overflow-y: scroll; display: flex;
          flex-direction: column; max-height: 200px;">
            <div class="q-pa-xs">
              {{ request.motivation }}
            </div>
          </div>
        </q-item-section>
        <q-item-section side class="row item-medium content-center align-center justify-center col-2">
          <div class="row col-12 item-medium  q-pa-md">
            <q-list class="row content-center justify-center align-center col-12">
              <q-item>
                <q-btn :disable="request.status != 1" class="row col-12" color="green" :label="$t('accept')"
                  @click="sendSolvedRequest(2)" />
              </q-item>
              <q-item>
                <q-btn :disable="request.status != 1" class="row col-12" color="red" :label="$t('reject')"
                  @click="sendSolvedRequest(3)" />
              </q-item>
            </q-list>
          </div>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>
<script setup>
import useQuery from 'src/compositionFunctions/useQuery';
import { inject } from 'vue'
import { EVENT_KEYS } from 'src/utils/eventKeys';
const { solveRequest } = useQuery();
const props = defineProps({
  request: Object
})

const bus = inject('bus')
async function sendSolvedRequest(response) {
  const result = await solveRequest(props.request.id, response)
  if (result) {
    bus.emit(EVENT_KEYS.SUCCESS, response)
  }
  else {
    bus.emit(EVENT_KEYS.ERROR, response)
  }
}
</script>

