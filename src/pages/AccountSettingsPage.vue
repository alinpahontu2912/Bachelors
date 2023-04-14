<template>
  <div class="rowContainer row">
    <q-card class="col-11" style="height: 600px">
      <q-card-section class="rowContainer row">
        <q-item class="row justify-center space-around col-7" q-pa-sm>
          <q-list bordered separator class="columnContainer row space-around col-12">
            <q-item class="row justify-start content-center col-12">
              <q-item-section avatar class="col-2">
                <q-icon color="secondary" name="email" />
              </q-item-section>
              <q-item-section class="col-6">{{ $t('joined_on') }}</q-item-section>
              <q-item-section q-pa-md side class="col-4">
                <q-item-label>johndoe@test.com</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="row justify-start content-center col-12">
              <q-item-section avatar class="col-2">
                <q-icon color="secondary" name="download" />
              </q-item-section>
              <q-item-section class="col-6">{{ $t('your_email') }}</q-item-section>
              <q-item-section q-pa-md side class="col-4">
                <q-item-label>johndoe@test.com</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="row justify-start content-center col-12">
              <q-item-section avatar class="col-2">
                <q-icon color="secondary" name="event" />
              </q-item-section>
              <q-item-section class="col-6">{{ $t('download_permission') }}}</q-item-section>
              <q-item-section q-pa-md side class="col-4">
                <q-item-label>27/03/2023</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-item>
        <q-item class="row bg-secondary justify-center content-center text-white col-5" q-pa-sm>
          <div class="col-12">
            <q-list>
              <q-item class="rowContainer content-center justify-center">
                <q-item-section>Thank you for being part of this adventure!</q-item-section>
              </q-item>
              <q-item class="rowContainer content-center justify-center">
                <q-item-section>500+ people</q-item-section>
              </q-item>
              <q-item class="row content-center justify-center">
                <q-item-section class="col-12">Your Email</q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-item>
      </q-card-section>
      <q-card-section class="columnContainer row ">
        <q-item class="col-12" q-pa-sm>
          <q-list bordered separator class="row col-12 bg-secondary text-white">
            <q-item style="height: 80px;" class="col-12">
              <q-item-section class="space-around">
                <h5>{{ $t('require_download_permissions') }}</h5>
              </q-item-section>
              <q-item-section side>
                <q-btn color="white text-black" @click="openRequestDialog">
                  {{ $t('make_request') }}
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-item>
      </q-card-section>
      <q-card-section class="columnContainer row">
        <q-item class="col-12" q-pa-sm>
          <q-list bordered separator class="row col-12">
            <q-item style="height: 80px;" class="col-12">
              <q-item-section class="space-around">
                <h5>{{ $t('feedback') }}</h5>
              </q-item-section>
              <q-item-section side>
                <q-btn color="teal text-white" @click="openFeedbackDialog">
                  {{ $t('leave_comment') }}
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-item>
      </q-card-section>
      <q-card-section class="columnContainer row">
        <q-item class="col-12" q-pa-sm>
          <q-list bordered separator class="row col-12 bg-secondary text-white">
            <q-item style="height: 80px;" class="col-12">
              <q-item-section class="space-around">
                <h5>{{ $t('want_new_password') }}</h5>
              </q-item-section>
              <q-item-section side>
                <q-btn color="white text-black" @click="openNewPasswordForm">
                  {{ $t('new_password') }}
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-item>
      </q-card-section>
    </q-card>
    <NewPassworDialog></NewPassworDialog>
    <TextAreaDialog :title='$t("request_download_permission")' :button-text='$t("send_request")'
      :type='EVENT_KEYS.DATA_DOWNLOAD_REQUEST'></TextAreaDialog>
    <TextAreaDialog :title='$t("what_you_think")' :button-text='$t("send_comment")' :type='EVENT_KEYS.LEAVE_FEEDBACK'>
    </TextAreaDialog>
  </div>
</template>
<script setup>
import { ref, inject, onMounted } from 'vue'
import useQuery from 'src/compositionFunctions/useQuery';
import NewPassworDialog from 'src/components/NewPassworDialog.vue';
import TextAreaDialog from 'src/components/TextAreaDialog.vue';
import { EVENT_KEYS } from 'src/utils/eventKeys';
const bus = inject('bus')

function openRequestDialog() {
  bus.emit(EVENT_KEYS.DATA_DOWNLOAD_REQUEST)
}

function openFeedbackDialog() {
  bus.emit(EVENT_KEYS.LEAVE_FEEDBACK)
}

function openNewPasswordForm() {
  bus.emit(EVENT_KEYS.PASSWORD_CHANGE)
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
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.item-small {
  flex-grow: 2;
  flex-shrink: 0;
}

.item-medium {
  flex-grow: 3;
  flex-shrink: 0;

}
</style>
