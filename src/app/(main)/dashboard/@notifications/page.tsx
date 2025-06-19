import { ClickableContentCard } from '@/components/ClickableContentCard'
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
//   {
//     id: "4",
//     headline: "Survey Invitation",
//     date: new Date("2025-06-15T12:00:00Z"),
//     text: "Help us improve by filling out a quick feedback survey."
//   },
//   {
//     id: "5",
//     headline: "Account Update",
//     date: new Date("2025-06-14T08:45:00Z"),
//     text: "Your profile information has been successfully updated."
//   }
    ];
  return (
   <div className="self-stretch inline-flex flex-col justify-start items-end">
    <SlimPagination />
    {/* <div data-column-divider="false" data-column-menu="false" data-column-options="true" data-show-label="true" data-sort-by="true" data-type="Default" className="self-stretch px-4 py-1.5 bg-Color-Surface-surface-1 border-b-2 border-Color-Active-active inline-flex justify-start items-center gap-1">
        <div className="flex-1 flex justify-start items-center gap-2.5">
            <div className="flex-1 justify-center text-Color-Active-active text-sm font-medium font-['Noto_Sans'] leading-none">Logs</div>
        </div>
        <div data-btn-size="Small (web only)" data-show-badge="false" data-state="Default" data-style="Default" className="w-6 h-6 p-1.5 rounded-[48px] outline outline-1 outline-offset-[-1px] outline-black/0 flex justify-center items-center">
            <div data-brand="Visa" data-size="Tiny (16x16)" className="w-4 h-4 relative overflow-hidden">
                <div className="w-px h-px left-[8px] top-[7px] absolute opacity-0 bg-blue-700" />
            </div>
        </div>
        <div data-btn-size="Small (web only)" data-show-badge="false" data-state="Default" data-style="Default" className="w-6 h-6 p-1.5 rounded-[48px] outline outline-1 outline-offset-[-1px] outline-black/0 flex justify-center items-center">
            <div data-brand="Visa" data-size="Tiny (16x16)" className="w-4 h-4 relative overflow-hidden">
                <div className="w-px h-px left-[8px] top-[7px] absolute opacity-0 bg-blue-700" />
            </div>
        </div>
    </div> */}
    <div className="self-stretch flex flex-col justify-start items-start">
        {
        notifications.map(({ id, headline, date, text}) => {
            return <ClickableContentCard key={id} headline={headline} subtitle={date.toISOString().split('T')[0]}  text={text}/>
        })
    }
    </div>
</div>
  )
}

export default NotificationsModal