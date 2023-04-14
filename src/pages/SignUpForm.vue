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
              :label="$t('create_account')" @click="testSignUp" />
          </q-form>
        </q-card-section>
      </q-card>
    </div>
    <SmallAuthFormCard :title="'already_have_account'" :middleText="'returning_description'"
      :buttonName="'go_to_login'" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import useQuery from 'src/compositionFunctions/useQuery';
import SmallAuthFormCard from 'src/components/SmallAuthFormCard.vue';
import PasswordInput from 'src/components/PasswordInput.vue';
const { getUserJobs } = useQuery()
const remainSignedin = ref(true)
const isPwd = ref(true)
const userJobs = ref([])
const options = ref([])
const signUpData = ref({ email: '', password: '', job: null })

onMounted(async () => {
  const date = new Date().toLocaleDateString()
  console.log(date)
  userJobs.value = await getUserJobs()
  console.log(userJobs.value)
  options.value = userJobs.value.map(x => { return x.job })
})

function testSignUp() {
  signUpData.value.job = userJobs.value.find(x => x.job === signUpData.value.job).id
  signUpData.value.date = new Date().toLocaleDateString();
  console.log(signUpData.value)
  signUpData.value = { email: '', password: '', job: null }
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
