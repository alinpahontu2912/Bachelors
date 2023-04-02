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
import * as d3 from 'd3';

export default {
  name: 'LineGraph',

  setup() {
    const container = ref(null);

    const state = ref({
      data: [
        { date: new Date('2022-01-01'), value: 10 },
        { date: new Date('2022-02-01'), value: 20 },
        { date: new Date('2022-03-01'), value: 15 },
        { date: new Date('2022-04-01'), value: 30 },
        { date: new Date('2022-05-01'), value: 25 },
      ],
    });

    const drawGraph = () => {
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3
        .select(container.value)
        .append('svg')
        .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleTime().range([0, width]);
      const y = d3.scaleLinear().range([height, 0]);

      x.domain(d3.extent(state.value.data, (d) => d.date));
      y.domain([0, d3.max(state.value.data, (d) => d.value)]);

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
      const x = d3.scaleTime().range([0, 600]);
      const y = d3.scaleLinear().range([400, 0]);

      x.domain(d3.extent(state.value.data, (d) => d.date));
      y.domain([0, d3.max(state.value.data, (d) => d.value)]);

      const line = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.value));

      svg.select('path').datum(state.value.data).attr('d', line);
      svg.select('.x-axis').call(d3.axisBottom(x));
      svg.select('.y-axis').call(d3.axisLeft(y));
    };

    const addDataPoint = () => {
      console.log('sdfasdf')
      state.value.data.push({ date: new Date(), value: Math.floor(Math.random() * 100) });
      updateGraph()
    };

    onMounted(() => {
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
