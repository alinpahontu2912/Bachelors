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
              class="q-pa-md col-10 item-medium" v-model:model-value="loginData.email">
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
              <template v-slot:append>
                <q-icon name="close" class="cursor-pointer" @click="loginData.email = ''" />
              </template>
            </q-input>
            <q-input standout="bg-secondary text-white" rounded :type="isPwd ? 'password' : 'text'"
              :label="$t('password')" class="q-pa-md col-10 item-medium" v-model:model-value="loginData.password">
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
            :label="$t('login')" @click="testLogIn" />
        </q-card-section>
        <q-card-section class="rowContainer col-8">
          <q-btn rounded outlined unelevated size="md" class="q-pa-md item-medium bg-secondary text-white"
            :label="$t('forgot_password')" />
          <q-checkbox class="q-pa-md item-medium" left-label v-model="isPwd" :label="$t('remember_me')"
            checked-icon="task_alt" unchecked-icon="highlight_off" />
        </q-card-section>
      </q-card>
    </div>
    <SmallAuthFormCard :title="'new_here'" :middleText="'join_description'" :buttonName="'sign_up'" />
  </div>
</template>
<script setup>
import SmallAuthFormCard from 'src/components/SmallAuthFormCard.vue';
import { axiosInstance } from '../boot/axios'
import { ref } from 'vue';
const isPwd = ref(true)
const loginData = ref({ email: '', password: '' })

function testLogIn() {
  console.log(loginData.value)
  loginData.value = { email: '', password: '' }
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
