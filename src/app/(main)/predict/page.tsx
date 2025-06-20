import TextModal from '@/components/TextModal';
import { VisaFileUploadTiny } from '@visa/nova-icons-react';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Predict",
  description: "Prediction page",
};

const PreditionPage = () => {
  const textMsg = 'Hello';


  return (
    <section className='w-full'>
      <TextModal stateClass={{
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