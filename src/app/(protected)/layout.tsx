import React from 'react'
import Navbar from './_components/navbar'

const ProtectedLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='h-full w-full flex flex-col gap-y-10 items-center justify-center'>
        <Navbar />
        {children}
    </div>
  )
}

export default ProtectedLayout