<template>
  <div class="q-pa-lg col-4 col-md-3 col-xs-8">
    <q-card class="q-pa-sm">
      <q-card-section>
        <div class="text-h6 q-mb-xs" style="text-align: center">{{ description }}</div>
        <div class="row no-wrap items-center"></div>
      </q-card-section>
      <img src="../assets/testgif.gif">
    </q-card>
  </div>
</template>
<script setup>
const props = defineProps({
  description: String,
  count: Number,
  image: String
})
</script>

