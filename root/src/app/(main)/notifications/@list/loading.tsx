import React from 'react'

function delayTwoSeconds(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000); // 2000 milliseconds = 2 seconds
  });
}

const NotificationsLoadingPage = async () => {
    await delayTwoSeconds();

  return (
//     <section className="w-full flex flex-col justify-center items-center relative bg-Color-Surface-surface-1 overflow-hidden">
//     {/* */}
    
// </section>
<div className="w-[1000px] min-w-[512px] flex flex-col items-center">
        <section className="self-stretch inline-flex flex-col gap-2 justify-start items-end">
        <div className="bg-[#D3D3D3] w-[216px] h-9"/> 
        <div className="self-stretch bg-[#D3D3D3] h-[512px]"/>
    </section>
    </div>
  )
}

export default NotificationsLoadingPage