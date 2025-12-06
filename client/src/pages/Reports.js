import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { AuthContext } from '../context/AuthContext';

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportsData = async () => {
        if (!user) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/charts/reports-data', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReportsData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reports data:', error);
            setError('Failed to load reports data', error);
            setLoading(false);
        }
    };

    fetchReportsData();
  }, [user]);

  useEffect(() => {
    if (reportsData && !loading) {
        // Clear any existing charts
        d3.select('#toxin-clones-chart').select('svg').remove();
        d3.select('#binding-strength-chart').select('svg').remove();

        // Create the charts
        createToxinClonesChart(reportsData.toxinProfiles);
        createBindingStrengthChart(reportsData.toxinProfiles);
    }
  }, [reportsData, loading]);

  const createToxinClonesChart = (data) => {
    const margin = { top: 20, right: 30, bottom: 60, left: 100 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#toxin-clones-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.toxin))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.clones)])
        .nice()
        .range([height, 0]);

    // Bars
    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.toxin))
        .attr('y', d => y(d.clones))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.clones))
        .attr('fill', d => d.color);

    // X Axis
    const xAxis = g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
       
    xAxis.selectAll('text')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

    xAxis.select('.domain')
        .style('stroke', '#333')
        .style('stroke-width', '2px');

    // Y Axis
    const yAxis = g.append('g')
        .call(d3.axisLeft(y));

    // Y Axis Label

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
        .text('Toxin Type');

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
        .text('Number of VH Clones');
    
    // Value Labels on Bars
    g.selectAll('.label')
        .data(data)
        .enter().append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.toxin) + x.bandwidth() / 2)
        .attr('y', d => y(d.clones) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .text(d => d.clones);
  };

  const createBindingStrengthChart = (data) => {
    const margin = { top: 20, right: 30, bottom: 80, left: 100 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#binding-strength-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.toxin))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.bindingStrength)])
        .nice()
        .range([height, 0]);

    // Line Generator
    const line = d3.line()
        .x(d => x(d.toxin) + x.bandwidth() / 2)
        .y(d => y(d.bindingStrength))
        .curve(d3.curveMonotoneX);

    // Add Line
    g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#4caf50')
        .attr('stroke-width', 3)
        .attr('d', line);

    // Add Circles
    g.selectAll('.dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.toxin) + x.bandwidth() / 2 )
        .attr('cy', d => y(d.bindingStrength))
        .attr('r', 5)
        .attr('fill', d => d.color);

    // X Axis
    const xAxis2 = g.append('g')
        .attr('transform', `translate(0,${height})` )
        .call(d3.axisBottom(x))
        
    xAxis2.selectAll('text')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

    xAxis2.select('.domain')
        .style('stroke', '#333')
        .style('stroke-width', '2px');

    // Y Axis
    const yAxis2 = g.append('g')
        .call(d3.axisLeft(y));

    yAxis2.selectAll('text')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#333');

    yAxis2.select('.domain')
        .style('stroke', '#333')
        .style('stroke-width', '2px');

    // X Axis Label
    g.append('text')
        .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 5})`)
        .style('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text('Toxin Type');

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
        .text('Binding Strength (log RFU)');

    // Value Labels 
    g.selectAll('.label')
        .data(data)
        .enter().append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.toxin) + x.bandwidth() / 2)
        .attr('y', d => y(d.bindingStrength) - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .text(d => d.bindingStrength);
  };

  if (!user) {
    return <div>Please log in to access reports.</div>;
  }

  if (loading) {
    return (
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0'}}>
            <h2>Loading reports data...</h2>
        </div>
    );
  }

  if (error) {
    return ( 
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0'}}>
            <h2>Error: {error}</h2>
        </div>
    );
  }

  return (
    <div className="container">
      <div className="hero-section">
        <h1>Nanobody Research Reports</h1>
        <p style={{ marginBottom: '20px' }}>
          Detailed analysis of nanobody binding profiles and toxin interactions from research data.
        </p>
        
        {/* Toxin Clone Distribution Chart */}
        <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px' }}>VH Clone Distribution by Toxin Type</h2>
            <div id="toxin-clones-chart" style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9'
            }}></div>
            {reportsData && (
                <div style={{ marginTop: '15px', fontSize: '14px', color: '#333', backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
                    <p><strong>Total VH Clones:</strong> This chart shows the number of Variable-Heavy or VH Clones that connect with and then counteract a specific toxin within a snake's venom. 
                    VH Clones are obtained from the antibodies created when llamas and alpaca are injected with snake venoms. 
                    These antibodies are then cloned to create a Variable-Heavy Domain of Heavy Chain library.
                    Once the VH clones are created, they are paired with one of the seven toxins above to see how well they bind to and neutralize them using a Dissociation-Enhanced Lanthanide Fluorescence Immunoassay or DELFIA technique. 
                    The DELFIA method is a time-resolved fluorescence test where the number of VH clones with a strong signal intensity that exceed the background level threshold are counted. {reportsData.toxinProfiles.reduce((sum, item) => sum + item.clones, 0)} clones were counted and analyzed across {reportsData.toxinProfiles.length} toxin types.</p>

                    <p style={{ marginBottom: '1.5rem' }}><strong>Source:</strong> <a href="https://www.nature.com/articles/s41586-025-09661-0/figures/2" target="_blank" rel="noopener noreferrer">Nature - Fig.2:a</a></p>
                </div>
            )}
        </div>

        {/* Binding Strength Analysis Chart */}
        <div style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px' }}>Toxin Binding Strength Profile</h2>
            <div id="binding-strength-chart" style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9'
            }}></div>
            {reportsData && (
                <div style={{ marginTop: '15px', fontSize: '14px', color: '#333', backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
                    <p><strong>Binding Analysis:</strong> This chart indicates how well the VH Clones bound to a specific toxin in vitro and disabled them. 
                    For example, the neurotoxins sNTX and 1NTx cause nerve and muscle paralysis, the VH Clones created to combat them had a binding strength strong enough to completely hinder their neurotoxicity. 
                    CTx is a cytotoxin that destroys cell tissue, AgTx affects neurotransmission by hindering enzymes, Og XI assists other toxins' ability to infiltrate tissues, KUN restricts proteases which can have negative effects on blood coagulation and ion channels, PLA₂ has numerous harmful consequences that are cytotoxic, myotoxic, and neurotoxic.
                    The relative fluorescence units (RFU) are the measurements of the Expression-Normalized capture of DELFIA for the different toxin types. Higher measurements of RFU indicate stronger nanobody-toxin binding interactions which greatly mitigate the damage these toxins cause the body.</p>

                    <p style={{ marginBottom: '1.5rem' }}><strong>Source:</strong> <a href="https://www.nature.com/articles/s41586-025-09661-0/figures/2" target="_blank" rel="noopener noreferrer">Nature - Fig.2:b</a></p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
