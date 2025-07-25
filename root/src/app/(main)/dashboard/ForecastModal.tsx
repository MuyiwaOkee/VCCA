"use client"
import { ErrorInput } from '@/components/ErrorInput'
import { VisaAddLow, VisaCloseTiny, VisaErrorTiny, VisaFileUploadTiny, VisaInformationAltHigh } from '@visa/nova-icons-react'
import { Button, InputMessage } from '@visa/nova-react'
import React, { forwardRef, useActionState, useEffect, useImperativeHandle, useRef, useState } from 'react'
import ErrorCombobox, { ComboboxItem } from '@/components/ErrorCombobox'
import { GetForecast } from './action'
import { datapoints_response } from '@/types/response/analytics/datapoints_response'

type Props = {
    setForecastedDatapoints: (data: datapoints_response | undefined) => void
}

export type ForecastModalProps = {
  toggleModal: (show: boolean) => void
}

const ForecastModal = forwardRef<ForecastModalProps, Props>(({ setForecastedDatapoints }, ref) => {
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
    const defaultSelectedMonths = [0];
    const [selectedMonths, setSelectedMonths] = useState<number[]>(defaultSelectedMonths);

    const [state, forecastAction, isPending] = useActionState(GetForecast, undefined);
    const formRef = useRef<HTMLFormElement>(null!);
    
    const [isVisible, setIsVisible] = useState(false);

    const HandleOnClose = () => {
      setIsVisible(false);
      setSelectedMonths(defaultSelectedMonths);
    };

    const HandleSubmit = (e: React.KeyboardEvent<HTMLFormElement>) => {    
          if(e.code === 'Enter') {
              e.preventDefault();
              formRef.current.requestSubmit();
          }
      };

    // Expose the toggle function via ref
    useImperativeHandle(ref, () => ({
        toggleModal: (show: boolean) => {
            setIsVisible(show);
        }
    }));

    useEffect(() => {
      if(!state?.data) return;

      setForecastedDatapoints(state.data);
      HandleOnClose();
    }, [state])
    
    
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <section className="w-fit min-w-56 p-6 bg-white rounded-xl relative inline-flex flex-col justify-start items-center gap-8">
                <button className='absolute right-6 cursor-pointer' onClick={HandleOnClose}>
                    <VisaCloseTiny />
                </button>
                <h3 className="justify-start text-Color-Text-text text-2xl font-medium font-['Noto_Sans'] leading-loose">Next Quarters Forecast</h3>
                <div className="self-stretch flex flex-col justify-start gap-8">
                  {state?.error && 
                  <p className="px-4 self-stretch justify-start text-[#AD2929] text-sm font-normal font-['Noto_Sans'] leading-4">{state?.error}</p>
                  }
                    <form ref={formRef} action={forecastAction} onKeyDown={HandleSubmit} className='inline-flex flex-col justify-start items-center gap-8'>
                      <div className='flex flex-row gap-4'>
                      {
                        selectedMonths.map((month) => {
                          return <section className="relative self-stretch flex flex-col justify-start items-start gap-4">
                            <div className='absolute top-0 left-0'>
                              <ErrorCombobox id={`month_${month}`} label='month' isRequired items={months} errorText={undefined} defaultItemIndex={new Date().getMonth() + month}/>
                            </div>
                            <div className='mt-20.5'>
                              <ErrorInput id={`year_${month}`} label='Year' isRequired errorText={undefined} defaultValue={new Date().getFullYear()}/>
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
                      {selectedMonths.length == 1 && <section className="w-[172px] h-[346px] rounded-lg bg-[#4D4D4D]">
                      </section>}
                      </div>
                      <div className="inline-flex justify-center items-start gap-8">
                        <Button>
                          {isPending ? 'getting predictions' : 'Get Forecast'}
                        </Button>
                      </div>   
                    </form>
                </div>
            </section>
        </div>
    )
});

export default ForecastModal