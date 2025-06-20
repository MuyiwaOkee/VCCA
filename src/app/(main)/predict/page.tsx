"use client"
import TextModal, { TextModalRef } from '@/components/TextModal';
import { VisaFileUploadTiny } from '@visa/nova-icons-react';
import { Metadata } from 'next';
import React, { useRef } from 'react'

// export const metadata: Metadata = {
//   title: "Predict",
//   description: "Prediction page",
// };

const PreditionPage = () => {
  const textMsg = 'Hello';

  const modalRef = useRef<TextModalRef>(null);

  return (
    <section className='w-full'>
      <button onClick={() => modalRef.current?.toggleModal(true)}>Click me pls</button>
      <TextModal ref={modalRef} stateClass={{
        state: 'viewing',
        message: textMsg,
      }} 
      primaryButton={{
        text: 'Hello',
        icon: <VisaFileUploadTiny />
      }} secondaryButton={{
        text: 'Hello'
      }} notificationTitle='Report & Next Steps'/>
    </section>
  )
}

export default PreditionPage