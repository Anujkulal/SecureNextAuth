"use client";

import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaUser } from 'react-icons/fa';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import SignoutButton from './SignoutButton';
import { LogOutIcon } from 'lucide-react';

const UserButton = () => {
    const user = useCurrentUser();
    
    // console.log("user", user);
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Avatar>
                <AvatarImage 
                src={user?.image?.toString() || undefined} 
                alt={user?.name || "User avatar"}/>
                <AvatarFallback className='bg-gray-300 text-primary'>
                    <FaUser />
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='flex gap-2 items-center'>
            <LogOutIcon size={16} />
            <SignoutButton variant='ghost' />
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton