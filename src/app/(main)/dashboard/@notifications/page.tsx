import React from 'react'

const NotificationsModal = () => {
  return (
   <div className="self-stretch inline-flex flex-col justify-start items-end">
    <div className="w-72 inline-flex justify-between items-center">
        <div data-btn-size="Medium" data-show-badge="false" data-state="Disabled" data-style="Default" className="w-8 h-8 p-2.5 rounded-[48px] outline outline-1 outline-offset-[-1px] outline-black/0 flex justify-center items-center">
            <div data-brand="Visa" data-size="Tiny (16x16)" className="w-4 h-4 relative">
                <div className="w-px h-px left-[5px] top-[7px] absolute opacity-0 bg-blue-700" />
            </div>
        </div>
        <div data-selected="On" data-state="Default" className="p-1.5 rounded-[48px] outline outline-1 outline-offset-[-1px] outline-Color-Active-active flex justify-center items-center">
            <div className="min-w-4 text-center justify-start text-Color-Active-active text-xs font-medium font-['Noto_Sans'] leading-none">1</div>
        </div>
        <div data-selected="Off" data-state="Default" className="p-1.5 rounded-[48px] outline outline-1 outline-offset-[-1px] outline-black/0 flex justify-center items-center">
            <div className="min-w-4 text-center justify-start text-Color-Active-active text-xs font-normal font-['Noto_Sans'] leading-none">2</div>
        </div>
        <div data-selected="Off" data-state="Default" className="p-1.5 rounded-[48px] outline outline-1 outline-offset-[-1px] outline-black/0 flex justify-center items-center">
            <div className="min-w-4 text-center justify-start text-Color-Active-active text-xs font-normal font-['Noto_Sans'] leading-none">3</div>
        </div>
        <div data-btn-size="Medium" data-show-badge="false" data-state="Default" data-style="Default" className="w-8 h-8 p-2.5 rounded-[48px] outline outline-1 outline-offset-[-1px] outline-black/0 flex justify-center items-center">
            <div data-brand="Visa" data-size="Tiny (16x16)" className="w-4 h-4 relative">
                <div className="w-px h-px left-[9px] top-[9px] absolute opacity-0 bg-blue-700" />
            </div>
        </div>
    </div>
    <div data-column-divider="false" data-column-menu="false" data-column-options="true" data-show-label="true" data-sort-by="true" data-type="Default" className="self-stretch px-4 py-1.5 bg-Color-Surface-surface-1 border-b-2 border-Color-Active-active inline-flex justify-start items-center gap-1">
        <div className="flex-1 flex justify-start items-center gap-2.5">
            <div className="flex-1 justify-center text-Color-Active-active text-sm font-medium font-['Noto_Sans'] leading-none">Logs</div>
        </div>
        <div data-btn-size="Small (web only)" data-show-badge="false" data-state="Default" data-style="Default" className="w-6 h-6 p-1.5 rounded-[48px] outline outline-1 outline-offset-[-1px] outline-black/0 flex justify-center items-center">
            <div data-brand="Visa" data-size="Tiny (16x16)" className="w-4 h-4 relative overflow-hidden">
                <div className="w-px h-px left-[8px] top-[7px] absolute opacity-0 bg-blue-700" />
            </div>
        </div>
        <div data-btn-size="Small (web only)" data-show-badge="false" data-state="Default" data-style="Default" className="w-6 h-6 p-1.5 rounded-[48px] outline outline-1 outline-offset-[-1px] outline-black/0 flex justify-center items-center">
            <div data-brand="Visa" data-size="Tiny (16x16)" className="w-4 h-4 relative overflow-hidden">
                <div className="w-px h-px left-[8px] top-[7px] absolute opacity-0 bg-blue-700" />
            </div>
        </div>
    </div>
    <div className="self-stretch flex flex-col justify-start items-start">
        <div className="self-stretch flex flex-col justify-start items-center">
            <div data-1-ui-button="false" data-2-ui-button="true" data-bottom-rule="false" data-show-slot-2="true" data-show-slot-3="false" data-show-slot-4="false" className="self-stretch p-5 bg-Color-Surface-surface-1 rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-Color-Decorative-border/10 flex flex-col justify-start items-start gap-2 overflow-hidden">
                <div data-headline-rule="false" data-subhead="true" className="self-stretch flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-Color-Active-active text-lg font-semibold font-['Noto_Sans'] leading-normal">New Interest Rate</div>
                    <div className="self-stretch justify-start text-Color-Text-text-subtle text-sm font-semibold font-['Noto_Sans'] leading-none">2025-01-07</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-2">
                    <div className="flex-1 justify-start text-Color-Text-text text-sm font-normal font-['Noto_Sans'] leading-snug">Intest rate is now 0.75 basis points. </div>
                </div>
            </div>
            <div className="self-stretch h-px flex flex-col justify-end items-start gap-2">
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-Color-Active-active"></div>
            </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-center">
            <div data-1-ui-button="false" data-2-ui-button="true" data-bottom-rule="false" data-show-slot-2="true" data-show-slot-3="false" data-show-slot-4="false" className="self-stretch p-5 bg-Color-Surface-surface-1 rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-Color-Decorative-border/10 flex flex-col justify-start items-start gap-2 overflow-hidden">
                <div data-headline-rule="false" data-subhead="true" className="self-stretch flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-Color-Active-active text-lg font-semibold font-['Noto_Sans'] leading-normal">New Credit Card Data</div>
                    <div className="self-stretch justify-start text-Color-Text-text-subtle text-sm font-semibold font-['Noto_Sans'] leading-none">2024-12-07</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-2">
                    <div className="flex-1 justify-start text-Color-Text-text text-sm font-normal font-['Noto_Sans'] leading-snug">Credit card data for the month of December now available</div>
                </div>
            </div>
            <div className="self-stretch h-px flex flex-col justify-end items-start gap-2">
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-Color-Active-active"></div>
            </div>
        </div>
        <div className="self-stretch flex flex-col justify-start items-center">
            <div data-1-ui-button="false" data-2-ui-button="true" data-bottom-rule="false" data-show-slot-2="true" data-show-slot-3="false" data-show-slot-4="false" className="self-stretch p-5 bg-Color-Surface-surface-1 rounded-[10px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-Color-Decorative-border/10 flex flex-col justify-start items-start gap-2 overflow-hidden">
                <div data-headline-rule="false" data-subhead="true" className="self-stretch flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch justify-start text-Color-Active-active text-lg font-semibold font-['Noto_Sans'] leading-normal">New Credit Card Data</div>
                    <div className="self-stretch justify-start text-Color-Text-text-subtle text-sm font-semibold font-['Noto_Sans'] leading-none">2024-11-07</div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start gap-2">
                    <div className="flex-1 justify-start text-Color-Text-text text-sm font-normal font-['Noto_Sans'] leading-snug">Credit card data for the month of November now available</div>
                </div>
            </div>
            <div className="self-stretch h-px flex flex-col justify-end items-start gap-2">
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-Color-Active-active"></div>
            </div>
        </div>
    </div>
</div>
  )
}

export default NotificationsModal