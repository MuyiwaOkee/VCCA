import React from 'react'
import LogoIcon from "@/icons/logo";
import {
  Button
} from "@visa/nova-react";
import Link from 'next/link';
import { ErrorInput } from '@/components/ErrorInput';
import { ComboboxItem, ErrorCombobox } from '@/components/ErrorCombobox';

const SignupPage = () => {
  return (
    <main className="flex w-screen h-screen justify-center items-center">
        <div className="w-[688px] inline-flex justify-start items-start gap-12">
            {/* Forms */}
            <form className="w-80 h-[456px] min-w-56 inline-flex flex-col justify-between   items-center">
                {/* Main form content */}
                <section className="self-stretch  h-80 flex flex-col justify-start items-center gap-2">
                    {/* Title */}
                    <section className="self-stretch flex flex-col justify-start items-center gap-1">
                        <div className="inline-flex justify-center items-center gap-4">
                            <LogoIcon width={85} height={22}/>
                            <h2 className="justify-start text-[#1434CB] text-3xl font-semibold leading-10 tracking-wide">Sign-up</h2>
                        </div>
                        <p className="hidden self-stretch text-center justify-start text-Color-Messaging-negative-text text-sm font-semibold leading-none">Connection to server failed. Please try again later</p>
                    </section>
                    {/* Inputs */}
                    {/* <EmailPasswordSection /> */}
                    <UserRoleSection />
                </section>
                {/* Actions */}
                <section className="flex flex-col justify-start items-center gap-6">
                    <Button className='w-32 min-h-6 px-3.5 py-2.5'>Continue</Button>
                    <Link href='/login' className="justify-start text-Color-Text-text text-xs font-semibold underline leading-none">Have an account? Login</Link>
                </section>
            </form>
            {/* Image */}
            <section className="self-stretch px-12 py-44 bg-[#1434CB] rounded-tr-xl rounded-br-xl inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
                <div className="self-stretch flex flex-col justify-center items-center gap-2">
                    <LogoIcon width={169} height={44} fill='#FFFFFF'/>
                    <p className="self-stretch text-center justify-start text-white text-sm font-normal leading-snug">App that resembles Visa VCA and internal systems</p>
                </div>
            </section>
        </div>
    </main>
  )
}


const EmailPasswordSection = () => {
  return (
    <section className="self-stretch flex flex-col justify-start items-start gap-4">
        <ErrorInput id='input-login-email' label='Email' isRequired errorText='Please use a valid email'/>
        <ErrorInput id='input-login-password' label='Password' isRequired description='Password must have atleast 8 charcters' errorText='Password must have atleast 8 charcters'/>
    </section>
  )
}

const UserRoleSection = () => {
    const userRoleItems: ComboboxItem[] = [
        { value: 'Business' },
        { value: 'Analyst (Internal)' }
    ];

    const sectorItems: ComboboxItem[] = [
        { value: 'Banking' },
        { value: 'Real estate' }
    ];

    return (
        <section className="self-stretch flex flex-col justify-start items-start gap-4">
            <ErrorCombobox id='input-signup-user-role' items={userRoleItems} isRequired label='Choose your role' errorText='User role not selected'/>
            <ErrorCombobox id='input-signup-sector' items={sectorItems} isRequired label='What sector is your busness in?' errorText='User role not selected'/>
        </section>
    )
}



export default SignupPage