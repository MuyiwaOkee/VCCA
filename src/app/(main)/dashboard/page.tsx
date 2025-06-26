import { Button } from '@visa/nova-react'
import { VisaChevronLeftTiny, VisaChevronRightTiny } from "@visa/nova-icons-react";
import React from 'react'
import DataPointIndicator from '@/components/DataPointIndicator';
import { MultiselectWithMultipleSelectionsAndVerticalScroll } from '@/components/MultiSelectWithScrollbar';

const DashbaordPage = () => {
  const indicators = [
    {
      color: '#0000FF',
      title: 'Interest rate'
    },
    {
      color: '#FF0000',
      title: 'Spending'
    },
  ];

  const multiselectItems = [
  { value: 'Option A' },
  { value: 'Option B' },
  { value: 'Option C' },
  { value: 'Option D' },
  { value: 'Option E' },
  { value: 'Option F' },
  { value: 'Option G' },
  { value: 'Option H' },
  { value: 'Option I' },
  { value: 'Option J' },
  { value: 'Option K' },
  { value: 'Option L' },
  { value: 'Option M' },
];

  return (
    <section className='w-full h-full bg-white overflow-hidden'>
      <div className="w-full inline-flex flex-col justify-start items-start gap-20">
        {/* Upper Bar */}
    <section className="self-stretch px-2 inline-flex justify-between items-center relative">
      {/* data picker */}
        <div className='absolute top-0 left-0'>
          <MultiselectWithMultipleSelectionsAndVerticalScroll label='Data sources' isRequired id='datapoint-dropdown' items={multiselectItems} />
        </div>
        {/* Time btns */}
        <div className="flex absolute top-6 right-0 justify-start items-center gap-4">
            <div className="flex justify-start items-center gap-2">
                <Button colorScheme='secondary'>1M</Button>
                <Button colorScheme='secondary'>3M</Button>
            </div>
            {/* Year selector */}
            <div className="h-10 flex justify-center items-center gap-1">
              <Button colorScheme='tertiary'><VisaChevronLeftTiny/></Button>
              <p className="justify-center text-Color-Text-text text-sm font-normal font-['Noto_Sans'] leading-none">2025</p>
                <Button colorScheme='tertiary'><VisaChevronRightTiny /></Button>
            </div>
        </div>
    </section>
    {/* Lower Bar */}
    <section className="self-stretch inline-flex justify-between items-start">
      {/* Current selected data points */}
        <div className="flex justify-start items-center gap-4">
           {
            indicators.map((props, key) => {
              return  <DataPointIndicator key={key} {...props}/>
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
    </section>
  )
}

export default DashbaordPage