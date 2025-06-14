import React from 'react'
import { IndeterminateProgress } from '../IndeterminateProgressBar'

const LoadingModal = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-Color-Surface-surface-1 overflow-hidden">
    <IndeterminateProgress id='progress-bar' loadingMsg='loading' className='w-28'/>
</div>
  )
}

export default LoadingModal