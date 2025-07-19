"use client";

import { signOutAction } from '@/actions/authAction';
import { settingsAction } from '@/actions/setting';
import SignoutButton from '@/components/auth/SignoutButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSession, signOut } from 'next-auth/react';
import React, { useTransition } from 'react'

const SettingsPage = () => {    
    // const user = useCurrentUser();

    const {update} = useSession();

    const [isPending, startTransition] = useTransition()
  const onClick = () => {
    startTransition(() => {
      settingsAction({
        name: "Anuj Kulal",
      })
      .then((data) => {
        update();
      })
    })
  }
    
  return (
    <Card>
      <CardHeader>
        <p>Settings</p>
      </CardHeader>
      <CardContent>
        <Button onClick={onClick} disabled={isPending}>
          Update name
        </Button>
      </CardContent>
    </Card>
  )
}

export default SettingsPage