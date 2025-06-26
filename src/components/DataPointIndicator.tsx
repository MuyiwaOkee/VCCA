import React from 'react'

type Props = {
    color: string,
    title: string
}

const DataPointIndicator = ({ color, title }: Props) => {
    // const classNameString = ;
  return (
    <div className="flex justify-start items-center gap-1">
        <div className='w-6 h-1' style={{backgroundColor: color}}/>
        <p className="justify-center text-Color-Text-text text-xs font-normal font-['Noto_Sans'] leading-none">{title}</p>
    </div>
  )
}

export default DataPointIndicator