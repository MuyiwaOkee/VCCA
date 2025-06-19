import { ClickableContentCard } from '@/components/ClickableContentCard'
import { SectionDivider } from '@/components/SectionDivider'
import { SlimPagination } from '@/components/SlimPagination'
import React from 'react'

export type NotficationsType = {
    id: string,
    headline: string
    date: Date,
    text: string
}

type Props = {
    notifications:NotficationsType[]
}

const NotificationsList = ({ notifications }: Props) => {
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

export default NotificationsList