<template>
  <div class="row content-center align-center justify-center q-py-sm" style="padding-top: 0% !important;">
    <div class='row col-4 q-px-md content-center justify-evenly' :class="click ? 'judete' : 'medieUe'">
      <text class="q-pa-md">LEGENDA</text>
      <q-tooltip class="bg-grey text-body2">
        {{ click ? `${min} - ${max}` : `${min} - ${euAverage.get(options.yearOption)[options.sexOption]} - ${max}` }}
      </q-tooltip>
    </div>
    <div class="row col-2 q-px-md content-center justify-evenly">
      <q-select color="teal" filled v-model="options.compareOption" label="COMPARATIE" :options="compareOptions"
        style="width: 250px" behavior="menu" />
    </div>
    <div class="row col-2 q-px-md content-center justify-evenly">
      <q-select color="teal" filled v-model="options.sexOption" label="SEX" :options="sexOptions" style="width: 250px"
        behavior="menu" />
    </div>
    <div class="row col-2 q-px-md content-center justify-evenly">
      <q-select color="teal" filled v-model="options.yearOption" label="AN" :options="yearOptions" style="width: 250px"
        behavior="menu" />
    </div>
  </div>
  <div id="mapContainer" class="row" />
</template>

<script setup>
import { onMounted, onBeforeMount, ref, watch } from 'vue'
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
const sexOptions = ref(['F', 'M', 'T'])
const yearOptions = ref([])
const compareOptions = ref(['JUDETE', 'MEDIA UE'])

const options = ref({
  sexOption: 'M',
  yearOption: '2021',
  compareOption: 'JUDETE'
})

const click = ref(true)
const min = ref(100)
const max = ref(0)
const { getRegionalData, getAvailableTime } = useQuery()

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
  yearOptions.value = (await getAvailableTime('regional')).sort()
  const response = await getRegionalData(options.value.yearOption, '', options.value.sexOption, '', 'barChart');
  createDataSets(response)
  createMapLayer()
})
onBeforeMount(() => {
  if (map) {
    map.remove()
  }
})

const createMapLayer = () => {
  function getColor(d) {
    if (options.value.compareOption == 'JUDETE') {
      return color.value(countyValue.value.get(d.shapeName))
    } else {
      return countyValue.value.get(d.shapeName) > euAverage.get(options.value.yearOption)[options.value.sexOption] ?
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
    return layer.feature.properties.shapeName + ": " + countyValue.value.get(layer.feature.properties.shapeName); //merely sets the tooltip text
  }, { permanent: false, opacity: 1 }
  ).addTo(map);
}

watch(() => options.value.sexOption, async () => {
  refresh()
})

watch(() => options.value.yearOption, async () => {
  refresh()
})

watch(() => options.value.compareOption, async () => {
  refresh()
})


async function refresh() {
  const test = await getRegionalData(options.value.yearOption, '', options.value.sexOption, '', 'barChart');
  createDataSets(test)
  if (options.value.compareOption === 'JUDETE') {
    color.value.range(['red', 'green'])
    click.value = true
  } else {
    click.value = false
    euLessColor.value.domain([min.value, euAverage.get(options.value.yearOption)[options.value.sexOption]])
    euMoreColor.value.domain([euAverage.get(options.value.yearOption)[options.value.sexOption], max.value])
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
