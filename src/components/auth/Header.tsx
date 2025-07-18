import { cn } from '@/lib/utils';
import React from 'react'

interface HeaderProps {
    title?: string;
    label?: string;
}

const Header = ({label, title}: HeaderProps) => {
  return (
    <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
        <h1 className={"text-3xl font-semibold"}>{title ? title : "Secure Next Auth"}</h1>
        <p className='text-muted-foreground text-sm'>{label ? label : "Signin / Signup"}</p>
    </div>
  )
}

export default Header