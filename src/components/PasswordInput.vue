<template>
  <q-input :type="isPwd ? 'password' : 'text'" rounded :outlined="outlined" v-model="password" :placeholder="placeholder"
    class="item-medium q-pa-md col-10" :autocomplete="false" :standout="standout" color="teal">
    <template v-slot:prepend>
      <q-icon :name="icon" />
    </template>
    <template v-slot:append v-if="!isVisible">
      <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
    </template>
    <q-tooltip anchor="top middle" self="bottom middle">
      {{ tooltip }}
    </q-tooltip>
  </q-input>
</template>
<script setup>
import { ref, defineProps } from 'vue'
const isPwd = ref(!props.isVisible)
const password = ref('')

const props = defineProps({
  placeholder: String,
  icon: String,
  tooltip: String,
  standout: String,
  isVisible: Boolean,
  outlined: { type: Boolean, default: true }
})

</script>
