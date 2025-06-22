import NotificationsList, { NotficationsType } from '@/components/NotificationsList'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Notifications",
  description: "User Notifications",
};

const NotficationsPage = () => {
    const notifications:NotficationsType[] = [
            {
        id: "1",
        headline: "System Maintenance",
        date: new Date("2025-06-18T10:00:00Z"),
        text: "Scheduled maintenance will occur this weekend from 2 AM to 4 AM.",
        href: 'notifications/notif001'
      },
      {
        id: "2",
        headline: "New Feature Released",
        date: new Date("2025-06-17T14:30:00Z"),
        text: "We've launched dark mode! You can enable it in your settings.",
        href: 'notifications/notif002'
      },
      {
        id: "3",
        headline: "Security Alert",
        date: new Date("2025-06-16T09:15:00Z"),
        text: "We detected a login from a new device. If this wasn't you, please update your password.",
        href: 'notifications/notif003'
      },
      {
        id: "4",
        headline: "Survey Invitation",
        date: new Date("2025-06-15T12:00:00Z"),
        text: "Help us improve by filling out a quick feedback survey.",
        href: 'notifications/notif004'
      },
      {
        id: "5",
        headline: "Account Update",
        date: new Date("2025-06-14T08:45:00Z"),
        text: "Your profile information has been successfully updated.",
        href: 'notifications/notif005'
      }
        ];

  return (
   <section className="w-full flex flex-col justify-center items-center relative bg-Color-Surface-surface-1 overflow-hidden">
    <h2 className="text-center w-fit text-Color-Visa-accent-accent-app-name text-6xl font-semibold font-['Noto_Sans'] leading-[78px] text-[#1434CB] my-6">
        Your Notifications, Muyiwa
    </h2>
    <div className="w-[1000px] min-w-[512px] flex flex-col items-center">
        <NotificationsList notifications={notifications} />
    </div>
</section>

  )
}

export default NotficationsPage