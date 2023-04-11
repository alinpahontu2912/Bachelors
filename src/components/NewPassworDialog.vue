<template>
  <q-dialog v-model="triggered">
    <q-card class="row">
      <q-card-section class="rowContainer q-pb-none col-12">
        <div class="text-h6">Change Password</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pa-md columnContainer justify-center col-12 row">
        <PasswordInput placeholder="Old Password" icon="lock_open" tooltip="Old Password" v-model="oldPassword"
          :isVisible='true' />
        <PasswordInput placeholder="New Password" icon="lock" tooltip="New Password" v-model="newPassword"
          :isVisible='false' />
        <PasswordInput placeholder="Confirm Password" icon="enhanced_encryption" tooltip="Confirm Password"
          v-model="confirmPassword" :isVisible='false' />
        <q-btn flat label="Change Password" class="item-small col-5 q-pa-md" v-close-popup @click="test" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from 'vue';
import PasswordInput from './PasswordInput.vue';
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const triggered = ref(true)
const isPwd = ref(true)

function test() {
  console.log(confirmPassword.value)
  console.log(oldPassword.value)
  console.log(newPassword.value)
}
</script>
