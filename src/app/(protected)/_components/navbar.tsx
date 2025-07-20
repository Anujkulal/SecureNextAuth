"use client";

import UserButton from '@/components/auth/UserButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const Navbar = () => {
    const pathname = usePathname();
    console.log("pathname", pathname);
  return (
    <div className='bg-secondary/50 backdrop-blur-sm border border-border/50 flex justify-between items-center p-4 rounded-xl w-full max-w-4xl mx-auto shadow-lg'>
        <div className="flex gap-x-2 flex-wrap">
            <Button
            asChild
            variant={pathname === "/server" ? "default" : "outline"}
            >
                <Link href={"/server"}>
                    Server
                </Link>
            </Button>
            <Button
            asChild
            variant={pathname === "/client" ? "default" : "outline"}
            >
                <Link href={"/client"}>
                    Client
                </Link>
            </Button>
            <Button
            asChild
            variant={pathname === "/admin" ? "default" : "outline"}
            >
                <Link href={"/admin"}>
                    Admin
                </Link>
            </Button>
            <Button
            asChild
            variant={pathname === "/settings" ? "default" : "outline"}
            >
                <Link href={"/settings"}>
                    Settings
                </Link>
            </Button>
        </div>
        <UserButton />
    </div>
  )
}

export default Navbar