<template>
  <div class="col-5 row q-px-md">
    <q-card class="row bg-secondary justify-center text-white" style="height: 600px">
      <q-card-section class="rowContainer col-12">
        <div class="text-h4 text-bold" style="text-align: center;">{{ $t(title) }}</div>
      </q-card-section>
      <q-card-section class="rowContainer col-12">
        <div class="text-h3 text-white text-center q-pa-xl">{{ $t(middleText) }}</div>
      </q-card-section>
      <q-card-section class="rowContainer col-8">
        <q-form class="row content-center justify-center align-center item-medium col-8">
          <q-btn rounded outlined unelevated size="md" class="q-pa-md col-12 item-medium bg-white text-black"
            :label="$t(buttonName)" @click=props.function />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
const props = defineProps({
  title: String,
  middleText: String,
  buttonName: String,
  function: Object
})
</script>
