import { DefaultContentCard } from '@/components/DefaultContentCard'
import React from 'react'

const TrendsModal = () => {
  const cardText = "As of mid-2025, global economic growth is modest, with easing inflation and high interest rates. Developed economies are stabilizing, while emerging markets face mixed conditions. China is recovering slowly. Geopolitical tensions and uncertain demand continue to challenge supply chains, keeping the outlook cautious but less recession-prone than before."
  return (
    <DefaultContentCard id='trends-card' headline='Trend Summary' text={cardText} primaryButton={{
      text: 'click me'
    }}/>
  )
}

export default TrendsModal