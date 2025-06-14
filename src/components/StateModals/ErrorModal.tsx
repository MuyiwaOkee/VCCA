import ErrorIcon from '@/icons/error'
import React from 'react'

const ErrorModal = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-Color-Surface-surface-1 overflow-hidden">
    <div className="w-52 inline-flex justify-start items-center gap-4">
        {/* Graphic */}
        <ErrorIcon />
        {/* Text */}
        <div className="w-28 inline-flex flex-col justify-start items-start">
            <h3 className="self-stretch justify-start text-black text-base font-semibold font-['Noto_Sans'] leading-normal">Error</h3>
            <p className="self-stretch justify-start text-black text-xs font-normal font-['Noto_Sans'] leading-none">Data couldn’t be loaded</p>
        </div>
    </div>
</div>
  )
}

export default ErrorModal