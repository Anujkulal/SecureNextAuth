"use client";

import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Header from './Header';
import Social from './Social';
import BackButton from './BackButton';

interface CardWrapperProps {
    children: React.ReactNode;
    className?: string;
    headerTitle?: string;
    headerLabel?: string;
    backButtonLabel?: string;
    backButtonHref: string;
    showSocialLogin?: boolean;
}

export const CardWrapper = ({children, className, headerTitle, headerLabel, backButtonHref, backButtonLabel, showSocialLogin}: CardWrapperProps) => {
  return (
    <Card className='w-[400px] shadow-md'>
        <CardHeader>
            <Header title={headerTitle} label={headerLabel} />
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
        {showSocialLogin && (
            <CardFooter>
                <Social />
            </CardFooter>
        )}
        <CardFooter>
            <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
    </Card>
  )
}
