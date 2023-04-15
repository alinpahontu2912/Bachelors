<template>
  <div class="row items-align space-around">
    <div class="col-7 row q-px-md content-center">
      <q-card class="row justify-center" style="height: 600px">
        <q-card-section class="rowContainer col-12">
          <div class="text-h4 text-bold ">{{ $t('login_title') }}</div>
        </q-card-section>
        <q-card-section class="rowContainer col-12">
          <q-form class="columnContainer item-medium row col-12">
            <PasswordInput :placeholder='$t("email")' icon="mail" :tooltip='$t("email")' v-model="loginData.email"
              :isVisible='true' :standout="'bg-secondary text-white'" :outlined=false />
            <PasswordInput :placeholder='$t("password")' icon="lock" :tooltip='$t("password")'
              v-model="loginData.password" :isVisible='false' :standout="'bg-secondary text-white'" :outlined=false />
          </q-form>
        </q-card-section>
        <q-card-section class="rowContainer col-8">
          <q-btn rounded outlined unelevated size="md" class="q-pa-md item-medium bg-secondary text-white"
            :label="$t('login')" @click="logIn" />
        </q-card-section>
        <q-card-section class="rowContainer col-8">
          <q-btn rounded outlined unelevated size="md" class="q-pa-md item-medium bg-secondary text-white"
            :label="$t('forgot_password')" />
          <q-checkbox class="q-pa-md item-medium" left-label v-model="saveCredentials" :label="$t('remember_me')"
            checked-icon="task_alt" unchecked-icon="highlight_off" />
        </q-card-section>
      </q-card>
    </div>
    <SmallAuthFormCard :title="'new_here'" :middleText="'join_description'" :buttonName="'sign_up'"
      :function="routeToSignUp" />
  </div>
  <ErrorDialog />
</template>
<script setup>
import { onMounted, ref, inject } from 'vue';
import { userStore } from 'src/stores/userStore';
import { useRouter } from 'vue-router';
import SmallAuthFormCard from 'src/components/SmallAuthFormCard.vue';
import PasswordInput from 'src/components/PasswordInput.vue';
import ErrorDialog from 'src/components/ErrorDialog.vue';

const { loginRequest, checkUserAlreadySignedIn, isUserAdmin } = userStore()
const router = useRouter()
const saveCredentials = ref(true)
const loginData = ref({ email: '', password: '' })
const bus = inject('bus')

async function logIn() {
  const data = await loginRequest(loginData.value.email, loginData.value.password, saveCredentials.value)
  loginData.value = { email: '', password: '' }
  if (data) {
    router.push('/start')
  } else {
    bus.emit(EVENT_KEYS.ERROR)
  }
}

function routeToSignUp() {
  router.push('/signup')
}

onMounted(() => {
  const token = checkUserAlreadySignedIn()
  if (token) {
    router.push('/start')
  }
})

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
