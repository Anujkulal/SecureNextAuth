import { auth, signOut } from '@/auth'
import authConfig from '@/auth.config';
import { Button } from '@/components/ui/button';
import NextAuth from 'next-auth';
import React from 'react'

const SettingsPage = async () => {

    // const {auth} = NextAuth(authConfig) // **************
    
    const session = await auth();
  return (
    <div>
      {JSON.stringify(session)}
    
      <form action={async () => {
        "use server";
        await signOut();
      }}>
        <Button type='submit' variant={"destructive"}>Sign out</Button>
      </form>
    </div>
  )
}

export default SettingsPage