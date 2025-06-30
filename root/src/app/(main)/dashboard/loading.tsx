import React from 'react'

const GraphsLoadingSkeleton = () => {
  return (
    <section className='w-full h-full bg-white overflow-hidden'>
      {/* Top Bar */}
      <div className="w-full inline-flex flex-col justify-start items-start gap-4">
        {/* Upper Bar */}
    <section className="self-stretch px-2 inline-flex justify-between items-center relative">
      {/* data picker */}
        <div className='w-[290px] h-15 bg-[#D3D3D3]'> 
        </div>
        {/* Time btns */}
        <div className="flex absolute top-6 right-0 justify-start items-center gap-4">
            <div className="flex justify-start items-center gap-2">
                <div className='w-10 h-10 bg-[#D3D3D3]'/>
                <div className='w-10 h-10 bg-[#D3D3D3]'/>
            </div>
            {/* Year selector */}
            <div className="h-10 w-25 bg-[#D3D3D3]" />
        </div>
    </section>
    {/* Lower Bar */}
    <section className="self-stretch inline-flex justify-between items-start">
      {/* Current selected data points */}
        <div className="flex justify-start items-center gap-4">
            <div className="flex justify-start items-center gap-1">
                <div className='w-6 h-1 bg-[#D3D3D3]'/>
                <div className='w-15 h-2.5 bg-[#D3D3D3]'/>
            </div>
        </div>
        {/* First Indicator information */}
        <div className="flex justify-start items-center gap-2.5">
           <div className='w-6 h-1 bg-[#D3D3D3]'/>
           <div className='w-6 h-1 bg-[#D3D3D3]'/>
           <div className='w-6 h-1 bg-[#D3D3D3]'/>
        </div>
    </section>
      </div>
      {/* Graph */}
      <div className='w-full h-[500px] bg-[#D3D3D3] z-50' />
    </section>
  )
}

export default GraphsLoadingSkeleton