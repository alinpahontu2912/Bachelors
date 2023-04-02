<template>
  <div class="rowContainer row">
    <q-card class="col-11" style="height: 600px">
      <q-card-section class="rowContainer row">
        <q-item class="row justify-center space-around col-7" q-pa-sm>
          <div class="col-12">
            <q-list bordered separator>
              <q-item class="row justify-start content-center">
                <q-item-section avatar class="col-1">
                  <q-icon color="primary" name="email" />
                </q-item-section>
                <q-item-section class="col-8">Your Email</q-item-section>
                <q-item-section q-pa-md side class="col-3">
                  <q-item-label>johndoe@test.com</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="row justify-center content-center">
                <q-item-section avatar class="col-1">
                  <q-icon color="secondary" name="download" />
                </q-item-section>
                <q-item-section class="col-8">Your Email</q-item-section>
                <q-item-section q-pa-md side class="col-3">
                  <q-item-label>johndoe@test.com</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="row justify-center content-center">
                <q-item-section avatar class="col-1">
                  <q-icon color="secondary" name="event" />
                </q-item-section>
                <q-item-section class="col-8">Joined On:</q-item-section>
                <q-item-section q-pa-md side class="col-3">
                  <q-item-label>27/03/2023</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-item>
        <!-- <q-separator vertical color="black" /> -->
        <q-item class="row bg-secondary justify-center content-center text-white col-5" q-pa-sm>
          <div class="col-12">
            <q-list>
              <q-item class="rowContainer content-center justify-center">
                <q-item-section>Thank you for being part of this adventure!</q-item-section>
              </q-item>
              <q-item class="rowContainer content-center justify-center">
                <q-item-section>500+ people</q-item-section>
              </q-item>
              <q-item class="row content-center justify-center">
                <q-item-section class="col-12">Your Email</q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-item>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import useQuery from 'src/compositionFunctions/useQuery';
import SmallAuthFormCard from 'src/components/SmallAuthFormCard.vue';
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
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.item-small {
  flex-grow: 2;
}

.item-medium {
  flex-grow: 3;

}
</style>
