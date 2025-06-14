"use client"
import React, { useActionState, useRef } from 'react'
import LogoIcon from "@/icons/logo";
import {
  Button
} from "@visa/nova-react";
import Link from 'next/link';
import { ErrorInput } from '../ErrorInput';
import { Login } from './action';
import { MaskButtonInput } from '../MaskButtonInput';

const LoginModal = () => {
    const [state, loginAction] = useActionState(Login, undefined);
    const formRef = useRef<HTMLFormElement>(null!);
    
    const HandleSubmit = (e: React.KeyboardEvent<HTMLFormElement>) => {    
        if(e.code === 'Enter') {
            e.preventDefault();
            formRef.current.requestSubmit();
        }
    };
    
  return (
    <form ref={formRef} onKeyDown={HandleSubmit} action={loginAction} className="w-80 h-[456px] min-w-56 inline-flex flex-col justify-between items-center">
        {/* Main form content */}
        <section className="self-stretch  h-80 flex flex-col justify-start items-center gap-2">
            {/* Title */}
            <section className="self-stretch flex flex-col justify-start items-center gap-1">
                <div className="inline-flex justify-center items-center gap-4">
                    <LogoIcon width={85} height={22}/>
                    <h2 className="justify-start text-[#1434CB] text-3xl font-semibold leading-10 tracking-wide">Login</h2>
                </div>
                <p className="hidden self-stretch text-center justify-start text-Color-Messaging-negative-text text-sm font-semibold leading-none">Connection to server failed. Please try again later</p>
            </section>
            {/* Inputs */}
            <section className="self-stretch flex flex-col justify-start items-start gap-4">
                <ErrorInput id='email' label='Email' isRequired errorText={state?.errors.email?.join(', ')} autocomplete='email'/>
                <div className="self-stretch inline-flex flex-col justify-start items-start gap-2">
                    <MaskButtonInput id='password' label='Password' isRequired description='Password must have atleast 8 charcters' autocomplete='password' errorText={state?.errors.password?.join(', ')}/>
                    <Link href='/forgot-password' className="w-72 justify-start text-Color-Text-text text-xs font-semibold underline leading-none">Forgot password?</Link>
                </div>
            </section>
        </section>
        {/* Actions */}
        <section className="flex flex-col justify-start items-center gap-6">
            <Button className='w-32 min-h-6 px-3.5 py-2.5' type='submit'>Login</Button>
            <Link href='/signup' className="justify-start text-Color-Text-text text-xs font-semibold underline leading-none">Don't have an account? Sign up</Link>
        </section>
</form>
  )
}

export default LoginModal