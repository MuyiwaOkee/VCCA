import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import React from 'react'
import { redirect } from 'next/navigation';

const LogoutPage = async () => {
  const cookie = (await cookies()).get('session')?.value; //get jwt if available
  const session = await decrypt(cookie);

  // if the user still has a session, redirect to the dashboard (this has been done at the page level instead of at the middleware level to that the intercepted logout screen has the chance to show)
  if(session?.userid) {
    return redirect('/dashboard');
  }

  return (
    <div>You logged out</div>
  )
}

export default LogoutPage