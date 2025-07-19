import { auth } from '@/auth'
import React from 'react'
import UserInfo from '../_components/user-info';
import { currentUser } from '@/lib/auth';

const ServerPage = async () => {
    const user = await currentUser();
  return (
    <div>
        <UserInfo user={user} />
    </div>
  )
}

export default ServerPage