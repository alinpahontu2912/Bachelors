<template>
  <div class="fit column" style="padding-top: 0px !important">
    <div class="row q-pa-md content-center align-center justify-center">
      <div class='col-4' :class="click ? 'judete' : 'medieUe'">
        <q-tooltip class="bg-grey text-body2">
          {{ click ? `${min} - ${max}` : `${min} - ${euAverage.get(yearOption)[sexOption]} - ${max}` }}
        </q-tooltip>
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="compareOption" label="COMPARATIE" :options="compareOptions"
          style="width: 250px" behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="sexOption" label="SEX" :options="sexOptions" style="width: 250px"
          behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-select color="teal" filled v-model="yearOption" label="AN" :options="yearOptions" style="width: 250px"
          behavior="menu" />
      </div>
      <div class="row col-2 q-pa-md content-center justify-evenly">
        <q-btn class="q-pa-md fit" color="teal" @click="refresh" label="REFRESH" />
      </div>
    </div>
    <div id="mapContainer" class="row" />
  </div>
</template>

<script setup>
import { onMounted, onBeforeMount, ref } from 'vue'
import { romaniaGeoJson } from 'src/assets/RomaniaGeojson'
import 'leaflet/dist/leaflet.css'
import useQuery from 'src/compositionFunctions/useQuery'
import L from 'leaflet'
import * as d3 from 'd3'
import { euAverage } from 'src/utils/euAverage.js'
let map = null
const color = ref(d3.scaleLinear().range(['red', 'green']))
const euLessColor = ref(d3.scaleLinear().range(['red', 'white']))
const euMoreColor = ref(d3.scaleLinear().range(['white', 'blue']))
const regions = ref([])
const countyValue = ref(new Map())
const sexOptions = ref(['F', 'M'])
const sexOption = ref('M')
const yearOption = ref('2021')
const yearOptions = ref(['2021', '2020', '2019', '2018', '2017', '2016', '2015'])
const compareOptions = ref(['JUDETE', 'MEDIA UE'])
const compareOption = ref('JUDETE')
const click = ref(true)
const min = ref(100)
const max = ref(0)
const { getRegionalData } = useQuery()

function createDataSets(queryResponse) {
  regions.value = queryResponse.map(x => x.region)
  for (let i = 0; i < queryResponse.length; i++) {
    min.value = queryResponse[i].val < min.value ? queryResponse[i].val : min.value
    max.value = queryResponse[i].val > max.value ? queryResponse[i].val : max.value
    countyValue.value.set(queryResponse[i].region, queryResponse[i].val)
  }
  color.value.domain([min.value, max.value])
}

onMounted(async () => {
  const test = await getRegionalData(yearOption.value, sexOption.value, '', 'barChart');
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
    if (compareOption.value == 'JUDETE') {
      return color.value(countyValue.value.get(d.shapeName))
    } else {
      return countyValue.value.get(d.shapeName) > euAverage.get(yearOption.value)[sexOption.value] ?
        euMoreColor.value(countyValue.value.get(d.shapeName)) : euLessColor.value(countyValue.value.get(d.shapeName))
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

  map = L.map('mapContainer').setView([45.9, 25], 7);
  var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  var geojson = L.geoJson(romaniaGeoJson, {
    style: style,
    onEachFeature: onEachFeature
  }).bindTooltip(function (layer) {
    return layer.feature.properties.shapeName + " " + countyValue.value.get(layer.feature.properties.shapeName); //merely sets the tooltip text
  }, { permanent: false, opacity: 1 }
  ).addTo(map);
}

async function refresh() {
  const test = await getRegionalData(yearOption.value, sexOption.value, '', 'barChart');
  createDataSets(test)
  if (compareOption.value === 'JUDETE') {
    color.value.range(['red', 'green'])
    click.value = true
  } else {
    click.value = false
    euLessColor.value.domain([min.value, euAverage.get(yearOption.value)[sexOption.value]])
    euMoreColor.value.domain([euAverage.get(yearOption.value)[sexOption.value], max.value])
  }
  map.remove()
  createMapLayer()
}

</script>

<style scoped>
#mapContainer {
  height: 75vh;
}

.judete {
  background-image: linear-gradient(to right, red, green)
}

.medieUe {
  background-image: linear-gradient(to right, red, white, blue)
}
</style>
