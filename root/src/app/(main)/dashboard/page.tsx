import React from 'react'
import DashbaordPage from './content'

function delayTwoSeconds(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000); // 2000 milliseconds = 2 seconds
  });
}

const page = async () => {
    await delayTwoSeconds();

  return <DashbaordPage />
}

export default page