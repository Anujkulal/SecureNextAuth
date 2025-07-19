"use client"

import React from 'react'
import UserInfo from '../_components/user-info';
import { useCurrentUser } from '@/hooks/useCurrentUser';

// interface ClientP

const ClientPage =  () => {
    const user =  useCurrentUser();
  return (
    <div>
        <UserInfo user={(user as any)} />
    </div>
  )
}

export default ClientPage