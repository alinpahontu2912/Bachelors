<!-- <template>
  <div>
    <div>
      <button @click="addDataPoint">Add Data Point</button>
    </div>
    <div id="container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import useQuery from '../compositionFunctions/useQuery'
import * as d3 from 'd3';
const { testData } = useQuery();
const colors = d3.schemeCategory10;
const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
const state = ref({
  data: [],
  filteredData: {},
  lines: []
});

function drawGraph() {
  const svg = d3
    .select('#container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .attr('class', 'main')

  const x = d3.scalePoint().range([0, 600])
  const y = d3.scaleLinear().range([height, 0]);

  x.domain(state.value.data.map(function (d) { return d.quarter; }));
  y.domain([0, d3.max(state.value.data, (d) => d.val)]);

  for (let i = 0; i <= 1; i++) {
    const line = d3
      .line()
      .x((d) => x(d.quarter))
      .y((d) => y(d.val));

    svg
      .append('g')
      .attr('class', 'test')
      .append('path')
      .datum(state.value.filteredData[i])
      .attr('fill', 'none')
      .attr('stroke', colors[i])
      .attr('stroke-width', 1.5)
      .attr('d', line);
  }

  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height + margin.top + margin.bottom})`)
    .call(d3.axisBottom(x));

  svg
    .append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y));
};

function updateGraph() {
  d3.select('#container').select('svg').selectAll('path').remove()
  const svg = d3.select('#container').select('svg').select('g').attr('class', 'main')
  const x = d3.scalePoint().range([0, 600])
  const y = d3.scaleLinear().range([400, 0]);

  x.domain(state.value.data.map(function (d) { return d.quarter; }));
  y.domain([0, d3.max(state.value.data, (d) => d.val)]);


  for (let i = 0; i <= 1; i++) {
    const line = d3
      .line()
      .x((d) => x(d.quarter))
      .y((d) => y(d.val));

    svg
      .append('path')
      .datum(state.value.filteredData[i])
      .attr('fill', 'none')
      .attr('stroke', colors[i])
      .attr('stroke-width', 1.5)
      .attr('d', line);

    d3.select('.main')
      .append('g')
      .data(state.value.filteredData[i])
      .enter()
      .append("circle")
      .attr("cx", (d) => d.quarter)
      .attr("cy", (d) => d.val)
      .attr("fill", colors[i])
      .attr("r", 15)
  }
  svg.select('.x-axis').call(d3.axisBottom(x));
  svg.select('.y-axis').call(d3.axisLeft(y));
};

function addDataPoint() {
  state.value.data.push({ quarter: '2021-Q1', val: 12, countryCode: 'RO' });
  state.value.data.push({ quarter: '2021-Q3', val: 7.8, countryCode: 'BG' });
};

onMounted(async () => {
  const test = await testData();
  state.value.data.push(...test);
  state.value.filteredData[0] = state.value.data.filter(x => x.countryCode === 'RO');
  state.value.filteredData[1] = state.value.data.filter(x => x.countryCode === 'BG');
  drawGraph();
});

watch(state.value.data, () => {
  state.value.filteredData[0] = state.value.data.filter(x => x.countryCode === 'RO');
  state.value.filteredData[1] = state.value.data.filter(x => x.countryCode === 'BG');
  console.log(state.value.filteredData)
  updateGraph();
})

</script>

<style>
svg {
  width: 100%;
  height: auto;
}
</style>
 -->
<template>
  <div class="rowContainer col-12">
    <button @click="updateData">update Data</button>
  </div>
  <div id="container"></div>
</template>

<script setup>
import * as d3 from 'd3';
import { ref, onMounted } from 'vue';
import useQuery from 'src/compositionFunctions/useQuery';
const dummydata = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 4 },
  { x: 4, y: 5 },
  { x: 5, y: 6 }
]
const { testData } = useQuery()
const data = ref([])
const width = 400;
const height = 400;
const margin = { left: 60, right: 60, top: 60, bottom: 60 }
function drawGraph() {
  const svg = d3
    .select('#container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.bottom + margin.top)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
  const xScale = d3.scalePoint().range([0, height - margin.top])
  const yScale = d3.scaleLinear().range([0, width - margin.right]).nice()

  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - margin.top})`)
    .call(d3.axisBottom(xScale));

  svg
    .append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale));

  d3.selectAll(".x-axis .tick text")
    .attr("transform", "rotate(-15)");

}

function drawLine(data, color) {
  // dau alldata si filtrez
  d3.select('#container').select('svg').selectAll('path').remove()
  const svg = d3.select('#container').select('svg').select('g')
  const x = d3.scalePoint().range([0, height - margin.top])
  const y = d3.scaleLinear().range([0, width - margin.right]).nice()

  x.domain(data.map(function (d) { return d.quarter; }));
  y.domain([0, d3.max(data, (d) => d.val)]);

  const line = d3
    .line()
    .x((d) => x(d.quarter))
    .y((d) => y(d.val));

  svg
    .append('g')
    .attr('class', 'test')
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 1.5)
    .attr('d', line);

  svg
    .append('g')
    .attr('class', 'test')
    .selectAll("circle")
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.quarter))
    .attr('cy', (d) => y(d.val))
    .attr("r", 5)
    .attr("fill", color)
    .insert('q-tooltip')
    .attr('class', 'bg-indigo')
    .attr('offset', `[100, 10]`)
    .text('test')
  svg
    .selectAll("myLabels")
    .data(data)
    .enter()
    .append('g')
    .append('text')
    .datum(function (d) { return { name: 'test', value: data[data.length - 1] }; }) // keep only the last value of each time series
    .attr("transform", function (d) { return "translate(" + x(d.value.quarter) + "," + y(d.value.val) + ")"; }) // Put the text at the position of the last point
    .attr("x", 12) // shift the text a bit more right
    .text(function (d) { return 'test'; })
    .style("fill", color)
    .style("font-size", 15)

  svg.select('.x-axis').call(d3.axisBottom(x));
  svg.select('.y-axis').call(d3.axisLeft(y));
}

onMounted(async () => {
  const test = await testData();
  data.value.push(...test)
  console.log(data.value)
  drawGraph()
  drawLine(data.value, 'red')
})
</script>

