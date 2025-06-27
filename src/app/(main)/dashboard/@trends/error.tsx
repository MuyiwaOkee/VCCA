'use client'
import ErrorModal from '@/components/StateModals/ErrorModal'
import React from 'react'

const TrendsModalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
   return (
    <section className="self-stretch h-full bg-white inline-flex flex-col gap-2 justify-center items-center rounded-xl border border-gray-200 shadow-sm shadow-gray-300 p-6">
        <ErrorModal message={error.message} reset={reset}/>
    </section>
  )
}

export default TrendsModalError