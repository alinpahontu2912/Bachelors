<template>
  <div class="fit row wrap justify-center items-center content-center">
    <div class="row col-12 q-pa-lg">
      <text class="col-12 text-h3 text-italic q-pa-sm" style="text-align: center">{{ $t('motto') }}</text>
      <text class="col-12 text-h4 text-italic" style="text-align: center;">{{ $t('title') }}</text>
    </div>
    <div class="row col-12 q-pa-lg justify-around items-center content-center">
      <StartPageCard :description="$t('observationDescription')" />
      <StartPageCard :description="$t('heatmapDescription')" />
      <StartPageCard :description="$t('downloadDescription')" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StartPageCard from 'src/components/StartPageCard.vue';
const test = ref("../assets/testgif.gif")
</script>
