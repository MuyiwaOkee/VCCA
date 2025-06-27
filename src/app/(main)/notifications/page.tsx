import NotificationsList, { NotficationsType } from '@/components/NotificationsList'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Notifications",
  description: "User Notifications",
};

function delayTwoSeconds(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000); // 2000 milliseconds = 2 seconds
  });
}

const NotficationsPage = async () => {
  await delayTwoSeconds();
   

  return (
   <section className="w-full flex flex-col justify-center items-center relative bg-Color-Surface-surface-1 overflow-hidden">
    <h2 className="text-center w-fit text-Color-Visa-accent-accent-app-name text-6xl font-semibold font-['Noto_Sans'] leading-[78px] text-[#1434CB] my-6">
        Your Notifications, Muyiwa
    </h2>
</section>

  )
}

export default NotficationsPage