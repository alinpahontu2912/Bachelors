<template>
  <div class="row items-align space-around">
    <div class="col-7 row q-px-md content-center">
      <q-card class="row justify-center" style="height: 600px">
        <q-card-section class="rowContainer col-12">
          <div class="text-h4 text-bold ">{{ $t('login_title') }}</div>
        </q-card-section>
        <q-card-section class="rowContainer col-12">
          <q-form class="columnContainer item-medium row col-12">
            <q-input standout="bg-secondary text-white" rounded type="email" :label="$t('email')"
              class="q-pa-md col-10 item-medium">
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
              <template v-slot:append>
                <!-- @click="text = '' -->
                <q-icon name="close" class="cursor-pointer" />
              </template>
            </q-input>
            <q-input standout="bg-secondary text-white" rounded :type="isPwd ? 'password' : 'text'"
              :label="$t('password')" class="q-pa-md col-10 item-medium">
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-section class="rowContainer col-8">
          <q-btn rounded outlined unelevated size="md" class="q-pa-md item-medium bg-secondary text-white"
            :label="$t('login')" />
        </q-card-section>
        <q-card-section class="rowContainer col-8">
          <q-btn rounded outlined unelevated size="md" class="q-pa-md item-medium bg-secondary text-white"
            :label="$t('forgot_password')" />
          <q-checkbox class="q-pa-md item-medium" left-label v-model="isPwd" :label="$t('remember_me')"
            checked-icon="task_alt" unchecked-icon="highlight_off" />
        </q-card-section>

      </q-card>
    </div>
    <div class="col-5 row q-px-md">
      <q-card class="row bg-secondary justify-center text-white" style="height: 600px">
        <q-card-section class="rowContainer col-12">
          <div class="text-h4 text-bold" style="text-align: center;">{{ $t('new_here') }}</div>
        </q-card-section>
        <q-card-section class="rowContainer col-12">
          <div class="text-h3 text-white text-center q-pa-xl">{{ $t('join_description') }}</div>
        </q-card-section>
        <q-card-section class="rowContainer col-8">
          <q-form class="row content-center justify-center align-center item-medium col-8">
            <q-btn rounded outlined unelevated size="md" class="q-pa-md col-12 item-medium bg-white text-black"
              :label="$t('sign_up')" @click="test" />
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { axiosInstance } from '../boot/axios'
const isPwd = ref(true)
const lorem = ref('')
async function test() {
  try {
    const response = await axiosInstance.get('https://catfact.ninja/breeds?limit=1')
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    return null
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
