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
    <section className="self-stretch h-full bg-white inline-flex flex-col gap-2 justify-center items-center">
        <ErrorModal message={error.message} reset={reset}/>
    </section>
  )
}