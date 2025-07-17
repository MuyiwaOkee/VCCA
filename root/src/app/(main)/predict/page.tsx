import { verifySession } from '@/lib/session';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Predict",
  description: "Prediction page",
};

const PreditionPage = async () => {
  const session = await verifySession();

  const response = await fetch(`http://localhost:8000/user/${session?.userid}`, {
    method: 'GET',
    headers: {
      'Content-Type' : 'application/json'
    }
  });

  if(!response.ok){
    throw new Error("No user data found");
  }

  const data = await response.json();

  if(data.role != "Analyst (Internal)") {
    return (
    <section className='w-full text-black'>
     Only internal VISA analysts can access this page
    </section>
  )
  }

  return (
    <section className='w-full text-black'>
      Hello there
    </section>
  )
}






export default PreditionPage