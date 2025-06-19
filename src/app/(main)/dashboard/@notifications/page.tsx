import { ClickableContentCard } from '@/components/ClickableContentCard'
import { SectionDivider } from '@/components/SectionDivider'
import { SlimPagination } from '@/components/SlimPagination'
import React from 'react'

type NotficationsType = {
    id: string,
    headline: string
    date: Date,
    text: string
}

const NotificationsModal = () => {
    const notifications:NotficationsType[] = [
        {
    id: "1",
    headline: "System Maintenance",
    date: new Date("2025-06-18T10:00:00Z"),
    text: "Scheduled maintenance will occur this weekend from 2 AM to 4 AM."
  },
  {
    id: "2",
    headline: "New Feature Released",
    date: new Date("2025-06-17T14:30:00Z"),
    text: "We've launched dark mode! You can enable it in your settings."
  },
  {
    id: "3",
    headline: "Security Alert",
    date: new Date("2025-06-16T09:15:00Z"),
    text: "We detected a login from a new device. If this wasn't you, please update your password."
  },
  {
    id: "4",
    headline: "Survey Invitation",
    date: new Date("2025-06-15T12:00:00Z"),
    text: "Help us improve by filling out a quick feedback survey."
  },
  {
    id: "5",
    headline: "Account Update",
    date: new Date("2025-06-14T08:45:00Z"),
    text: "Your profile information has been successfully updated."
  }
    ];
  return (
   <section className="self-stretch inline-flex flex-col justify-start items-end">
    <SlimPagination />
    <SectionDivider />
    <div className="self-stretch flex flex-col justify-start items-start overflow-y-auto max-h-[512px]">
        {
        notifications.map(({ id, headline, date, text}) => {
            return <ClickableContentCard key={id} headline={headline} subtitle={date.toISOString().split('T')[0]}  text={text}/>
        })
    }
    </div>
</section>
  )
}

export default NotificationsModal