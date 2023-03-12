<template>
  <q-btn-dropdown label="Settings">
    <q-list>
      <q-item>
        <q-select v-model="locale" :options="localeOptions" :label="$t('language_select')" dense borderless emit-value
          map-options options-dense style="min-width: 100px" />
      </q-item>
      <q-item>
        <q-checkbox v-model="darkMode" label="Dark Mode" @update:model-value="toggleDarkMode" />
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { ref, inject } from 'vue';
const { locale } = useI18n({ useScope: 'global' })
const $q = useQuasar()
const localeOptions = ref([
  { value: 'en-US', label: 'English' },
  { value: 'ro', label: 'Romana' }
])
const darkMode = ref(true)
const bus = inject('bus')
function toggleDarkMode() {
  $q.dark.toggle()
  setDarkMode($q.dark.isActive)
}
</script>
