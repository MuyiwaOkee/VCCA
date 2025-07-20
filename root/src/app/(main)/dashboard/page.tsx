"use client"
import { Button } from '@visa/nova-react'
import { VisaChevronLeftTiny, VisaChevronRightTiny } from "@visa/nova-icons-react";
import React, { useCallback, useEffect, useRef, useState } from 'react'
import DataPointIndicator from '@/components/DataPointIndicator';
import { MultiselectItem, MultiselectRef, MultiselectWithMultipleSelectionsAndVerticalScroll } from '@/components/MultiSelectWithScrollbar';
import * as d3 from 'd3';
import cn from '@/utils/cn';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { min } from 'mathjs';
import { useQuery } from '@tanstack/react-query';
import { GetSuffix } from '@/utils/GetSuffix';
import { analytics_source_response } from '@/types/response/analytics/analytics_source_response';
import { analytics_datapoint_response } from '@/types/response/analytics/analytics_datapoint_response';
import { datapoints_response } from '@/types/response/analytics/datapoints_response';
import ForecastModal, { ForecastModalProps } from './ForecastModal';

const GetAllSources = async () => {
  const response = await fetch('http://127.0.0.1:8000/analytics/sources/all', {
      method: 'GET',
      headers:{
          'Content-Type': 'Application/json'
      }
  });

  if(!response.ok) {
    switch (response.status) {
      case 404:
        throw new Error("No Sources Found");
    
      default:
        throw new Error("Issue with the server. Please try again");
    }
  }

  const data:analytics_source_response[] = await response.json();

  return data
}

const GetDatapointsInSources = async (year: number, period: string, source_ids: string[]) => {
    const response = await fetch(`http://127.0.0.1:8000/analytics/sources/data?year=${year}&period=${period}&source_ids=${source_ids.join(';')}`, {
        method: 'GET',
        headers:{
            'Content-Type': 'Application/json'
        }
    });

    if(!response.ok) {
      console.log(`Status code error is: ${response.status}`);
      switch (response.status) {
        case 400:
          throw new Error("invalid information provided");
        
        case 404:
          throw new Error("No Sources Found");

        case 422:
          throw new Error("No data for the year provided");
      
        default:
          throw new Error("Issue with the server. Please try again");
      }
    }

    const data:datapoints_response[] = await response.json();

    return data 
}

const GetSourcesItems = async () => {
    const analytic_sources = await GetAllSources();

      const items:MultiselectItem[] = analytic_sources.map(({ category_name, sector_name, country_iso_code, stroke_hex, fill_hex, id }) => {
        return {
          id,
          value: `${category_name}: ${sector_name ? sector_name + ' - ' : ''} ${country_iso_code}`,
          strokeColor: stroke_hex,
          fill: fill_hex
        }
      });

      return items;
  }

