import SigninButton from '@/components/auth/Signin'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'
import React from 'react'

const font = Poppins({
  subsets: ['latin'],
  weight: ['700']
})

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full h-screen'>
      <h1 className={cn('text-3xl font-extrabold', font.className)}>Secure Next Auth</h1>
      {/* <Button>
        Sign In
      </Button> */}

      <SigninButton />
    </div>
  )
}

export default Home