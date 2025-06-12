import LoginModal from '@/components/Auth/LoginModal'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Login",
  description: "Login page",
};

const LoginPage = () => {
  return (
    <main className="flex w-screen h-screen justify-center items-center">
        <LoginModal />
    </main>
  )
}

export default LoginPage