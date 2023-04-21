<!-- <template>
  <div>
    <q-btn @click="updateData" />
  </div>
  <div>
    <svg v-if="!isLoading" id="graph" style="width: 520; height: 520;">
      <g class="graphBody">
        <g class="line" v-for="(line, index) in lines" :key="index">
          <path :d="line.path" :stroke="line.color" fill="none" id="path" />
        </g>
        <g class="x-axis" />
        <g class="y-axis" />
        <g class="circle" v-for="(circlePoint, index) in circles" :key="index">
          <circle :cx="circlePoint.cx" :cy="circlePoint.cy" r="5" :fill="circlePoint.fill">
            <title>{{ circlePoint.title }}</title>
          </circle>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as d3 from 'd3'
import { computed } from 'vue';

const isLoading = ref(false)
const initialData = ref([
  { x: 0, y: 5, },
  { x: 1, y: 9 },
  { x: 2, y: 7 },
  { x: 3, y: 5 },
  { x: 4, y: 3 }
])

const initialData2 = [
  { x: 0, y: 3 },
  { x: 1, y: 5 },
  { x: 2, y: 4 },
  { x: 3, y: 7 },
  { x: 4, y: 8 }
]
const margin = 60
const width = 1400
const height = 400


const lines = ref([])
const circles = ref([])
const xScale = ref(d3.scaleLinear().range([0, width - margin]).domain([0, 4]).nice())
const yScale = ref(d3.scaleLinear().range([height - margin, 0]).domain([3, 10]).nice())
const line = ref(d3.line().x((d) => xScale.value(d.x)).y((d) => yScale.value(d.y)))

const d = computed(() => {
  return line.value
})

function drawGraph() {
  // const transition = d3.transition()
  //   .duration(1000)
  const svg = d3.select('#graph')
    .style('width', width + margin * 2)
    .style("height", height + margin * 2)
    .select('.graphBody')
    .attr('transform', `translate(${margin},${margin})`)
  const xAxis = d3.select('.x-axis').attr('transform', `translate(0,${height - margin})`)
  const yAxis = d3.select('.y-axis')

  xAxis.call(d3.axisBottom(xScale.value));
  yAxis.call(d3.axisLeft(yScale.value));

  d3.selectAll(".x-axis .tick text")
    .attr("transform", "rotate(-15)");

  // d3.selectAll('path')
  //   .data(lines.value)
  //   .transition(transition)
  //   .attr('stroke-dasharray', 10)
  //   .attr('d', d => d.path)
  //   .attr('stroke-dasharray', 0)

}

onMounted(() => {

  lines.value.push({ path: line.value(initialData.value), color: 'blue' })
  lines.value.push({ path: line.value(initialData2), color: 'red' })
  for (let i = 0; i < initialData.value.length; i++) {
    circles.value.push({ cx: xScale.value(initialData.value[i].x), cy: yScale.value(initialData.value[i].y), fill: 'blue', title: 'Test' })
    circles.value.push({ cx: xScale.value(initialData2[i].x), cy: yScale.value(initialData2[i].y), fill: 'red', title: 'Test' })
  }
  drawGraph()

  // this.data = this.initialData;

  // lines.value = this.data.map(series => {
  //   const lineGenerator = d3.line()
  //     .x(d => xScale.value(d.x))
  //     .y(d => yScale.value(d.y));

  //   return {
  //     data: series.data,
  //     path: lineGenerator(series.data.map(d => [d.x, d.y])),
  //     color: series.color
  //   }
  // });
})



function updateData() {
  console.log('click update')


  const transition = d3.transition()
    .duration(500)

  d3.selectAll('path')
    .data(lines.value)
    .transition(transition)
    .attr('stroke-dasharray', 10)
    .attr('d', d => d.path)
    .attr('stroke-dasharray', 0)


  initialData.value = [
    { x: 0, y: 3, },
    { x: 1, y: 5 },
    { x: 2, y: 7 },
    { x: 4, y: 12 }
  ]
  const testData = [
    { x: 0, y: 4, },
    { x: 1, y: 2 },
    { x: 2, y: 9 },
    { x: 4, y: 6 }
  ]

  // const xScale = ref(d3.scaleLinear().range([0, width - margin]).domain(d3.extent([0, d3.max(initialData.value.x)])).nice())
  // const yScale = ref(d3.scaleLinear().range([height - margin, 0]).domain([0, d3.max(initialData.value, (d) => d3.max(d.y))]).nice())
  lines.value = []
  lines.value = [{ path: line.value(initialData.value), color: 'blue' }, { path: line.value(testData), color: 'red' }]


  // lines.value.forEach((line, index) => {
  //   d3.select('#graph')
  //     .select(`#line-${index}`)
  //     .transition(transition)
  //     .attr('stroke-dashoffset', line.length)
  //     .attr('stroke-dasharray', line.length)
  //     .attr('stroke', this.data[index].color)
  //     .attr('d', line.path)
  //     .transition(transition)
  //     .attr('stroke-dashoffset', 0);
  // });



  console.log(initialData)
}

