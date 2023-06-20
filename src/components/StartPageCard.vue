<template>
  <div class="q-pa-lg col-4 col-md-3 col-xs-8">
    <q-card class="q-pa-sm">
      <q-card-section>
        <div class="text-h6 q-mb-xs" style="text-align: center">{{ description }}</div>
        <div class="row no-wrap items-center"></div>
      </q-card-section>
      <img loading="lazy" v-if="id == 1" src="../assets/liniar.png" style="height: 300px; width: 300px;">
      <img loading="lazy" v-if="id == 2" src="../assets/bara.png" style="height: 300px; width: 300px;">
      <img loading="lazy" v-if="id == 3" src="../assets/tabel.png" style="height: 300px; width: 300px;">
    </q-card>
  </div>
</template>
<script setup>
const props = defineProps({
  description: String,
  id: Number
})
</script>

