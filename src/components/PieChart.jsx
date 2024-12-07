import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const width = 450;
    const height = 450;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.label))
      .range(d3.schemeSet2);

    const pie = d3.pie().value((d) => d.value);
    const data_ready = pie(data);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg
      .selectAll('pieces')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.label)) 
      .attr('stroke', 'black')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    // Adding labels
    svg
      .selectAll('text')
      .data(data_ready)
      .enter()
      .append('text')
      .text((d) => d.data.label) 
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '10px');
  }, [data]);

  return  <>
  <center>
  <svg ref={ref}></svg>
  </center>
  </>
 
};

export default PieChart;