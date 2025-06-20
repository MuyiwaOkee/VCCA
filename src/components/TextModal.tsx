import React from 'react'
import { DeterminateCircularProgress } from './DeterminateCircularProgress'
import { Button } from '@visa/nova-react'
import cn from '@/utils/cn'
import ErrorIcon from '@/icons/error'

type ButtonProps = {
    text: string,
    icon?: React.ReactNode,
}

type StateType = {
    state: 'loading' | 'error' | 'viewing',
    message: string,
    progressValue?: number
}

type Props = {
    notificationTitle: string
    userType: 'Business' | 'Internal',
    stateClass: StateType,
    primaryButton: ButtonProps,
    secondaryButton?: ButtonProps
}

const TextModal = ({ userType, stateClass, primaryButton, secondaryButton, notificationTitle }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <section className="w-96 min-w-56 p-6 bg-white rounded-xl inline-flex flex-col justify-start items-center gap-8">
            <h3 className="justify-start text-Color-Text-text text-2xl font-medium font-['Noto_Sans'] leading-loose">{notificationTitle}</h3>
            <div className="self-stretch flex flex-col justify-start items-center gap-4">
                {stateClass.state === 'loading' && <DeterminateCircularProgress progressValue={stateClass.progressValue!} id='loading-circle'/>}
                {stateClass.state === 'error' && <ErrorIcon/>}
                <p className={cn("justify-start text-sm font-semibold font-['Noto_Sans'] leading-snug max-h-48 overflow-y-auto", stateClass.state == 'error' ? 'text-[#AD2929]' : 'text-black', stateClass.state === 'viewing' ? 'text-left' : 'text-center' )}>{stateClass.message}</p>
            </div>
            {/* Button(s) */}
            <div className="inline-flex justify-center items-start gap-8">
                {/* Primary */}
                <Button destructive={stateClass.state !== 'viewing'} colorScheme={stateClass.state === 'loading' ? 'tertiary' : undefined}>
                    {primaryButton.icon}
                    {primaryButton.text}
                    </Button>
                {/* Secondary */}
                {secondaryButton && <Button colorScheme='tertiary'>
                    {secondaryButton.icon}
                    {secondaryButton.text}
                    </Button>}
            </div>
        </section>
    </div>
  )
}

export default TextModal