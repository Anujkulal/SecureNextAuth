import { auth } from '@/auth'
import React from 'react'

const ServerPage = async () => {
    const session = await auth();
  return (
    <div>
        {JSON.stringify(session)}
    </div>
  )
}

export default ServerPage