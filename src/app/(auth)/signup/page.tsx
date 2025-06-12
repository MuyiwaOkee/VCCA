import React from 'react'
import SignupModal from '@/components/Auth/SignupModal';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Signup",
  description: "Signup page",
};

const SignupPage = () => {
    return (
    <main className="flex w-screen h-screen justify-center items-center">
        <SignupModal />
    </main>
  )
}

export default SignupPage