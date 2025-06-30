import WarningIcon from '@/icons/warning'
import React from 'react'

const WarningModal = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-Color-Surface-surface-1 overflow-hidden">
    <div className="w-52 inline-flex justify-start items-center gap-4">
        {/* Graphic */}
        <WarningIcon />
        {/* Text */}
        <div className="w-28 inline-flex flex-col justify-start items-start">
            <h3 className="self-stretch justify-start text-black text-base font-semibold font-['Noto_Sans'] leading-normal">Warning</h3>
            <p className="self-stretch justify-start text-black text-xs font-normal font-['Noto_Sans'] leading-none">Data not found</p>
        </div>
    </div>
</div>
  )
}

export default WarningModal