import ErrorIcon from '@/icons/error'
import { Button } from '@visa/nova-react'
import React from 'react'

type Props ={
  message: string,
  reset: () => void;
}
 
const ErrorModal = ({ message, reset }: Props) => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-Color-Surface-surface-1 overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-8">
        
        <div className='flex flex-col items-center justify-center gap-1'>
          {/* Graphic */}
          <ErrorIcon />
          {/* Text */}
          <div className="inline-flex flex-col justify-start items-start">
            <h2 className="self-stretch justify-start text-black text-xl font-semibold font-['Noto_Sans'] leading-normal text-center">Error</h2>
            <p className="px-4 self-stretch justify-start text-black text-sm font-normal font-['Noto_Sans'] leading-4">{message}</p>
          </div>
        </div>
        <Button onClick={reset} colorScheme='secondary'>Reload</Button>
      </div>
    </div>
  )
}

export default ErrorModal