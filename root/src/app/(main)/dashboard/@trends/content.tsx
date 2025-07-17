"use client"
import { DefaultContentCard, IconButtonProps } from '@/components/DefaultContentCard'
import { ErrorInput } from '@/components/ErrorInput'
import { TextModalRef } from '@/components/TextModal'
import { TopTooltip } from '@/components/Tooltip'
import { VisaAddHigh, VisaCloseTiny, VisaFileUploadTiny, VisaInformationAltHigh } from '@visa/nova-icons-react'
import { Button } from '@visa/nova-react'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

const TrendsModalContent = () => {
  const modalRef = useRef<TextModalRef>(null);
  
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
      </TopTooltip>,
      isButton: true
    }
  ]

  return (
    <>
      <DefaultContentCard id='trends-card' headline='Trend Summary' text={cardText} primaryButton={{
      text: 'click me',
      onClickFunc: () => modalRef.current?.toggleModal(true)
    }} iconButtons={iconButtons}/>
      <ForecastModel ref={modalRef}>
        {/* This is the default year */}
        {/* <div className='w-40'>
          <ErrorInput id='email' label='Year' isRequired errorText={undefined}/>
        </div> */}
        <form action="" className='flex flex-row gap-4'>
          <section className="self-stretch flex flex-col justify-start items-start gap-4">
           <ErrorInput id='email' label='Month' isRequired errorText={undefined}/>
           <ErrorInput id='email' label='Year' isRequired errorText={undefined}/>
           <ErrorInput id='email' label='Disposable income' isRequired errorText={undefined}/>
           <ErrorInput id='email' label='Interest rate' isRequired errorText={undefined}/>
           <ErrorInput id='email' label='Unemployment rate' isRequired errorText={undefined}/>
          </section>
          <section className="self-stretch flex flex-col justify-start items-start gap-4">
           <ErrorInput id='email' label='Month' isRequired errorText={undefined}/>
           <ErrorInput id='email' label='Year' isRequired errorText={undefined}/>
           <ErrorInput id='email' label='Disposable income' isRequired errorText={undefined}/>
           <ErrorInput id='email' label='Interest rate' isRequired errorText={undefined}/>
           <ErrorInput id='email' label='Unemployment rate' isRequired errorText={undefined}/>
          </section>
          <section className="self-stretch flex flex-col justify-start items-start gap-4">
           <ErrorInput id='email' label='Month' isRequired errorText={undefined}/>
           <ErrorInput id='email' label='Year' isRequired errorText={undefined}/>
           <ErrorInput id='email' label='Disposable income' isRequired errorText={undefined}/>
           <ErrorInput id='email' label='Interest rate' isRequired errorText={undefined}/>
           <ErrorInput id='email' label='Unemployment rate' isRequired errorText={undefined}/>
          </section>
          {/* Add new month btn */}
          <section className="w-[172px] h-[346px] rounded-lg border-2 border-dashed border-[#1434CB] flex flex-col justify-center items-center cursor-pointer gap-2">
            <VisaAddHigh/>
            <p>Add Another Month</p>
          </section>
        </form>
      </ForecastModel>
    </>
  )
}

type Props = {
    children: React.ReactNode
}

const ForecastModel = forwardRef<TextModalRef, Props>(({ children }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const HandleOnClose = () => setIsVisible(false);

    // Expose the toggle function via ref
    useImperativeHandle(ref, () => ({
        toggleModal: (show: boolean) => {
            setIsVisible(show);
        }
    }));

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <section className="w-fit min-w-56 p-6 bg-white rounded-xl relative inline-flex flex-col justify-start items-center gap-8">
                <button className='absolute right-6 cursor-pointer' onClick={HandleOnClose}>
                    <VisaCloseTiny />
                </button>
                <h3 className="justify-start text-Color-Text-text text-2xl font-medium font-['Noto_Sans'] leading-loose">Next Quarters Forecast</h3>
                <div className="self-stretch flex flex-col justify-start gap-8">
                    {children}
                </div>
                {/* Button(s) */}
                <div className="inline-flex justify-center items-start gap-8">
                    {/* Primary */}
                    <Button>
                      Get Forecast
                    </Button>
                </div>
            </section>
        </div>
    )
});

export default TrendsModalContent