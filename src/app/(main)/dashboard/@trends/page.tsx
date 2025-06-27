import React from 'react'
import TrendsModalContent from './content'

function delayTwoSeconds(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000); // 2000 milliseconds = 2 seconds
  });
}

const TrendsModal = async () => {
    await delayTwoSeconds();
    
    return <TrendsModalContent />
}

export default TrendsModal