</script>
<style scoped lang="scss">
path {
  transition: all 5000ms ease;
}

circle {
  transition: 5000ms ease;
}
</style> -->
<!-- <template>
  <q-btn @click="updateData">Test</q-btn>
  <div>
    <Doughnut :data="data" :options="options" ref="test" v-if="!click" />
  </div>
</template>
<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { ref, computed } from 'vue';
ChartJS.register(ArcElement, Tooltip, Legend)

const test = ref(null)
const click = ref(false)
const ceva = ref([40, 50, 20, 80])
const reactiveData = ref({
  labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [2, 4, 5, 18]
    }
  ]
})


const data = computed(() => {
  return reactiveData.value
})

const options = ref({
  responsive: true,
  maintainAspectRatio: false
})

function updateData() {
  console.log('asdfasfd')
  data.value.datasets[0].data.value = [10, 30, 40, 90]
  test.value.chart.update()

}

</script> -->

<template>
  <q-btn type="button" @click="shuffleData">Add data</q-btn>
  <q-btn type="button" @click="resetZoom">Add data</q-btn>

  <LineChart :cfg="testData" :chartData="testData" :options="options" ref="lineChart" />
</template>

<script>
import { defineComponent } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import { computed, ref } from 'vue';
import { mode } from 'd3-array';

Chart.register(...registerables);
Chart.register(zoomPlugin);



export default defineComponent({


  components: { LineChart },
  setup() {
    const initialData = ref([{ x: '1', y: 20 }, { x: '3', y: 10 }, { x: '4', y: 10 }, { x: '5', y: 20 }, { x: '6', y: null }, { x: '7', y: 10 }, { x: '8', y: 10 }, { x: '9', y: 20 }, { x: '10', y: null }, { x: '11', y: 10 }, { x: '12', y: 10 }, { x: '13', y: 20 }, { x: '14', y: null }, { x: '15', y: 10 }, { x: '16', y: 10 }])//[30, 40, 60, 70, 5])
    const lineChart = ref()
    const options = ref({
      parsing: {
        xAxisKey: 'x',
        yAxisKey: 'y'
      },
      plugins: {
        // zoom: {
        //   // pan: {
        //   //   enabled: true,
        //   //   mode: 'x',
        //   //   threshold: 10,
        //   //   speed: 0.2,
        //   //   modifierKey: 'shift'
        //   // },
        //   zoom: {
        //     wheel: {
        //       enabled: true,
        //       speed: 0.2

        //     }
        //   }
        // },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pan: {
              enabled: true
            },
            drag: {
              enabled: true,
              mode: 'x'
            },
            mode: 'y',
          }
        }
      }
    })
    const testData = computed(() => ({
      type: 'line',

      datasets: [{
        label: 'Romania',
        data: initialData.value,
        spanGaps: true
      }]
      // labels: ['1', '2', '3', '4', '5'],
      // datasets: [
      //   {
      //     label: 'Romania',
      //     data: initialData.value,
      //     backgroundColor: ['#A5C8ED'],
      //     hidden: false,
      //   },
      //   {
      //     label: 'Bulgaria',
      //     data: [20, 10, 60, 90, 45],
      //     backgroundColor: ['#77CEFF'],

      //   },
      // ],
    }));

    return { testData, initialData, options, lineChart };
  },

  methods: {

    shuffleData() {
      this.initialData = [20, 10, 40, 80, 51]
    },

    resetZoom() {
      this.$refs.lineChart.chart.resetZoom()
    }
  }
});
</script>

<!-- <template>
  <q-btn type="button" @click="shuffleData">Add data</q-btn>

  <BarChart :chartData="testData" :options="options" />
</template>

<script>
import { defineComponent } from 'vue';
import { BarChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import { computed, ref } from 'vue';
Chart.register(...registerables);
Chart.register(zoomPlugin);
export default defineComponent({
  components: { BarChart },
  setup() {
    const initialData = ref([30, 40, 60, 70, 5])
    const options = ref({
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true
            },
            mode: 'x',
          }
        }
      }
    })
    const testData = computed(() => ({
      labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
      datasets: [
        {
          data: initialData.value,
          backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
        },
        {
          data: [13, 45, 23, 56, 12],
          backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
        }
      ],
    }));
    return { testData, initialData, options };
  },
  methods: {
    shuffleData() {
      this.initialData = [20, 10, 40, 80, 51]
    }
  }
});
</script> -->
