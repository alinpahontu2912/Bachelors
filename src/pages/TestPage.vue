<!-- <template>
  <div>
    <div ref="chart"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  mounted() {
    // set up chart dimensions
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // set up color scale
    const color = d3.scaleOrdinal()
      .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

    // set up data
    const data = [
      { label: 'Apples', value: 30 },
      { label: 'Bananas', value: 20 },
      { label: 'Cherries', value: 10 },
      { label: 'Figs', value: 12 },
      { label: 'Grapes', value: 15 },
    ];

    // set up pie generator
    const pie = d3.pie()
      .value(d => d.value);

    // set up arc generator
    const arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(0);

    // create svg element
    const svg = d3.select(this.$refs.chart)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // create pie chart
    const g = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .style('fill', d => color(d.index))
      .style('stroke', '#fff')
      .style('stroke-width', '2px')
      .attr('title', 'test')

    // add labels
    g.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '2em')
      .text(d => d.data.label);

    // add annotations
    g.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '1.5em')
      .text(d => `${d.data.value} (${Math.round((d.data.value / d3.sum(data, d => d.value)) * 100)}%)`);
  },
};
</script> -->
<template>
  <DoughnutChart :chartData="testData" ref="doughnutRef" />
  <button @click="shuffleData">Shuffle</button>
</template>

<!-- <script>
import { defineComponent } from 'vue';
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { ref }
Chart.register(...registerables);

export default defineComponent({
  components: { DoughnutChart },
  setup() {
    const testData = {
      labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
      datasets: [
        {
          data: [30, 40, 60, 70, 5],
          backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
        },
      ],
    };
    function shuffleData() {
      data.value = shuffle(data.value);
    }

    return { testData, shuffleData, doughnutRef, options };
  },
});
</script> -->
