<template>
  <q-layout view="hHh LpR lff" class="shadow-2 rounded-borders">
    <q-header class="bg-teal">
      <q-toolbar>
        <q-toolbar-title>{{ $t('app_name') }}</q-toolbar-title>
        <q-space></q-space>
        <q-select v-model="locale" :options="localeOptions" :label="$t('language_select')" dense borderless emit-value
          map-options options-dense style="min-width: 100px" />
        <q-btn :ripple="{ center: true, color: 'white' }" flat @click="$router.push('/login')">{{ $t('start_now') }}
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
const { locale } = useI18n({ useScope: 'global' })
const localeOptions = ref([
  { value: 'en-US', label: 'English' },
  { value: 'ro', label: 'Romana' }
])
const router = useRoute()
const currentRouteName = computed(() => route.path)
console.log(useRoute().fullPath)
</script>

