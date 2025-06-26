"use client"
import { Button } from '@visa/nova-react'
import { VisaChevronLeftTiny, VisaChevronRightTiny } from "@visa/nova-icons-react";
import React, { useCallback, useEffect, useRef, useState } from 'react'
import DataPointIndicator from '@/components/DataPointIndicator';
import { MultiselectItem, MultiselectRef, MultiselectWithMultipleSelectionsAndVerticalScroll } from '@/components/MultiSelectWithScrollbar';
import * as d3 from 'd3';
import cn from '@/utils/cn';

type GraphDataType = {
  value: number;
  date: Date;
};

const DashbaordPage = () => {
  const [isMonthlyTimescale, toggleMonthlyTimescale] = useState(true);
  const [currentPriceInfomation, setCurrentPriceInfomation] = useState<{ value: number, percentChange: number, difference: number, valueType: 'Price' | 'Points' } | undefined>(undefined)
  const [multiSelectData, setMultiSelectData] = useState<MultiselectRef | undefined>(undefined);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const multiSelectRef = useCallback((value: MultiselectRef) => {
    value && setMultiSelectData(value);
  }, []);
  
  const multiselectItems:MultiselectItem[] = [
    { value: 'Interest rate', strokeColor: '#1435cb', fill: '#5868ef'},
    { value: 'Option B', strokeColor: '#DCB30F', fill: '#f4d35e' },
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
  
  // Get size of div
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;

    setDimensions({ width, height });
  }, []);

  // Create the graphs
  useEffect(() => {
    if (!svgRef.current  || !dimensions.width || !dimensions.height) return;

    if(!multiSelectData) return;

    const datapoints = multiSelectData?.selectedItems.map(({ strokeColor, fill }) =>{
      return {
        strokeColor,
        fill,
        data: generateMockData()
      };
    })

    let percentChange: number | undefined = undefined;
  if (datapoints.length > 0 && datapoints[0].data.length > 1) {
    const first = datapoints[0].data[0].value;
    const last = datapoints[0].data[datapoints[0].data.length - 1].value;
    const difference = last - first;
    percentChange = ((difference / first) * 100);

    setCurrentPriceInfomation({
      value: last,
      percentChange,
      difference,
      valueType: multiSelectData.selectedItems[0].value === 'Interest rate' ? 'Points' : 'Price'
    });
  } else {
    setCurrentPriceInfomation(undefined);
  }
 
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

      if( datapoints.length == 0) return;

   // Get combined domain across all series
    const allValues = datapoints.flatMap(s => s.data.map(d => d.value));
    const allDates = datapoints.flatMap(s => s.data.map(d => d.date));

    // X scale
    const x = d3.scaleTime()
      .domain(d3.extent(allDates) as [Date, Date])
      .range([0, width]);

    // Y scale
    const y = d3.scaleLinear()
      .domain([d3.min(allValues)! * 0.95, d3.max(allValues)! * 1.05])
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

      // Draw each series
    datapoints.forEach(({ data, strokeColor, fill }, key) => {
      // Create line generator for this series
      const line = d3.line<GraphDataType>()
        .x(d => x(d.date))
        .y(d => y(d.value));

      // Add line path
      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', strokeColor)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,5')
        .attr('d', line);

      // Add circles for data points
      svg.selectAll(`.dot-${key}`)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', `dot-${key}`)
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.value))
        .attr('r', 5)
        .attr('fill', fill)
        .attr('stroke', strokeColor)
        .attr('stroke-width', 2);
    });
  }, [multiSelectData]);
  
  return (
    <section className='w-full h-full bg-white overflow-hidden'>
      {/* Top Bar */}
      <div className={cn("w-full inline-flex flex-col justify-start items-start", multiSelectData?.isOpen ? 'gap-24' : 'gap-2')}>
        {/* Upper Bar */}
    <section className="self-stretch px-2 inline-flex justify-between items-center relative">
      {/* data picker */}
        <div className={cn(multiSelectData?.isOpen ? 'absolute top-0 left-0' : 'relative')}>
          <MultiselectWithMultipleSelectionsAndVerticalScroll ref={multiSelectRef} label='Data sources' isRequired id='datapoint-dropdown' items={multiselectItems} />
        </div>
        {/* Time btns */}
        <div className="flex absolute top-6 right-0 justify-start items-center gap-4">
            <div className="flex justify-start items-center gap-2">
                <Button colorScheme='secondary' className={cn(isMonthlyTimescale ? 'bg-[#B3D7FF]/90' : '')} onClick={() => toggleMonthlyTimescale(true)}>1M</Button>
                <Button colorScheme='secondary' className={cn(!isMonthlyTimescale ? 'bg-[#B3D7FF]/90' : '')} onClick={() => toggleMonthlyTimescale(false)}>3M</Button>
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
            multiSelectData?.selectedItems.map(({ value, strokeColor }, key) => {
              return  <DataPointIndicator title={value} color={strokeColor} key={key}/>
            })
           }
        </div>
        {/* First Indicator information */}
        {currentPriceInfomation && <div className="flex justify-start items-center gap-2.5">
            <p className="justify-center text-Color-Text-text text-xs font-bold font-['Noto_Sans'] leading-none">{currentPriceInfomation.valueType == 'Price' && '£'}{currentPriceInfomation.value.toFixed(1)}{currentPriceInfomation.valueType == 'Points' && ' Points'}</p>
            {currentPriceInfomation.percentChange && <p className={cn("justify-center text-Color-Messaging-positive-text text-xs font-normal font-['Noto_Sans'] leading-none", currentPriceInfomation.difference > 0 ? 'text-[#2C6849]' : 'text-[#AD2929]' )}>{currentPriceInfomation.valueType == 'Price' && '£'}{currentPriceInfomation.difference.toFixed(1)}{currentPriceInfomation.valueType == 'Points' && ' Points'} {currentPriceInfomation.percentChange?.toFixed(1)}%</p>}
        </div>}
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