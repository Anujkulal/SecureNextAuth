"use client"

import React from 'react'
import { FaGithub } from 'react-icons/fa'
import { Button } from '../ui/button'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import { DEFAULT_SIGNIN_REDIRECT } from '@/routes'

const Social = () => {
  /**
   * 
   * @param provider - The provider to sign in with, either "google" or "github".
   * @description This function handles the sign-in process for the specified provider.
   * @see: The provider names should be in lowercase.
   * @example: onClick("google")
   */
  const onClick = (provider: "google" | "github") => { // Don't use title case for provider names
    signIn(provider, {
      callbackUrl: DEFAULT_SIGNIN_REDIRECT
    })
  }

  return (
    <div className='flex items-center justify-center gap-x-2 w-full'>
        <Button size={"lg"} variant={"outline"} className='w-1/2' onClick={() => onClick("google")}>
            <FcGoogle className='h-5 w-5' />
        </Button>
        <Button size={"lg"} variant={"outline"} className='w-1/2' onClick={() => onClick("github")}>
            <FaGithub className='h-5 w-5' />
        </Button>
    </div>
  )
}

export default Social