<template>
  <q-page>
    <div class="row items-align space-around">
      <!-- <div class="col-1" /> -->
      <div class="col-7 q-pa-lg">
        <q-card class="text-black " style="height: 80vh;">
          <q-card-section class="full-width row wrap justify-center items-center content-center q-pa-lg">
            <div class="text-h4 text-bold q-pa-sm">LOG IN TO YOUR ACCOUNT</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="full-width row wrap justify-center items-center content-center q-pa-lg">
            <q-form class="q-gutter-md row items-center justify-center q-pa-lg">
              <q-input standout="bg-secondary text-white" rounded type="email" label="email" class="q-pa-md col-10">
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
                <template v-slot:append>
                  <!-- @click="text = '' -->
                  <q-icon name="close" class="cursor-pointer" />
                </template>
              </q-input>
              <q-input standout="bg-secondary text-white" rounded :type="isPwd ? 'password' : 'text'" label="password"
                class="q-pa-md col-10">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>
              <!-- <q-checkbox left-label v-model="remainSignedIn" label="Stay logged in" checked-icon="task_alt"
                unchecked-icon="highlight_off" /> -->
              <q-btn rounded outlined unelevated size="md" class="q-pa-md col-4 bg-secondary text-white" label="Login" />
            </q-form>
          </q-card-section>
          <q-separator />
          <q-card-section class="full-width row wrap justify-center items-center content-center q-pa-lg">
            <div class="text-h4 text-bold q-pa-sm">LOG IN TO YOUR ACCOUNT</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-5 q-pa-lg">
        <q-card class="my-card bg-secondary text-white " style="height: 80vh;">
          <q-card-section class="full-width row wrap justify-center items-center content-center q-pa-lg "
            style="text-align: center;">
            <div class="text-h4 text-bold q-pa-sm" style="text-align: center;">New here?</div>
          </q-card-section>
        </q-card>
      </div>
      <!-- <div class="my-card col-1" /> -->
    </div>
  </q-page>
</template>
<script setup>
import { ref } from 'vue';
const isPwd = ref(true)
const lorem = ref('')

</script>
