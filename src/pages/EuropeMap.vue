<template>
  <div class="fit column" style="padding-top:0px !important;">
    <div class="row q-px-md content-center align-center justify-center q-py-sm">
      <div class="rowContainer row ">
        <div class="row col-3 q-pa-md content-center justify-evenly" :class="click ? 'countries' : 'euAverage'"
          style="height: 60px;">
          <text class="q-px-md">{{ $t('legend') }}</text>
          <q-tooltip class="bg-grey text-body2">
            {{ click ? `${min} - ${max}` : `${min} - ${average} - ${max}` }}
          </q-tooltip>
        </div>
        <div class="row col-2 q-px-md content-center justify-evenly">
          <q-select color="teal" filled v-model="yearOption" :label="$t('year')" :options="yearOptions"
            style="width: 250px" behavior="menu" />
        </div>
        <div class="row col-1 q-px-md content-center justify-evenly">
          <q-select color="teal" filled v-model="sexOption" :label="$t('sex')" :options="sexOptions" style="width: 250px"
            behavior="menu" />
        </div>
        <div class="row col-2 q-px-md content-center justify-evenly">
          <q-select color="teal" filled v-model="ageOption" :label="$t('age')" :options="ageOptions" style="width: 250px"
            behavior="menu" />
        </div>
        <div class="row col-2 q-px-md content-center justify-evenly">
          <q-select color="teal" filled v-model="educationOption" :label="$t('education')" :options="educatonOptions"
            style="width: 250px" behavior="menu" />
        </div>
        <div class="row col-2 q-px-md content-center justify-evenly">
          <q-select color="teal" filled v-model="compareOption" :label="$t('comparison')" :options="compareOptions"
            style="width: 250px" behavior="menu" />
        </div>
      </div>
    </div>
    <div id="mapContainer" class="row" />
  </div>
</template>

<script setup>
import { onMounted, onBeforeMount, ref, watch, computed } from 'vue'
import { europeGeoJson } from 'src/assets/EuropeGeoJson'
import { userStore } from 'src/stores/userStore';
import utilities from 'src/utils/utilities.js'
import L from 'leaflet'
import * as d3 from 'd3'
import 'leaflet/dist/leaflet.css'
import 'leaflet-easyprint'
import useQuery from 'src/compositionFunctions/useQuery'
import { useI18n } from 'vue-i18n';


let map = null
const { canUserDownload } = userStore()
const { t } = useI18n()
const canDownload = computed(() => canUserDownload())
const color = ref(d3.scaleLinear().range(['red', 'green']))
const euLessColor = ref(d3.scaleLinear().range(['red', 'white']))
const euMoreColor = ref(d3.scaleLinear().range(['white', 'blue']))
const countryValue = ref(null)
const sexOptions = ref(['T', 'M', 'F'])
const ageOptions = ref(['15-24', '25-54', '55-64'])
const educatonOptions = computed(() => [t('max_sec'), t('max_high'), t('univ')])
const yearOptions = ref(['2020-Q4', '2020-Q3', '2020-Q2', '2020-Q1'])
const yearOption = ref('2020-Q4')
const ageOption = ref('15-24')
const sexOption = ref('T')
const educationOption = ref(t('max_sec'))
const compareOptions = ref(['NORMAL', 'EU AVG'])
const compareOption = ref('NORMAL')
const min = ref(100)
const max = ref(0)
const average = ref(0)
const click = ref(true)
const { getEuropeanData } = useQuery()
const { getAgeId, getEducationId } = utilities()

function createDataSets(queryResponse) {
  countryValue.value = new Map()
  min.value = 100
  max.value = 0
  countryValue.value = new Map(queryResponse.map((obj) => [obj.key, obj.value]));
  queryResponse.forEach(element => {
    min.value = element.value < min.value ? element.value : min.value
    max.value = element.value > max.value ? element.value : max.value
  })
  color.value.domain([min.value, max.value])
  average.value = countryValue.value.get('European Union - 27 countries (from 2020)')
}



onMounted(async () => {
  const test = await getEuropeanData(yearOption.value, '', sexOption.value, getAgeId(ageOption.value), getEducationId(educationOption.value), 'map');
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

    if (compareOption.value == 'NORMAL') {
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

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      grades = click.value ? [min.value, max.value] : [min.value, average.value, max.value],
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

async function refresh() {
  const test = await getEuropeanData(yearOption.value, '', sexOption.value, getAgeId(ageOption.value), getEducationId(educationOption.value), 'map');
  createDataSets(test)
  map.remove()
  if (compareOption.value === 'NORMAL') {
    color.value.range(['red', 'green'])
    click.value = true
  } else {
    click.value = false
    euLessColor.value.domain([min.value, countryValue.value.get('European Union - 27 countries (from 2020)')])
    euMoreColor.value.domain([countryValue.value.get('European Union - 27 countries (from 2020)'), max.value])
  }

  createMapLayer()
}

watch(() => yearOption.value, () => {
  refresh()
})
watch(() => sexOption.value, () => {
  refresh()
})
watch(() => compareOption.value, () => {
  refresh()
})
watch(() => ageOption.value, () => {
  refresh()
})
watch(() => educationOption.value, () => {
  refresh()
})

</script>

<style scoped>
#mapContainer {
  height: 75vh;
}

.countries {
  background-image: linear-gradient(to right, red, green)
}

.euAverage {
  background-image: linear-gradient(to right, red, white, blue)
}
</style>
