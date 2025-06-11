import React from 'react'
import { DefaultInput } from "@/components/DefaultInput";
import LogoIcon from "@/icons/logo";
import {
  Button
} from "@visa/nova-react";
import Link from 'next/link';
import { ErrorInput } from '../ErrorInput';

const LoginModal = () => {
  return (
    <form className="w-80 h-[456px] min-w-56 inline-flex flex-col justify-between items-center">
        {/* Main form content */}
        <section className="self-stretch  h-80 flex flex-col justify-start items-center gap-2">
            {/* Title */}
            <section className="self-stretch flex flex-col justify-start items-center gap-1">
                <div className="inline-flex justify-center items-center gap-4">
                    <LogoIcon width={85} height={22}/>
                    <h2 className="justify-start text-Color-Visa-accent-accent-app-name text-3xl font-semibold leading-10 tracking-wide">Login</h2>
                </div>
                <p className="hidden self-stretch text-center justify-start text-Color-Messaging-negative-text text-sm font-semibold leading-none">Connection to server failed. Please try again later</p>
            </section>
            {/* Inputs */}
            <section className="self-stretch flex flex-col justify-start items-start gap-4">
                <ErrorInput id='input-login-email' label='Email' isRequired errorText='Please use a valid email'/>
                <div className="self-stretch inline-flex flex-col justify-start items-start gap-2">
                    <DefaultInput id='input-login-password' label='Password' isRequired description='Password must have atleast 8 charcters'/>
                    <Link href='/forgot-password' className="w-72 justify-start text-Color-Text-text text-xs font-semibold underline leading-none">Forgot password?</Link>
                </div>
            </section>
        </section>
        {/* Actions */}
        <section className="flex flex-col justify-start items-center gap-6">
            <Button className='w-32 min-h-6 px-3.5 py-2.5'>Login</Button>
            <Link href='/signup' className="justify-start text-Color-Text-text text-xs font-semibold underline leading-none">Don't have an account? Sign up</Link>
        </section>
</form>
  )
}

export default LoginModal