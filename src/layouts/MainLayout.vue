<template>
  <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders">
    <q-header elevated class="bg-teal">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>Header</q-toolbar-title>
        <q-select v-model="locale" :options="localeOptions" :label="$t('language_select')" dense borderless emit-value
          map-options options-dense style="min-width: 100px" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" :width="300" :breakpoint="300" overlay bordered class="bg-grey-3">
      <q-scroll-area class="fit">
        <q-list>

          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
              <q-badge color="red" rounded floating>2</q-badge>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n({ useScope: 'global' })
const localeOptions = ref([
  { value: 'en-US', label: 'English' },
  { value: 'ro', label: 'Romana' }
])

const drawer = ref(true)

const menuList = [
  {
    icon: 'inbox',
    label: 'Inbox',
    separator: false
  },
  {
    icon: 'send',
    label: 'Outbox',
    separator: true
  },
  {
    icon: 'delete',
    label: 'Trash',
    separator: false
  },
  {
    icon: 'error',
    label: 'Spam',
    separator: true
  },
  {
    icon: 'settings',
    label: 'Settings',
    separator: false
  },
  {
    icon: 'feedback',
    label: 'Send Feedback',
    separator: false
  },
  {
    icon: 'help',
    iconColor: 'primary',
    label: 'Help',
    separator: false
  }
]

</script>
