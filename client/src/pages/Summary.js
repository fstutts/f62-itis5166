import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { AuthContext } from '../context/AuthContext';

const Summary = () => {
  const { user } = useContext(AuthContext);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
        if (!user) return;

        try { 
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/charts/summary-stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChartData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching chart data:', error);
            setError('Failed to load chart data');
            setLoading(false);
        }
    };

    fetchChartData();
  }, [user]);

  useEffect(() => {
    if (chartData && !loading) {
        // Clear any existing charts
        d3.select('#casualties-chart').select('svg').remove();
        d3.select('#species-chart').select('svg').remove();

        // Create the charts
        createCasualtiesChart(chartData.casualties);
        createSpeciesChart(chartData.speciesCount);
    }
  }, [chartData, loading]);

  const createCasualtiesChart = (data) => {
    const margin = { top: 20, right: 100, bottom: 40, left: 120 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select('#casualties-chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

    //Scales
    const x = d3.scaleLinear()
     .domain([0, d3.max(data, d => d.value)])
     .range([0, width]);

     const y = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, height])
      .padding(0.1);

    //Color Scale
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.category))
        .range(['#ff6b6b', '#4ecdc4', '#45b7d1']);

    // Bars
    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', d => y(d.category))
        .attr('width', d => x(d.value))
        .attr('height', y.bandwidth())
        .attr('fill', d => color(d.category));

    // X axis
    const xAxis =g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('.2s')));

    xAxis.selectAll('text')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#333');

    xAxis.select('.domain')
        .style('stroke', '#333')
        .style('stroke-width', '2px');

    // Y axis
   const yAxis = g.append('g')
        .call(d3.axisLeft(y));

    yAxis.selectAll('text')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#333');

    yAxis.select('.domain')
        .style('stroke', '#333')
        .style('stroke-width', '2px');
        
    // X Axis Label
    g.append('text')
        .attr('transform', `translate(${width / 2}, ${height + margin.bottom -5})`)
        .style('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text('Number of Cases (per year)');

    // Y Axis Label
    g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left + 15)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text('Category');

    // Labels
    g.selectAll('.label')
        .data(data)
        .enter().append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.value) + 5)
        .attr('y', d => y(d.category) + y.bandwidth() / 2)
        .attr('dy', '.35em')
        .style('font-size', '12px')
        .text(d => d3.format(',')(d.value));
  };

  const createSpeciesChart = (data) => {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select('#species-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const g = svg.append('g')
        .attr('transform', `translate(${width /2},${height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.species))
        .range(['#ff6b6b', '#4ecdc4', '#45b7d1']);

    const pie =d3.pie()
        .value(d => d.count);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius - 10);

    const arcs = g.selectAll('.arc')
       .data(pie(data))
       .enter().append('g')
       .attr('class', 'arc');

    arcs.append('path')
         .attr('d', arc)
         .attr('fill', d => color(d.data.species));

    arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text(d => `${d.data.species}: ${d.data.count}`);
  };

  if (!user) {
    return <div>Please log in to access the summary.</div>;
  }

  if (loading) {
    return (
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2>Loading chart data...</h2>
        </div>
    );
  }

  if (error) {
    return (
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2>Error: {error}</h2>
        </div>
    );
  }

  return (
    <div className="container">
      <div className="hero-section">
        <h1>Summary</h1>
        <p style={{ marginBottom: '20px' }}>
         Summary of Snakebite Research in Sub-Saharan Africa
        </p>

         {/* Snake Bite Casualties Chart */}
         <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px' }}>Annual Snake Bite Casualties</h2>
            <div id="casualties-chart" style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9'
            }}></div>
            {chartData && (
                <div style={{ marginTop: '15px', fontSize: '14px', color: '#333', backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
                    <p><strong>Casualties:</strong> This chart shows the number of casualties annually from venomous snakebites in areas throughout Africa beneath the Sahara Desert.
                    Initial snakebites or envenomings from venomous elapid snakes such as Cobras, Mambas, and Rinkhals numbered {chartData.casualties[0].range}.
                    The quantity of these snakebites that ultimately ended in fatalities numbered {chartData.casualties[1].range}.
                    Snakebites that did not result in death, but where there was significant enough tissue damage leading to amputations numbered {chartData.casualties[2].range}.</p>

                    <p style={{ marginBottom: '1.5rem' }}><strong>Source:</strong> <a href="https://www.nature.com/articles/s41586-025-09661-0/figures/1" target="_blank" rel="noopener noreferrer">Nature - Fig.1:a</a></p>
                </div>
            )}
         </div>

         {/* Snake Species Distribution Chart */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ marginBottom: '20px' }}>Venomous Snake Species Distribution</h2>
                <div id="species-chart" style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                    textAlign: 'center'
                }}></div>
                {chartData && (
                    <div style={{ marginTop: '15px', fontSize: '14px', color: '#333', backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
                        <p><strong>Species:</strong> {chartData.speciesCount.reduce((sum, item) => sum + item.count, 0)} different types of elapid snakes consisting of cobras, mambas, and rinkhals were gathered and their venom was extracted.
                        Cobras were the most prevalent type of elapid used with 13 different species collected, and they like to come out during the day and have close proximity to humans. 
                        Mambas were the second most used elapid with 4 different species gathered, and they are typically found living in trees. 
                        Rinkhals had the fewest amount of species used, they resemble cobras, but differ in that they give birth to live young rather than lay eggs.</p>

                        <p style={{ marginBottom: '1.5rem' }}><strong>Sources:</strong> <a href="https://www.nature.com/articles/s41586-025-09661-0/figures/1" target="_blank" rel="noopener noreferrer">Nature - Fig.1:a</a>, {' '}
                         <a href="https://www.sciencedirect.com/topics/pharmacology-toxicology-and-pharmaceutical-science/elapidae" target="_blank" rel="noopener noreferrer">ScienceDirect</a>, {' '}
                         <a href="https://www.africansnakebiteinstitute.com/snake/rinkhals/?srsltid=AfmBOooWLx_dNmgFX9E91u0qqFh05iBvtmwGDrx7nP4LrSeo1piH8BcN" target="_blank" rel="noopener noreferrer">African Snakebite Institute</a>
                         </p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Summary;
