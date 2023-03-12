<template>
  <q-page>
    <div class="row items-align space-around">
      <div class="col-7 q-pa-lg row">
        <q-card class="text-black full-width column wrap justify-start content-center" style="height: 85vh;">
          <q-card-section class="full-width row wrap justify-center items-center content-center col q-pa-sm">
            <div class="text-h4 text-bold ">{{ $t('login_title') }}</div>
          </q-card-section>
          <q-card-section class="full-width row wrap justify-center items-center content-center col q-pa-sm">
            <q-form class="q-gutter-md row items-center justify-center">
              <q-input standout="bg-secondary text-white" rounded type="email" :label="$t('email')"
                class="q-pa-md col-10">
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
                <template v-slot:append>
                  <!-- @click="text = '' -->
                  <q-icon name="close" class="cursor-pointer" />
                </template>
              </q-input>
              <q-input standout="bg-secondary text-white" rounded :type="isPwd ? 'password' : 'text'"
                :label="$t('password')" class="q-pa-md col-10">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>
              <q-checkbox class="q-pa-md col-3" left-label v-model="isPwd" :label="$t('remember_me')"
                checked-icon="task_alt" unchecked-icon="highlight_off" />
              <q-btn rounded outlined unelevated size="md" class="q-pa-md col-4 bg-secondary text-white"
                :label="$t('forgot_password')" />
            </q-form>
          </q-card-section>
          <q-card-section class="full-width row wrap justify-center items-center content-center col q-pa-sm">
            <q-btn rounded outlined unelevated size="md" class="q-pa-md col-6 bg-secondary text-white"
              :label="$t('login')" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-5 q-pa-lg row">
        <q-card class="full-width column wrap justify-start content-center bg-secondary text-white" style="height: 85vh;">
          <q-card-section style="text-align: center;"
            class="full-width row wrap justify-center items-center content-center col q-pa-lg">
            <div class="text-h3 text-bold" style="text-align: center;">{{ $t('new_here') }}</div>
          </q-card-section>
          <q-card-section class="full-width row wrap justify-center items-center content-center col q-pa-lg">
            <div class="text-h4 text-white text-center q-pa-xl">{{ $t('join_description') }}</div>
          </q-card-section>
          <q-card-section class="full-width row wrap justify-center items-center content-center col q-pa-lg">
            <q-btn rounded outlined unelevated size="md" class="q-pa-lg col-6 bg-white text-black"
              :label="$t('sign_up')" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref } from 'vue';
const isPwd = ref(true)
const lorem = ref('')

</script>
