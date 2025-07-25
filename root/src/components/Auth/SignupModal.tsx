"use client"
import React, { useActionState, useCallback, useRef, useState, startTransition } from 'react'
import { ErrorInput } from '../ErrorInput'
import ErrorCombobox, { ComboboxItem } from '../ErrorCombobox'
import LogoIcon from '@/icons/logo'
import Link from 'next/link'
import { Button } from '@visa/nova-react'
import { MaskButtonInput } from '../MaskButtonInput'
import { Signup, SignupOutput } from './action'
import cn from '@/utils/cn'

const DEFAULT_STATE:SignupOutput = {
    section: 'EmailPassword',
    errors: {
        email: undefined,
        password: undefined
    }
}

const SignupModal = () => {
    const [state, signupAction, isPending] = useActionState(Signup, DEFAULT_STATE);
    const formRef = useRef<HTMLFormElement>(null!);

    const HandleSubmit = (e: React.KeyboardEvent<HTMLFormElement>) => {    
        if(e.code === 'Enter') {
            e.preventDefault();
            formRef.current.requestSubmit();
        }
    };
    
    return (
    <div className="w-[688px] inline-flex justify-start items-start gap-12">
                {/* Forms */}
                <form ref={formRef} onKeyDown={HandleSubmit} action={signupAction} className="w-80 h-[456px] min-w-56 inline-flex flex-col justify-between   items-center">
                    {/* Main form content */}
                    <section className="self-stretch  h-80 flex flex-col justify-start items-center gap-2">
                        {/* Title */}
                        <section className="self-stretch flex flex-col justify-start items-center gap-1">
                            <div className="inline-flex justify-center items-center gap-4">
                                <LogoIcon width={85} height={22}/>
                                <h2 className="justify-start text-[#1434CB] text-3xl font-semibold leading-10 tracking-wide">Sign-up</h2>
                            </div>
                            {state.section === 'UserRole' && <p className="text-black w-full text-center text-sm font-semibold underline leading-none cursor-pointer" onClick={() => startTransition(() => {
                                signupAction(undefined)
                            })}>Back</p>}
                            <p className="hidden self-stretch text-center justify-start text-Color-Messaging-negative-text text-sm font-semibold leading-none">Connection to server failed. Please try again later</p>
                        </section>
                        {/* Inputs */}
                        <EmailPasswordSection emailError={state.errors.email?.join(', ')} passwordError={state.errors.password?.join(', ')} isHidden={state.section != 'EmailPassword'}/>
                        <UserRoleSection roleError={state.errors.roleCombobox?.join(', ')} sectorError={state.errors.sectorCombobox?.join(', ')} isHidden={state.section != 'UserRole'}/>
                    </section>
                    {/* Actions */}
                    <section className="flex flex-col justify-start items-center gap-6">
                        <Button className='w-32 min-h-6 px-3.5 py-2.5' type='submit'>{!isPending ? state.section === 'EmailPassword' ? 'Continue' : 'Create Account' : 'Pending'}</Button>
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
  )
}

type EmailPasswordSectionProps = {
    emailError: string | undefined,
    passwordError: string | undefined,
    isHidden: boolean
}

const EmailPasswordSection = ({ emailError, passwordError, isHidden }: EmailPasswordSectionProps) => {
  return (
    <section className={cn("self-stretch flex flex-col justify-start items-start gap-4", isHidden ? "hidden" : "visible")}>
        <ErrorInput id='email' label='Email' isRequired errorText={emailError}/>
        <MaskButtonInput id='password' label='Password' isRequired description='Password must have atleast 8 charcters' errorText={passwordError}/>
    </section>
  )
}

type UserRoleSectionProps = {
    roleError: string | undefined,
    sectorError: string | undefined,
    isHidden: boolean
}

const UserRoleSection = ({ roleError, sectorError, isHidden }: UserRoleSectionProps) => {
    const [userRoleValue, setUserRoleValue] = useState<string | null>(null);

    const comboboxRef = useCallback((value: string | null) => {
        setUserRoleValue(value);
    }, []);

    const userRoleItems: ComboboxItem[] = [
        { value: 'Business' },
        { value: 'Analyst (Internal)' }
    ];

    const sectorItems: ComboboxItem[] = [
        { value: 'Banking' },
        { value: 'Real estate' }
    ]; 

    return (
        <section className={cn("self-stretch flex flex-col justify-start items-start gap-4", isHidden ? "hidden" : "visible")}>
            <ErrorCombobox ref={comboboxRef} id='roleCombobox' items={userRoleItems} isRequired label='Choose your role' errorText={roleError}/>
            {userRoleValue === 'Business' && <ErrorCombobox id='sectorCombobox' items={sectorItems} isRequired label='What sector is your busness in?' errorText={sectorError}/>}
        </section>
    )
}

export default SignupModal