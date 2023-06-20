<template>
  <q-input :type="isPwd ? 'password' : 'text'" rounded :outlined="outlined" v-model="password" :placeholder="placeholder"
    class="item-medium q-pa-md col-10" :autocomplete="false" :standout="standout" color="teal" :rules="rules"
    :lazy-rules="true">
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
import { ref } from 'vue'

const props = defineProps({
  placeholder: String,
  icon: String,
  tooltip: String,
  standout: String,
  isVisible: Boolean,
  rules: Array,
  outlined: { type: Boolean, default: true }
})

const isPwd = ref(!props.isVisible)
const password = ref('')

</script>
