<template>
  <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders">
    <q-header elevated class="bg-teal">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>{{ $t('menu') }}</q-toolbar-title>
        <q-select v-model="locale" :options="localeOptions" :label="$t('language_select')" dense borderless emit-value
          map-options options-dense style="min-width: 100px" />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="drawer" :width="250" :breakpoint="300" overlay bordered class="bg-grey-3">
      <q-scroll-area class="row fit justify-evenly">
        <q-btn :label="$t('home')" icon="home" flat style="width: 250px" class="col-12 q-pa-md">
          <router-link exact :to="{ name: 'start' }" class="absolute full-width full-height"></router-link>
        </q-btn>
        <q-separator />
        <q-btn-dropdown :label="$t('europe')" icon="public" flat style="width: 250px" class="col-12 q-pa-md">
          <q-list>
            <q-item v-for="(menuItem, index) in europePages" clickable v-ripple :key="index" :to="{ name: menuItem.to }">
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ $t(menuItem.label) }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-separator />
        <q-btn-dropdown label="Romania" icon="pin_drop" flat style="width: 250px" class="col-12 q-pa-md">
          <q-list>
            <q-item v-for="(menuItem, index) in romaniaPages" clickable v-ripple :key="index" :to="{ name: menuItem.to }">
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ $t(menuItem.label) }}
              </q-item-section>
            </q-item>

          </q-list>
        </q-btn-dropdown>
        <q-separator />
        <div v-if="isAdmin">
          <template v-for="(menuItem, index) in adminPages" :key="index">
            <q-btn :label="$t(menuItem.label)" :icon="menuItem.icon" flat :to="{ name: menuItem.to }" style="width: 250px"
              class="col-12 q-pa-md">
            </q-btn>
            <q-separator />
          </template>
        </div>
        <q-btn :label="$t('announcements')" icon="campaign" flat style="width: 250px" class="col-12 q-pa-md">
          <router-link exact :to="{ name: 'announcements' }" class="absolute full-width full-height"></router-link>
        </q-btn>
        <q-separator />
        <q-btn :label="$t('settings')" icon="settings" flat style="width: 250px" class="col-12 q-pa-md">
          <router-link exact :to="{ name: 'account_settings' }" class="absolute full-width full-height"></router-link>
        </q-btn>
        <q-separator />

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
import { userStore } from 'src/stores/userStore'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { isUserAdmin } = userStore()

const { locale } = useI18n({ useScope: 'global' })
const localeOptions = ref([
  { value: 'en-US', label: 'English' },
  { value: 'ro', label: 'Romana' }
])


const drawer = ref(true)
const isAdmin = computed(() => { return isUserAdmin() })

const europePages = [
  {
    icon: 'map',
    label: 'map',
    separator: false,
    to: 'europe_map'
  },
  {
    icon: 'bar_chart',
    label: 'bar_chart',
    separator: true,
    to: 'europe_barChart'
  },
  {
    icon: 'show_chart',
    label: 'line_chart',
    separator: false,
    to: 'europe_lineGraph'
  },
  {
    icon: 'table_chart',
    label: 'table_chart',
    separator: false,
    to: 'europe_table'
  }
]

const romaniaPages = [
  {
    icon: 'map',
    label: 'map',
    separator: false,
    to: 'romania_map'
  },
  {
    icon: 'bar_chart',
    label: 'bar_chart',
    separator: true,
    to: 'romania_countyBarChart'
  },
  {
    icon: 'show_chart',
    label: 'line_chart',
    separator: false,
    to: 'romania_lineGraph'
  },
  {
    icon: 'data_exploration',
    label: 'report_generator',
    separator: false,
    to: 'romania_reportGenerator'
  },
  {
    icon: 'table_chart',
    label: 'county_table_data',
    separator: false,
    to: 'romania_tableCounty'
  },
  {
    icon: 'table_chart',
    label: 'region_data_table',
    separator: false,
    to: 'romania_tableResidency'
  }
]

const adminPages = [
  {
    icon: 'person',
    label: 'admin_panel',
    separator: false,
    to: 'admin'
  },
  {
    icon: 'inbox',
    label: 'requests_page',
    separator: true,
    to: 'requests'
  },
  {
    icon: 'mail',
    label: 'messages_page',
    separator: true,
    to: 'contact'
  },
]

</script>
