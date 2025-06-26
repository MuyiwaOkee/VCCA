"use client"
import { Button } from '@visa/nova-react'
import { VisaChevronLeftTiny, VisaChevronRightTiny } from "@visa/nova-icons-react";
import React, { useCallback, useEffect, useRef, useState } from 'react'
import DataPointIndicator from '@/components/DataPointIndicator';
import { MultiselectItem, MultiselectRef, MultiselectWithMultipleSelectionsAndVerticalScroll } from '@/components/MultiSelectWithScrollbar';
import * as d3 from 'd3';

type GraphDataType = {
  value: number;
  date: Date;
};

const DashbaordPage = () => {
  const [selectedIndicators, setSelectedIndicators] = useState<MultiselectItem[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const multiSelectRef = useCallback((value: MultiselectItem[]) => {
    setSelectedIndicators(value);
  }, []);
  
  const multiselectItems:MultiselectItem[] = [
    { value: 'Interest rate', color: '#1435cb'},
    { value: 'Option B', color: '#0000FF' },
    { value: 'Option C', color: '#00FF00' },
  ];

  // Mock data - 12 months of interest rates
  const generateMockData = (): GraphDataType[] => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    const currentYear = new Date().getFullYear();
    
    return months.map(month => {
      // Random interest rate between 1% and 10%
      const value = Math.random() * 9 + 1;
      const date = new Date(currentYear, month, 1);
      return { value, date };
    });
  };

  const data = generateMockData();
  
  // Get size of div
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.offsetHeight;

    setDimensions({ width, height });
  }, []);

  // Create the graphs
  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove() // Add this to remove default stroke;

    // Chart dimensions and margins
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale - time scale for months
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    // Y scale - linear scale for interest rates
    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.value)! * 0.95, d3.max(data, d => d.value)! * 1.05]) // Add 5% padding
      .range([height, 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .call(g => g.select('.domain').remove()) // Remove axis line
      .call(g => g.selectAll('.tick line').remove()) // Remove tick lines
      .call(g => g.selectAll('.tick text').text('')) // Remove default labels
      .call(g => g.selectAll('.tick')
        .append('text')
        .attr('y', 20)
        .attr('x', 0)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .text(d => d3.timeFormat('%b')(new Date(d as Date))) // Short month names
        .style('font-size', '12px')
        .style('fill', '#666')
      );

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y).tickFormat(d => `${d}%`))
      .attr('transform', `translate(-10, 0)`) // Adjust -10px as needed
      .call(g => g.select('.domain').remove()) // Remove axis line
      .call(g => g.selectAll('.tick line').remove()) // Remove tick lines
      .call(g => g.selectAll('.tick text').style('font-size', '12px').style('fill', '#666'));

    // Create line generator
    const line = d3.line<GraphDataType>()
      .x(d => x(d.date))
      .y(d => y(d.value));

    // Add dashed line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#1435cb')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '10,5')
      .attr('d', line);

    // Add circles for data points
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.value))
      .attr('r', 5)
      .attr('fill', '#5868ef')
      .attr('stroke', '#1435cb')
      .attr('stroke-width', 2);
  }, [data]);

  return (
    <section className='w-full h-full bg-white overflow-hidden'>
      {/* Top Bar */}
      <div className="w-full inline-flex flex-col justify-start items-start gap-20">
        {/* Upper Bar */}
    <section className="self-stretch px-2 inline-flex justify-between items-center relative">
      {/* data picker */}
        <div className='absolute top-0 left-0'>
          <MultiselectWithMultipleSelectionsAndVerticalScroll ref={multiSelectRef} label='Data sources' isRequired id='datapoint-dropdown' items={multiselectItems} />
        </div>
        {/* Time btns */}
        <div className="flex absolute top-6 right-0 justify-start items-center gap-4">
            <div className="flex justify-start items-center gap-2">
                <Button colorScheme='secondary'>1M</Button>
                <Button colorScheme='secondary'>3M</Button>
            </div>
            {/* Year selector */}
            <div className="h-10 flex justify-center items-center gap-1">
              <Button colorScheme='tertiary' onClick={() => setCurrentYear(prev => prev - 1)}><VisaChevronLeftTiny/></Button>
              <p className="justify-center text-Color-Text-text text-sm font-normal font-['Noto_Sans'] leading-none">{currentYear}</p>
                <Button colorScheme='tertiary' onClick={() => setCurrentYear(prev => prev + 1)}><VisaChevronRightTiny /></Button>
            </div>
        </div>
    </section>
    {/* Lower Bar */}
    <section className="self-stretch inline-flex justify-between items-start">
      {/* Current selected data points */}
        <div className="flex justify-start items-center gap-4">
           {
            selectedIndicators.map(({ value, color}, key) => {
              return  <DataPointIndicator title={value} color={color} key={key}/>
            })
           }
        </div>
        {/* First Indicator information */}
        <div className="flex justify-start items-center gap-2.5">
            <p className="justify-center text-Color-Text-text text-xs font-bold font-['Noto_Sans'] leading-none">0.5 Points</p>
            <p className="justify-center text-Color-Messaging-positive-text text-xs font-normal font-['Noto_Sans'] leading-none">+0.1 points (20%)</p>
        </div>
    </section>
      </div>
      {/* Graph */}
      <div ref={containerRef} className='w-full h-full'>
        <svg ref={svgRef} className='w-full h-full'/>
      </div>
    </section>
  )
}

export default DashbaordPage