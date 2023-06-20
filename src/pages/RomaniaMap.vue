<template>
  <div class="row content-center align-center justify-center q-py-sm" style="padding-top: 0% !important;">
    <div class='row col-4 q-px-md content-center justify-evenly' :class="click ? 'judete' : 'medieUe'"
      style="height: 60px;">
      <text class="q-pa-md">{{ $t('legend') }}</text>
      <q-tooltip class="bg-grey text-body2">
        {{ click ? `${min} - ${max}` : `${min} - ${euAverage.get(options.yearOption)[options.sexOption]} - ${max}` }}
      </q-tooltip>
    </div>
    <div class="row col-2 q-px-md content-center justify-evenly">
      <q-select color="teal" filled v-model="options.sexOption" :label="$t('sex')" :options="sexOptions"
        style="width: 250px" behavior="menu" />
    </div>
    <div class="row col-2 q-px-md content-center justify-evenly">
      <q-select color="teal" filled v-model="options.yearOption" :label="$t('year')" :options="yearOptions"
        style="width: 250px" behavior="menu" />
    </div>
    <div class="row col-2 q-px-md content-center justify-evenly">
      <q-select color="teal" filled v-model="options.compareOption" :label="$t('comparison')" :options="compareOptions"
        style="width: 250px" behavior="menu" />
    </div>
  </div>
  <div id="mapContainer" class="row" />
</template>

<script setup>
import 'leaflet/dist/leaflet.css'
import useQuery from 'src/compositionFunctions/useQuery'
import L from 'leaflet'
import 'leaflet-easyprint'
import * as d3 from 'd3'
import { euAverage } from 'src/utils/euAverage.js'
import { userStore } from 'src/stores/userStore';
import { onMounted, onBeforeMount, ref, watch, computed } from 'vue'
import { romaniaGeoJson } from 'src/assets/RomaniaGeojson'

let map = null
const { canUserDownload } = userStore()
const canDownload = computed(() => canUserDownload())
const color = ref(d3.scaleLinear().range(['red', 'green']))
const euLessColor = ref(d3.scaleLinear().range(['red', 'white']))
const euMoreColor = ref(d3.scaleLinear().range(['white', 'blue']))
const regions = ref([])
const countyValue = ref(new Map())
const sexOptions = ref(['F', 'M', 'T'])
const yearOptions = ref([])
const compareOptions = ref(['NORMAL', 'EU AVG'])

const options = ref({
  sexOption: 'M',
  yearOption: '2021',
  compareOption: 'NORMAL'
})

const click = ref(true)
const min = ref(100)
const max = ref(0)
const { getRegionalData, getAvailableTime } = useQuery()

function createDataSets(queryResponse) {
  regions.value = queryResponse[0]
  for (let i = 0; i < queryResponse[1].length; i++) {
    min.value = queryResponse[1][i] < min.value ? queryResponse[1][i] : min.value
    max.value = queryResponse[1][i] > max.value ? queryResponse[1][i] : max.value
    countyValue.value.set(regions.value[i], queryResponse[1][i])
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
    if (options.value.compareOption == 'NORMAL') {
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
    return layer.feature.properties.shapeName + ": " + countyValue.value.get(layer.feature.properties.shapeName);
  }, { permanent: false, opacity: 1 }
  ).addTo(map);

  if (canDownload.value) {
    L.easyPrint({
      title: 'PRINT',
      position: 'topleft',
      sizeModes: ['A4Landscape'],
      hideControlContainer: false,
      hideClasses: ['leaflet-top leaflet-left']
    }).addTo(map);
  }

  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
      grades = click.value ? [min.value, max.value] : [min.value, euAverage.get(options.value.yearOption)[options.value.sexOption], max.value],
      colors = click.value ? [color.value(min.value), color.value(max.value)] : [euLessColor.value(min.value), 'white', euMoreColor.value(max.value)],
      labels = click.value ? ['MIN', 'MAX'] : ['MIN', 'EU-AVG', 'MAX']

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i class="q-pa-sm" style="width:80px !important; background:' + colors[i] + '"><strong>' + grades[i] + " " + labels[i] + '<strong></i> '
        + '<br>' + '<br>'
    }
    return div;
  };

  legend.addTo(map);
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
  min.value = 100
  max.value = 0
  const response = await getRegionalData(options.value.yearOption, '', options.value.sexOption, '', 'barChart');
  createDataSets(response)
  if (options.value.compareOption === 'NORMAL') {
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
@media print {

  html,
  body {
    display: none;
  }

}

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
