"use client"
import { Button } from '@visa/nova-react'
import { VisaChevronLeftTiny, VisaChevronRightTiny } from "@visa/nova-icons-react";
import React, { useCallback, useState } from 'react'
import DataPointIndicator from '@/components/DataPointIndicator';
import { MultiselectItem, MultiselectRef, MultiselectWithMultipleSelectionsAndVerticalScroll } from '@/components/MultiSelectWithScrollbar';
import cn from '@/utils/cn';

const DashbaordPage = () => {
  const [selectedIndicators, setSelectedIndicators] = useState<MultiselectItem[]>([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const multiSelectRef = useCallback((value: MultiselectItem[]) => {
    setSelectedIndicators(value);
  }, []);
  

  const multiselectItems:MultiselectItem[] = [
    { value: 'Interest rate', color: '#FF0000'},
    { value: 'Option B', color: '#0000FF' },
    { value: 'Option C', color: '#00FF00' },
  ];

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
            <p className="justify-center text-Color-Text-text text-xs font-normal font-['Noto_Sans'] leading-none">0.5 points</p>
            <p className="justify-center text-Color-Messaging-positive-text text-xs font-normal font-['Noto_Sans'] leading-none">+0.1 points (20%)</p>
        </div>
    </section>
      </div>
      {/* Graph */}
    </section>
  )
}

export default DashbaordPage