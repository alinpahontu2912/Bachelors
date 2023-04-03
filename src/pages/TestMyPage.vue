<template>
  <div>
    <div>
      <button @click="addDataPoint">Add Data Point</button>
    </div>
    <div ref="container"></div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import useQuery from '../compositionFunctions/useQuery'
import * as d3 from 'd3';

export default {
  name: 'LineGraph',

  setup() {
    const container = ref(null);
    const { testData } = useQuery();

    const state = ref({
      data: []
    });

    const drawGraph = () => {
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3
        .select(container.value)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scalePoint().range([0, 600])
      const y = d3.scaleLinear().range([height, 0]);

      x.domain(state.value.data.map(function (d) { return d.quarter; }));
      y.domain([0, d3.max(state.value.data, (d) => d.val)]);

      const line = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.value));

      svg
        .append('path')
        .datum(state.value.data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line);

      svg
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg
        .append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y));
    };

    const updateGraph = () => {
      const svg = d3.select(container.value).select('svg');
      const x = d3.scalePoint().range([0, 600])
      // d3.scaleOrdinal().rangeRoundBands([0, 600]);
      const y = d3.scaleLinear().range([400, 0]);

      x.domain(state.value.data.map(function (d) { return d.quarter; }));
      y.domain([0, d3.max(state.value.data, (d) => d.val)]);

      const line = d3
        .line()
        .x((d) => x(d.quarter))
        .y((d) => y(d.val));

      svg.select('path').datum(state.value.data).attr('d', line);
      svg.select('.x-axis').call(d3.axisBottom(x));
      svg.select('.y-axis').call(d3.axisLeft(y));
    };

    const addDataPoint = () => {
      console.log('sdfasdf')
      state.value.data.push({ quarter: '2021-Q1', val: 12 });
      updateGraph()
    };

    onMounted(async () => {
      const test = await testData();
      console.log(test)
      state.value.data.push(...test);
      console.log(state.value.data)
      drawGraph();
    });

    watch(state.value.data, () => {
      updateGraph();
    })

    // watch(
    //   () => ,
    //   (state.value.data) => {

    //   }
    // );

    return {
      container,
      addDataPoint,
    };
  },
};
</script>

<style>
svg {
  width: 100%;
  height: auto;
}
</style>
