'use client'
import ErrorModal from "@/components/StateModals/ErrorModal"
import React from "react"


 export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) { 
 
  return (
    <section className="w-[1000px] h-[500px] bg-white inline-flex flex-col gap-2 justify-center items-center rounded-xl border border-gray-200 shadow-sm shadow-gray-300 p-6">
        <ErrorModal message={error.message} reset={reset}/>
    </section>
  )
}