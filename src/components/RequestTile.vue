<template>
  <div class="row col-12 q-pa-md">
    <!-- <q-card flat bordered class="rowContainer row q-pa-md col-12" style="height: 200px;">
      <q-card-section bordered outlined teal class="item-end row bg-secondary">
        <q-list bordered outlined class="row col-12">
          <q-item class="q-pa-md col-12" flat>
            <text>Email</text>
          </q-item>
          <q-item class="q-pa-md col-12 ">
            <text>Date</text>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section class="row item-center">

      </q-card-section>
      <q-card-section class="item-end row bg-secondary">
        <q-list bordered outlined>
          <q-item class="q-pa-md">
            TEST1
          </q-item>
          <q-item>
            TEST1
          </q-item>

          <q-item>
            TEST1
          </q-item>

        </q-list>
      </q-card-section>
    </q-card> -->
    <q-card class="row justify-start content-center col-12">
      <q-item class="row justify-start content-center col-12 bg-grey-2">
        <q-item-section avatar class="col-2 bg-teal-8 q-pa-md">
          <q-list>
            <q-item class="row justify-center content-center col-12">
              Email
            </q-item>
            <q-item class="row justify-center content-center col-12">
              Date
            </q-item>
          </q-list>
        </q-item-section>
        <q-item-section class="col-9 row content-center justify-center q-pa-md">
          <div style="overflow-y: scroll; height: 200px;">
            <div v-for="n in 100" :key="n" class="q-pa-xs">
              Lorem ipsum dolor sit amet, consectetur adipisicing
              elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </div>
          </div>
        </q-item-section>
        <q-item-section q-pa-md side class="col-1 row content-center q-pa-md">
          <q-item-label>
            <q-list>
              <q-item class="row justify-center content-center col-12">
                <q-btn>Accept</q-btn>
              </q-item>
              <q-item class="row justify-center content-center col-12">
                <q-btn>Accept</q-btn>
              </q-item>
              <q-item class="row justify-center content-center col-12">
                <q-btn>Accept</q-btn>
              </q-item>

            </q-list>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import { Requests } from 'src/models/Requests';
import { EVENT_KEYS } from 'src/utils/eventKeys';
const props = defineProps({
  request: Requests
})
const thumbStyle = ref({
  right: '4px',
  borderRadius: '5px',
  backgroundColor: '#027be3',
  width: '5px',
  opacity: 0.75
})

const barStyle = ref({
  right: '2px',
  borderRadius: '9px',
  backgroundColor: '#027be3',
  width: '9px',
  opacity: 0.2
})
</script>
<style>
.item-end {
  flex-grow: 1;
}

.item-center {
  flex-grow: 4;
}
</style>
