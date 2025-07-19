"use client";

import { signOutAction } from '@/actions/authAction';
import SignoutButton from '@/components/auth/SignoutButton';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSession, signOut } from 'next-auth/react';
import React from 'react'

const SettingsPage = () => {    
    // const user = useCurrentUser();

    
  return (
    <div className='p-10 rounded-xl'>
        <SignoutButton />
    </div>
  )
}

export default SettingsPage