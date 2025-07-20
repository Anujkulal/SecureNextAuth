import React from 'react'
import Navbar from './_components/navbar'

const ProtectedLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='min-h-screen w-full flex flex-col'>
        <div className="sticky top-0 z-50 w-full p-4">
            <Navbar />
        </div>
        <main className='flex-1 w-full px-4 pb-8'>
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
        </main>
    </div>
  )
}

export default ProtectedLayout