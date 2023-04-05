<template>
  <div>
    <svg id="graph">
      <g class="graphBody">
        <g class="line" v-for="(line, index) in lines" :key="index">
          <path :d="line.path" :stroke="line.color" fill="none" />
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
const initialData = [
  { x: 0, y: 5, },
  { x: 1, y: 9 },
  { x: 2, y: 7 },
  { x: 3, y: 5 },
  { x: 4, y: 3 }
]

const initialData2 = [
  { x: 0, y: 3 },
  { x: 1, y: 5 },
  { x: 2, y: 4 },
  { x: 3, y: 7 },
  { x: 4, y: 8 }
]
const margin = 60
const width = screen.width * 0.75 - margin
const height = 560


const lines = ref([])
const circles = ref([])
const xScale = ref(d3.scaleLinear().range([0, width - margin]).domain([0, 4]).nice())
const yScale = ref(d3.scaleLinear().range([height - margin, 0]).domain([3, 10]).nice())
const line = ref(d3.line().x((d) => xScale.value(d.x)).y((d) => yScale.value(d.y)))

function drawGraph() {
  const svg = d3.select('#graph')
    .style('width', width)
    .style("height", height)
    .select('.graphBody')
    .attr('transform', `translate(${margin},${margin})`) //attr('viewBox', '0 0 750 750')
  const xAxis = d3.select('.x-axis').attr('transform', `translate(0,${height - margin})`)
  const yAxis = d3.select('.y-axis')

  xAxis.call(d3.axisBottom(xScale.value));
  yAxis.call(d3.axisLeft(yScale.value));

  d3.selectAll(".x-axis .tick text")
    .attr("transform", "rotate(-15)");
  lines.value.push({ path: line.value(initialData), color: 'blue' })
  lines.value.push({ path: line.value(initialData2), color: 'red' })
  for (let i = 0; i < initialData.length; i++) {
    circles.value.push({ cx: xScale.value(initialData[i].x), cy: yScale.value(initialData[i].y), fill: 'blue', title: 'Test' })
    circles.value.push({ cx: xScale.value(initialData2[i].x), cy: yScale.value(initialData2[i].y), fill: 'red', title: 'Test' })
  }
}

onMounted(() => {


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



</script>
