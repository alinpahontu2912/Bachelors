<template>
  <div class="fit column" style="padding-top: 0px !important">
    <div class="row q-pa-md content-center align-center justify-center">
      <text class="q-pa-md">Legend</text>
      <div class="row col-2 q-pa-md content-center justify-evenly" :class="click ? 'countries' : 'euAverage'">
        <q-tooltip class="bg-grey text-body2">
          {{ click ? `${min} - ${max}` : `${min} - ${average} - ${max}` }}
        </q-tooltip>
      </div>
      <div class="rowContainer row ">
        <div class="row col-2 q-pa-md content-center justify-evenly">
          <q-select color="teal" filled v-model="yearOption" label="AN" :options="yearOptions" style="width: 250px"
            behavior="menu" />
        </div>
        <div class="row col-2 q-pa-md content-center justify-evenly">
          <q-select color="teal" filled v-model="sexOption" label="SEX" :options="sexOptions" style="width: 250px"
            behavior="menu" />
        </div>
        <div class="row col-2 q-pa-md content-center justify-evenly">
          <q-select color="teal" filled v-model="ageOption" label="VARSTA" :options="ageOptions" style="width: 250px"
            behavior="menu" />
        </div>
        <div class="row col-2 q-pa-md content-center justify-evenly">
          <q-select color="teal" filled v-model="educationOption" label="EDUCATIE" :options="educatonOptions"
            style="width: 250px" behavior="menu" />
        </div>
        <div class="row col-2 q-pa-md content-center justify-evenly">
          <q-select color="teal" filled v-model="compareOption" label="COMPARATIE" :options="compareOptions"
            style="width: 250px" behavior="menu" />
        </div>
        <div class="row col-2 q-pa-md content-center justify-evenly">
          <q-btn class="q-pa-md fit" color="teal" @click="refresh">
            Reload
          </q-btn>
        </div>
      </div>
    </div>
    <div id="mapContainer" class="row" />
  </div>
</template>

<script setup>
import { onMounted, onBeforeMount, ref } from 'vue'
import { europeGeoJson } from 'src/assets/EuropeGeoJson'
import 'leaflet/dist/leaflet.css'
import useQuery from 'src/compositionFunctions/useQuery'
import L from 'leaflet'
import * as d3 from 'd3'
import { euAverage } from 'src/utils/euAverage.js'
let map = null
const color = ref(d3.scaleLinear().range(['red', 'green']))
const euLessColor = ref(d3.scaleLinear().range(['red', 'white']))
const euMoreColor = ref(d3.scaleLinear().range(['white', 'blue']))
const countryValue = ref(null)
const sexOptions = ref(['T'])
const ageOptions = ref(['Y15-24'])
const educatonOptions = ref(['0-2'])
const yearOptions = ref(['2020-Q4', '2020-Q3', '2020-Q2', '2020-Q1'])
const yearOption = ref('2020-Q4')
const ageOption = ref('Y15-24')
const sexOption = ref('T')
const educationOption = ref('0-2')
const compareOptions = ref(['TARA', 'MEDIA UE'])
const compareOption = ref('TARA')
const min = ref(100)
const max = ref(0)
const average = ref(0)
const click = ref(true)
const { getEuropeanData } = useQuery()

function createDataSets(queryResponse) {

  countryValue.value = new Map()
  min.value = 100
  max.value = 0
  queryResponse.forEach(element => {
    console.log(element.countryCodeNavigation.name)
    min.value = element.val < min.value ? element.val : min.value
    max.value = element.val > max.value ? element.val : max.value
    countryValue.value.set(element.countryCodeNavigation.name, element.val)
  })
  color.value.domain([min.value, max.value])
  average.value = countryValue.value.get('European Union - 27 countries (from 2020)')
}

function getAgeId(age) {
  switch (age) {
    case 'Y15-24':
      return 1
    case 'Y25-54':
      return 2
    default:
      return 3
  }
}

function getEducationId(education) {
  switch (education) {
    case '0-2':
      return 1
    case '3-4':
      return 2
    default:
      return 3
  }
}

onMounted(async () => {
  const test = await getEuropeanData(yearOption.value, sexOption.value, getAgeId(ageOption.value), getEducationId(educationOption.value), 'barChart');
  createDataSets(test)
  createMapLayer()
})
onBeforeMount(() => {
  if (map) {
    map.remove()
  }
})

const createMapLayer = () => {
  function getColor(d) {

    if (compareOption.value == 'TARA') {
      return countryValue.value.has(d.NAME) ? color.value(countryValue.value.get(d.NAME)) : 'black'
    } else {
      return !countryValue.value.has(d.NAME) ? 'black' : countryValue.value.get(d.NAME) > average.value ?
        euMoreColor.value(countryValue.value.get(d.NAME)) : euLessColor.value(countryValue.value.get(d.NAME))
    }
  }
  function style(feature) {
    return {
      fillColor: getColor(feature.properties),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    layer.bringToFront();
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }

  map = L.map('mapContainer').setView([54.6, 15.2], 4);
  var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  var geojson = L.geoJson(europeGeoJson, {
    style: style,
    onEachFeature: onEachFeature
  }).bindTooltip(function (layer) {
    return countryValue.value.has(layer.feature.properties.NAME) ? layer.feature.properties.NAME + ": " + countryValue.value.get(layer.feature.properties.NAME) : layer.feature.properties.NAME + ': NO DATA'
  }, { permanent: false, opacity: 1 }
  ).addTo(map);
}

async function refresh() {
  const test = await getEuropeanData(yearOption.value, sexOption.value, getAgeId(ageOption.value), getEducationId(educationOption.value), 'barChart');
  createDataSets(test)
  map.remove()
  if (compareOption.value === 'TARA') {
    color.value.range(['red', 'green'])
    click.value = true
  } else {
    click.value = false
    euLessColor.value.domain([min.value,])
    euMoreColor.value.domain([countryValue.value.get('European Union - 27 countries (from 2020)'), max.value])
  }

  createMapLayer()
}

</script>

<style scoped>
#mapContainer {
  height: 70vh;
}

.countries {
  background-image: linear-gradient(to right, red, green)
}

.euAverage {
  background-image: linear-gradient(to right, red, white, green)
}
</style>
