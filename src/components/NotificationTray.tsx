"use client"
import ErrorIcon from '@/icons/error'
import WarningIcon from '@/icons/warning'
import cn from '@/utils/cn'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'

export type NotificationItemProps = {
    id: string
    title: string,
    message: string,
    timestamp: Date,
    link?: {
        href: string,
        text: string
    },
    urgency?: 'Warning' | 'Error',
    seen: boolean
}

type NotficationTrayProps = {
    seenNotifications: NotificationItemProps[]
    unseenNotifications: NotificationItemProps[]
}

const NotificationTray = ({ seenNotifications, unseenNotifications }: NotficationTrayProps) => {
  return (
    <div data-mark-as-read-button="true" data-scrollbar="false" data-section-label="true" data-show-footer="true" data-show-header="true" data-show-top-app-bar="true" data-state="Default" className="w-96 px-px py-1.5 bg-white rounded-lg s shadow-[0px_4px_10px_2px_rgba(0,0,0,0.10)]  outline-offset-[-1px] outline-Color-Decorative-border/10 inline-flex flex-col justify-start items-start gap-1">
      {/* Header */}
      <section className="self-stretch px-2.5 py-3 rounded-md inline-flex justify-start items-center gap-2">
          <h4 className="flex-1 self-stretch justify-center text-[#4a4a4a] text-xs font-semibold font-['Noto_Sans'] uppercase leading-3 tracking-wide">Notifications</h4>
          <button className="text-center justify-center text-[#1434CB] text-xs font-semibold font-['Noto_Sans'] leading-none tracking-tight cursor-pointer">Mark all as read</button>
      </section>
    {/* Content */}
    <section>
      {
        unseenNotifications.map((props) => {
            return <NotificationItem key={props.id} {...props}/>
        })
      }
    <div className="self-stretch px-2.5 pt-2 pb-[3px] rounded-md inline-flex justify-start items-center">
        <p className="flex-1 self-stretch justify-center text-[#4a4a4a] text-[10px] font-semibold font-['Noto_Sans'] uppercase leading-3 tracking-wide">PAST NOTIFICATIONS</p>
    </div>
    {
        seenNotifications.map((props) => {
            return <NotificationItem key={props.id} {...props}/>
        })
      }
    </section>
    {/* Footer  */}
    <section className="self-stretch px-2.5 py-2.5 inline-flex justify-start items-center gap-1.5">
        <Link className="flex-1 justify-center text-Color-Active-active text-sm font-medium font-['Noto_Sans'] underline leading-snug text-[#1434CB]" href={'/notifications'}>See all</Link>
    </section>
</div>
  )
}

export const NotificationItem = ({ title, message, timestamp, link, urgency, seen = false }: NotificationItemProps) => {
    const router = useRouter();
  return (
  <div data-show-link="true" data-show-timestamp="true" data-show-title="true" data-state="Default" data-urgency="Warning" className="w-full pr-4 inline-flex justify-between items-center gap-1.5 overflow-hidden hover:bg-[#E5F1FF] cursor-pointer" onClick={() => link && router.push(link?.href)}>
    {!seen && <div className="w-0 self-stretch pl-1 inline-flex justify-start items-center">
      <div className={cn("flex-1 self-stretch origin-top-left outline-[2px] outline-offset-[-1.50px]", urgency ? urgency == 'Warning' ? 'outline-[#C38004]' : 'outline-[#AD2929]' : 'outline-[#0088c7]')} />
    </div>}
      <div className={cn("flex-1  py-2 inline-flex flex-col justify-center items-start gap-1", seen ? 'px-4' : 'px-1')}>
          <div className="self-stretch flex flex-col justify-start items-start">
              <h3 className="w-64 justify-center text-Color-Text-text text-sm font-semibold font-['Noto_Sans'] leading-snug">{title}</h3>
              <p className="self-stretch justify-center text-Color-Text-text-subtle text-sm font-normal font-['Noto_Sans'] leading-snug">{message}</p>
          </div>
          {link && <div data-state="Default" className="self-stretch inline-flex justify-start items-center gap-1">
              <Link className="flex-1 justify-center text-Color-Active-active text-sm font-medium font-['Noto_Sans'] underline leading-snug text-[#1434CB]" href={link.href}>{link.text}</Link>
          </div>}
          <p className="self-stretch justify-center text-[#4a4a4a] text-xs font-normal font-['Noto_Sans'] leading-none">{timestamp.toISOString().split('T')[0]}</p>
      </div>
      {urgency ? 
      urgency === 'Warning' ? <WarningIcon width={32} height={32} /> : <ErrorIcon width={32} height={32} />
      : null}
  </div> 
  )
}

export default NotificationTray