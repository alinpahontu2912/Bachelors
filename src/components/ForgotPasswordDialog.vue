<template>
  <q-dialog v-model="triggered">
    <q-card class="row">
      <q-card-section class="rowContainer q-pb-none col-12">
        <div class="text-h6">{{ $t('input_email') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pa-md columnContainer justify-center col-12 row">
        <q-form class="columnContainer justify-center col-12 row">
          <PasswordInput :placeholder="$t('email')" icon="email" tooltip="New Password" v-model="email"
            :isVisible='true' />
        </q-form>
        <q-btn color="teal" flat :label="$t('reset_password')" class="item-small col-5 q-pa-md" v-close-popup
          @click="sendRequest" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import useQuery from 'src/compositionFunctions/useQuery'
import PasswordInput from './PasswordInput.vue'
import { ref, inject } from 'vue'
import { EVENT_KEYS } from 'src/utils/eventKeys'

const { forgotPassword } = useQuery()
const email = ref('')
const success = ref(false)
const error = ref(false)
const bus = inject('bus')

async function sendRequest() {
  const result = await forgotPassword(email.value)
  if (result)
    bus.emit(EVENT_KEYS.SUCCESS)
  else bus.emit(EVENT_KEYS.ERROR)
}
</script>
