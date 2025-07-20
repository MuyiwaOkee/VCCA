"use client"
import { DefaultContentCard, IconButtonProps } from '@/components/DefaultContentCard'
import { ErrorInput } from '@/components/ErrorInput'
import { TextModalRef } from '@/components/TextModal'
import { TopTooltip } from '@/components/Tooltip'
import { VisaAddLow, VisaCloseTiny, VisaFileUploadTiny, VisaInformationAltHigh } from '@visa/nova-icons-react'
import { Button } from '@visa/nova-react'
import React, { forwardRef, useActionState, useImperativeHandle, useRef, useState } from 'react'
import ErrorCombobox, { ComboboxItem } from '@/components/ErrorCombobox'
import { GetForecast } from './action'

const TrendsModalContent = () => {
  const modalRef = useRef<TextModalRef>(null);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([0]);

  const [state, forecastAction, isPending] = useActionState(GetForecast, undefined);
      const formRef = useRef<HTMLFormElement>(null!);
      
      const HandleSubmit = (e: React.KeyboardEvent<HTMLFormElement>) => {    
          if(e.code === 'Enter') {
              e.preventDefault();
              formRef.current.requestSubmit();
          }
      };
  
  const cardText = "As of mid-2025, global economic growth is modest, with easing inflation and high interest rates. Developed economies are stabilizing, while emerging markets face mixed conditions. China is recovering slowly. Geopolitical tensions and uncertain demand continue to challenge supply chains, keeping the outlook cautious but less recession-prone than before."

  const months: ComboboxItem[] = [
    { value: 'January' },
    { value: 'February' },
    { value: 'March' },
    { value: 'April' },
    { value: 'May' },
    { value: 'June' },
    { value: 'July' },
    { value: 'August' },
    { value: 'September' },
    { value: 'October' },
    { value: 'November' },
    { value: 'December' }
  ]

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
        <form ref={formRef} action={forecastAction} onKeyDown={HandleSubmit} className='inline-flex flex-col justify-start items-center gap-8'>
          <div className='flex flex-row gap-4'>
          {
            selectedMonths.map((month) => {
              return <section className="relative self-stretch flex flex-col justify-start items-start gap-4">
                <div className='absolute top-0 left-0'>
                  <ErrorCombobox id={`month_${month}`} label='month' isRequired items={months} errorText={undefined}/>
                </div>
                <div className='mt-20.5'>
                  <ErrorInput id={`year_${month}`} label='Year' isRequired errorText={undefined}/>
                </div>
                <ErrorInput id={`income_${month}`} label='Disposable income' isRequired errorText={undefined}/>
                <ErrorInput id={`interest_${month}`} label='Interest rate' isRequired errorText={undefined}/>
                <ErrorInput id={`unemployment_${month}`} label='Unemployment rate' isRequired errorText={undefined}/>
          </section>
            })
          }
          {/* Add new month btn */}
          {selectedMonths.length < 3 && <section className="w-[172px] h-[346px] rounded-lg border-2 border-dashed border-[#1434CB] flex flex-col justify-center items-center cursor-pointer gap-2" onClick={() => setSelectedMonths(prev => [...prev, prev.length])}>
            <VisaAddLow/>
            <p className='text-sm leading-snug'>Add Another Month</p>
          </section>}
          </div>
          <div className="inline-flex justify-center items-start gap-8">
            <Button>
              {isPending ? 'getting predictions' : 'Get Forecast'}
            </Button>
          </div>   
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
            </section>
        </div>
    )
});

export default TrendsModalContent