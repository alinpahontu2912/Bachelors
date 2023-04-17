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
          <div class="row col-12 q-pa-md text-bold text-italic">Motivation</div>
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
                <q-btn class="row col-12" color="green">ACCEPT</q-btn>
              </q-item>
              <q-item>
                <q-btn class="row col-12" color="red">REJECT</q-btn>
              </q-item>
              <q-item>
                <q-btn class="row col-12" color="grey">CONTACT</q-btn>
              </q-item>
            </q-list>
          </div>

        </q-item-section>
      </q-item>

    </q-card>
  </div>
</template>
<script setup>
const props = defineProps({
  request: Object
})
</script>

