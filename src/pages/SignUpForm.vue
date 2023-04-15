<template>
  <div class="rowContainer row space-around">
    <div class="col-7 row q-px-md">
      <q-card class="row" style="height: 600px">
        <q-card-section class="rowContainer col-12">
          <div class="text-h4 text-bold ">{{ $t('signUp_title') }}</div>
        </q-card-section>
        <q-card-section class="rowContainer col-12">
          <q-form class="columnContainer item-medium row col-12">
            <PasswordInput :placeholder='$t("email")' icon="mail" :tooltip='$t("email")' v-model="signUpData.email"
              :isVisible='true' :standout="'bg-secondary text-white'" :outlined=false />
            <PasswordInput :placeholder='$t("password")' icon="lock" :tooltip='$t("password")'
              v-model="signUpData.password" :isVisible='false' :standout="'bg-secondary text-white'" :outlined=false />
            <q-select clearable class="q-pa-md col-10 item-medium" standout="bg-teal text-white"
              v-model:model-value="signUpData.job" :options="options" :label="$t('user_job')">
              <template v-slot:prepend>
                <q-icon name="settings_accessibility" />
              </template>
            </q-select>
          </q-form>
        </q-card-section>
        <q-card-section class="rowContainer col-10">
          <q-form class="rowContainer item-medium col-12">
            <q-checkbox class="q-pa-md col-4 item-medium" left-label v-model="remainSignedin" :label="$t('remember_me')"
              checked-icon="task_alt" unchecked-icon="highlight_off" />
            <q-btn rounded outlined unelevated size="md" class="q-pa-md col-4 item-medium bg-secondary text-white"
              :label="$t('create_account')" @click="signUp" />
          </q-form>
        </q-card-section>
      </q-card>
    </div>
    <SmallAuthFormCard :title="'already_have_account'" :middleText="'returning_description'" :buttonName="'go_to_login'"
      :function="routeToLogin" />
  </div>
  <ErrorDialog />
</template>
<script setup>
import { ref, onMounted, inject } from 'vue'
import { userStore } from 'src/stores/userStore';
import { useRouter } from 'vue-router';
import useQuery from 'src/compositionFunctions/useQuery';
import SmallAuthFormCard from 'src/components/SmallAuthFormCard.vue';
import PasswordInput from 'src/components/PasswordInput.vue';
import { EVENT_KEYS } from 'src/utils/eventKeys';
import ErrorDialog from 'src/components/ErrorDialog.vue';

const router = useRouter()
const { getUserJobs } = useQuery()
const bus = inject('bus')
const remainSignedin = ref(true)
const userJobs = ref([])
const options = ref([])
const signUpData = ref({ email: '', password: '', job: null })
const { signUpRequest } = userStore()

onMounted(async () => {
  userJobs.value = await getUserJobs()
  options.value = userJobs.value.map(x => { return x.job })
})

async function signUp() {
  signUpData.value.job = userJobs.value.find(x => x.job === signUpData.value.job).id
  console.log(signUpData.value)
  const successfull = await signUpRequest(signUpData.value.email, signUpData.value.password, signUpData.value.job)
  if (successfull) {
    router.push('/start')
  } else {
    bus.emit(EVENT_KEYS.ERROR)
  }
  signUpData.value = { email: '', password: '', job: null }
}

function routeToLogin() {
  router.push('/login')
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