const DashbaordPage = () => {
  // Search query params
  const maxYearValue = new Date().getFullYear(); //Gets the current year
  const minYearValue = 2020 //the minimum year the app will have data points for
  const [period, togglePeriod] = useQueryState('period', parseAsString.withDefault('monthly'));
  const [currentYear, setCurrentYear] = useQueryState('year', parseAsInteger.withDefault(maxYearValue));
  const [selectedSources, setSelectedSources] = useQueryState('sources', parseAsArrayOf(parseAsString.withDefault('Interest rate'), ';'));

  const { data:analytic_sources, isError, error } = useQuery({
    queryFn: GetSourcesItems,
    queryKey: ["sources"]
  });

  if(isError)
    throw new Error(error.message);

  const [datapointsError, setDatapointsError] = useState<Error | null>(null);

  const [currentPriceInfomation, setCurrentPriceInfomation] = useState<{ value: number, percentChange: number, difference: number, valueType: 'Price' | 'Points' } | undefined>(undefined)
  const [multiSelectData, setMultiSelectData] = useState<MultiselectRef | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [forecasted_datapoints, setForecasted_datapoints] = useState<datapoints_response | undefined>(undefined);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const forecastModalRef = useRef<ForecastModalProps>(null!);

  const multiSelectRef = useCallback((value: MultiselectRef) => {
    value && setMultiSelectData(value);

    if(value?.selectedItems) {
      const source_ids = value.selectedItems.map(({ id }) => {return id});
      setSelectedSources(source_ids);
    }
  }, []);
  
  // Get size of div
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);
    
    // Initial measurement (in case ResizeObserver doesn't fire immediately)
    const initialWidth = containerRef.current.clientWidth;
    const initialHeight = containerRef.current.clientHeight;
    setDimensions({ width: initialWidth, height: initialHeight });

    return () => resizeObserver.disconnect();
  }, []);

  // Create the graphs
  useEffect(() => {
    // Only render when we have valid dimensions and data
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const RenderData = async () => {
      // Clear previous content
      d3.select(svgRef.current).selectAll('*').remove() // Add this to remove default stroke;

      // if theres so sources, let the user know that no sources have been selected
      if (!selectedSources || selectedSources.length == 0 && !forecasted_datapoints) {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous content

        svg.append('text')
          .attr('x', dimensions.width / 2)
          .attr('y', (dimensions.height / 2) - 15)
          .attr('text-anchor', 'middle')
          .style('font-size', '20px')
          .style('fill', '#0F0F0F')
          .text('No sources selected');

        return;
      }

      try {
      // fetch datapoints. ensure that the creation date utc property is of type Date
      const selectedSourcesDatapoints = selectedSources.length == 0 ? [] : await GetDatapointsInSources(currentYear, period, selectedSources);

      const allDatapoints_raw = forecasted_datapoints !== undefined
        ? [...selectedSourcesDatapoints, forecasted_datapoints]
        : [...selectedSourcesDatapoints];

      const datapoints = (allDatapoints_raw)
        .map(series => ({
          ...series,
          data: series.data.map(d => ({
            ...d,
            creation_date_utc: new Date(d.creation_date_utc)
          }))
        }));

      // set current price information
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
          valueType: datapoints[0].is_value_percent ? 'Points' : 'Price'
        });
      } else {
        setCurrentPriceInfomation(undefined);
      }

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

        if(datapoints.length == 0) return;

    // Get combined domain across all series (that are non percent values)
      const datapoints_continuous = datapoints.filter(({ is_value_percent }) => is_value_percent == false);
      const allContinuousValues = datapoints_continuous.flatMap(s => s.data.map(d => d.value));

      // Get combined domain across all series with percent values
      const datapoints_percent =  datapoints.filter(({ is_value_percent }) => is_value_percent == true);
      const allPercentValues = datapoints_percent.flatMap(s => s.data.map(d => d.value));

      // get suffix and divisor
      const { divisor, suffix } = GetSuffix(allContinuousValues.length > 0 ? min(allContinuousValues) : 1);

      // X scale
      const x = d3.scaleTime()
        .domain([new Date(currentYear, 0, 1), new Date(currentYear, 11, 31)])
        .range([0, width]);

      // Y scale for non percent values
      const y_continuous = d3.scaleLinear()
        .domain([d3.min(allContinuousValues)! * 0.95 / divisor, d3.max(allContinuousValues)! * 1.05 / divisor])
        .range([height, 0]);
       
      // y scale for percent values
      const y_percent = d3.scaleLinear()
        .domain([d3.min(allPercentValues)! * 0.95, d3.max(allPercentValues)! * 1.05])
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
      if(allContinuousValues.length > 0) {
        const labelText = analytic_sources?.find(({ id }) => id == datapoints_continuous[0].source_id)?.value;

        svg.append('g')
          .call(d3.axisLeft(y_continuous).ticks(10).tickFormat(d => `${datapoints_continuous[0].unit}${d}`))
          .attr('transform', `translate(-10, 0)`) // Adjust -10px as needed
          .call(g => g.select('.domain').remove()) // Remove axis line
          .call(g => g.selectAll('.tick line').remove()) // Remove tick lines
          .call(g => g.selectAll('.tick text').style('font-size', '12px').style('fill', '#666'));

          // Add Y axis label in top left corner
          svg.append('text')
            .attr('x', 0) // Align with left edge of the chart area
            .attr('y', -5) // Position above the top of the chart area
            .attr('text-anchor', 'start') // Left-align the text
            .style('font-size', '12px')
            .style('fill', '#666')
            .text(`${labelText ? `${labelText}, ` : ''} ${suffix}`);
      }
        
      if(allPercentValues.length > 0) {
        const labelText = analytic_sources?.find(({ id }) => id == datapoints_percent[0].source_id)?.value;

        svg.append('g')
        .call(d3.axisLeft(y_percent).ticks(10).tickFormat(d => `${d}%`))
        .attr('transform', `translate(${width}, 0)`) // Adjust -10px as needed
        .call(g => g.select('.domain').remove()) // Remove axis line
        .call(g => g.selectAll('.tick line').remove()) // Remove tick lines
        .call(g => g.selectAll('.tick text').style('font-size', '12px').style('fill', '#666'));

        // Add Y axis label in top left corner
          svg.append('text')
            .attr('x', width) // Align with left edge of the chart area
            .attr('y', -5) // Position above the top of the chart area
            .attr('text-anchor', 'end') // Left-align the text
            .style('font-size', '12px')
            .style('fill', '#666')
            .text(`${labelText ? labelText : ''}`);
      }
        
        // Add tooltip container
        const tooltipGroup = svg.append("g")
    .attr("class", "tooltip-group")
    .style("pointer-events", "none");

      const tooltip = tooltipGroup.append("g")
        .attr("class", "tooltip-container")
        .style("display", "none");

      // Tooltip rectangle
      tooltip.append("rect")
        .attr("width", 140)
        .attr("height", 50)
        .attr("rx", 4)
        .attr("fill", "white")
        .attr("stroke", "#ddd")
        .attr("stroke-width", 1)
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"); // Visual prominence;

      // Tooltip date text
      tooltip.append("text")
        .attr("class", "tooltip-date")
        .attr("x", 8)
        .attr("y", 20)
        .attr("font-size", "12px")
        .attr("fill", "#333");

      // Tooltip value text
      tooltip.append("text")
        .attr("class", "tooltip-value")
        .attr("x", 8)
        .attr("y", 38)
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "#333");

        // Draw each series
      datapoints.forEach(({ data, stroke_hex, fill_hex, is_value_percent, unit }, key) => {
        // Create line generator for this series
        const y_value_func = (value: number) => is_value_percent ? y_percent(value) : y_continuous(value);
        const line = d3.line<analytics_datapoint_response>()
          .x(d => x(d.creation_date_utc))
          .y(d => y_value_func(is_value_percent ? d.value : d.value / divisor));

        // Add line path
        svg.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', stroke_hex)
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '5,5')
          .attr('d', line);

        // Add circles for data points
        svg.selectAll(`.dot-${key}`)
          .data(data)
          .enter()
          .append('circle')
          .attr('class', `dot-${key}`)
          .attr('cx', d => x(d.creation_date_utc))
          .attr('cy', d => y_value_func(is_value_percent ? d.value : d.value / divisor))
          .attr('r', 5)
          .attr('fill', fill_hex)
          .attr('stroke', stroke_hex)
          .attr('stroke-width', 2)
          .attr("cursor", "pointer")
          .on("mouseover", function(event, d) {
            // Bring tooltip to front
            tooltipGroup.node()?.parentNode?.appendChild(tooltipGroup.node() as Node);
    
            // Get mouse position relative to SVG
            const [xPos, yPos] = d3.pointer(event, svgRef.current);
            const tooltipWidth = 140;
            const tooltipHeight = 50;
            
            // Calculate available space
            const svgWidth = dimensions.width;
            const rightSpace = svgWidth - xPos;
            const topSpace = yPos;
            
            // Determine tooltip position with edge detection
            let tooltipX = xPos - 30;
            let tooltipY = yPos - 40;
            
            // Adjust for right edge
            if (rightSpace < tooltipWidth + 20) {
              tooltipX = xPos - tooltipWidth - 60;
            }
            
            // Position and show tooltip
            tooltip
              .style("display", "block")
              .attr("transform", `translate(${tooltipX},${tooltipY})`);
            
            // Update tooltip content
            tooltip.select(".tooltip-date")
              .text(d3.timeFormat("%b %d, %Y")(d.creation_date_utc));
            
            tooltip.select(".tooltip-value")
              .text(`Value: ${is_value_percent ? '' : unit}${d.value.toFixed(2)}${is_value_percent ? ' Points' : ''}`);
                  })
                  .on("mouseout", function() {
                    // Hide tooltip
                    tooltip.style("display", "none");
                  });
              });
      } catch (error) {
        setDatapointsError(error as Error);
      }
    }

    RenderData();
    
  }, [selectedSources, forecasted_datapoints, dimensions, currentYear, period]);
  
  
  if (datapointsError)
    throw datapointsError; // This will trigger the error boundary and show error.tsx
  
  return (
    <section className='w-full h-full bg-white overflow-hidden'>
      {/* Top Bar */}
      <div className={cn("w-full inline-flex flex-col justify-start items-start", multiSelectData?.isOpen ? 'gap-24' : 'gap-2')}>
        {/* Upper Bar */}
    <section className="self-stretch px-2 inline-flex justify-between items-center relative">
      {/* data picker */}
        {analytic_sources && <div className={cn(multiSelectData?.isOpen ? 'absolute top-0 left-0' : 'relative')}>
          <MultiselectWithMultipleSelectionsAndVerticalScroll ref={multiSelectRef} label='Data sources' isRequired id='datapoint-dropdown' items={analytic_sources} defaultSelectedItems={analytic_sources.filter(( {id }) => selectedSources?.includes(id))}/>
        </div>}
        {/* Time btns */}
        <div className="flex absolute top-6 right-0 justify-start items-center gap-4">
            <div className="flex justify-start items-center gap-2">
                <Button colorScheme='secondary' className={cn(period == 'monthly' ? 'bg-[#B3D7FF]/90' : '')} onClick={() => togglePeriod('monthly')}>1M</Button>
                <Button colorScheme='secondary' className={cn(period == 'quarterly' ? 'bg-[#B3D7FF]/90' : '')} onClick={() => togglePeriod('quarterly')}>3M</Button>
            </div>
            {/* Year selector */}
            <div className="h-10 flex justify-center items-center gap-1">
              {currentYear > minYearValue && <Button colorScheme='tertiary' onClick={() => setCurrentYear(prev => prev - 1)}><VisaChevronLeftTiny/></Button>}
              <p className="justify-center text-Color-Text-text text-sm font-normal font-['Noto_Sans'] leading-none">{currentYear}</p>
                {currentYear < maxYearValue && <Button colorScheme='tertiary' onClick={() => setCurrentYear(prev => prev + 1)}><VisaChevronRightTiny /></Button>}
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
           {forecasted_datapoints && <DataPointIndicator title='Forcasted Spending' color='#023436'/>}
        </div>
        {/* First Indicator information */}
        {currentPriceInfomation && <div className="flex justify-start items-center gap-2.5">
            <p className="justify-center text-Color-Text-text text-xs font-bold font-['Noto_Sans'] leading-none">{currentPriceInfomation.valueType == 'Price' && '£'}{currentPriceInfomation.value.toFixed(2)}{currentPriceInfomation.valueType == 'Points' && ' Points'}</p>
            {currentPriceInfomation.percentChange && <p className={cn("justify-center text-Color-Messaging-positive-text text-xs font-normal font-['Noto_Sans'] leading-none", currentPriceInfomation.difference > 0 ? 'text-[#2C6849]' : 'text-[#AD2929]' )}>{currentPriceInfomation.difference > 0 && '+'}{currentPriceInfomation.valueType == 'Price' && '£'}{currentPriceInfomation.difference.toFixed(1)}{currentPriceInfomation.valueType == 'Points' && ' Points'} {currentPriceInfomation.difference > 0 && '+'}{currentPriceInfomation.percentChange?.toFixed(1)}%</p>}
        </div>}
    </section>
      </div>
      {/* Graph */}
      <div ref={containerRef} className='w-full flex h-[300px] z-50'>
        <svg ref={svgRef} className='w-full h-full'/>
      </div>
      <section>
        <h3>Forecast</h3>
        <Button colorScheme='secondary' onClick={() => forecastModalRef.current.toggleModal(true)}>Forecast Spending</Button>
        <ForecastModal ref={forecastModalRef} setForecastedDatapoints={setForecasted_datapoints}/>
      </section>
    </section>
  )
}

export default DashbaordPage