import NotFoundGraphic from '@/graphics/notFoundGraphic'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <main className="flex w-screen h-screen justify-center items-center">
    <div className="inline-flex justify-start items-center gap-8">
        {/* SVG grpahic */}
        <NotFoundGraphic />
        {/*  Text */}
        <section className="w-fit inline-flex flex-col justify-start items-start gap-16">
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <h1 className="self-stretch justify-center text-[#1434CB] text-6xl font-semibold font-['Noto_Sans'] leading-[78px]">Sorry</h1>
              <p className="self-stretch text-start justify-center text-black text-base font-semibold font-['Noto_Sans'] leading-tight">This page could not be found</p>
          </div>
          <Link href='/dashboard' className="w-72 justify-start text-Color-Text-text text-xs font-semibold font-['Noto_Sans'] leading-none underline">Go to dashboard</Link>
        </section>
    </div>
  </main>
  )
}

export default NotFound