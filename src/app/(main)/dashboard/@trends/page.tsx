"use client"
import { DefaultContentCard, IconButtonProps } from '@/components/DefaultContentCard'
import { TopTooltip } from '@/components/Tooltip'
import { VisaFileUploadTiny, VisaInformationAltHigh } from '@visa/nova-icons-react'
import React from 'react'

const TrendsModal = () => {
  const cardText = "As of mid-2025, global economic growth is modest, with easing inflation and high interest rates. Developed economies are stabilizing, while emerging markets face mixed conditions. China is recovering slowly. Geopolitical tensions and uncertain demand continue to challenge supply chains, keeping the outlook cautious but less recession-prone than before."

  const iconButtons:IconButtonProps[] = [
    {
      ariaLabel: 'share-btn',
      onClickFunc: () => console.log('share was clicked'),
      iconNode:  <VisaFileUploadTiny />
    },
    {
      ariaLabel: 'help-btn',
      iconNode: <TopTooltip tooltipText='infomation mate!'>
        <VisaInformationAltHigh/>
      </TopTooltip>
    }
  ]

  return (
    <DefaultContentCard id='trends-card' headline='Trend Summary' text={cardText} primaryButton={{
      text: 'click me',
      onClickFunc: () => console.log('trend summary btn was clicked')
    }} iconButtons={iconButtons}/>
  )
}

export default TrendsModal