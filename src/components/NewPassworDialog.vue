<template>
  <q-dialog v-model="triggered">
    <q-card class="row">
      <q-card-section class="rowContainer q-pb-none col-12">
        <div class="text-h6">Change Password</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pa-md columnContainer justify-center col-12 row">
        <q-form class="columnContainer justify-center col-12 row">
          <PasswordInput placeholder="Old Password" icon="lock_open" tooltip="Old Password" v-model="oldPassword"
            :isVisible='true' />
          <PasswordInput placeholder="New Password" icon="lock" tooltip="New Password" v-model="newPassword"
            :isVisible='false' />
        </q-form>
        <q-btn color="teal" flat label="Change Password" class="item-small col-5 q-pa-md" v-close-popup
          @click="changePassword" />
      </q-card-section>
    </q-card>
  </q-dialog>
  <ErrorDialog />
  <SuccessDialog />
</template>
<script setup>
import { ref, inject } from 'vue';
import { EVENT_KEYS } from 'src/utils/eventKeys'
import { userStore } from 'src/stores/userStore';
import PasswordInput from './PasswordInput.vue';
import SuccessDialog from './SuccessDialog.vue'
import useQuery from 'src/compositionFunctions/useQuery';
import ErrorDialog from './ErrorDialog.vue';


const { updatePassword } = userStore()
const bus = inject('bus')

const oldPassword = ref('')
const newPassword = ref('')
const triggered = ref(false)

bus.on(EVENT_KEYS.PASSWORD_CHANGE, () => {
  triggered.value = true;
})

async function changePassword() {
  console.log(oldPassword.value, newPassword.value)
  const successful = await updatePassword(oldPassword.value, newPassword.value)
  if (!successful) {
    bus.emit(EVENT_KEYS.ERROR)
  } else {
    bus.emit(EVENT_KEYS.SUCCESS)
  }
}
</script>
