"use client";

import React, { useState, useTransition } from 'react'
import { CardWrapper } from './CardWrapper'
import { useForm } from 'react-hook-form'
import { signinSchema } from '@/schemas';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import FormError from '../form/FormError';
import FormSuccess from '../form/FormSuccess';
import { signinAction } from '@/actions/authAction';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type MessageState = {
  error?: string | undefined;
  success?: string;
}

export const SigninForm = () => {
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: ''
    }
});

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<MessageState>({error: '', success: ''});
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "This account is already linked with another provider. Please sign in with that provider." : "";

  const onSubmit = (values: z.infer<typeof signinSchema>) => {
    // console.log('Form submitted with values:', values);
    setMessage({error: '', success: ''}); // Reset message state

    startTransition(() => {
      signinAction(values)
      .then((data) => {
        if(data.error){
          form.reset(); // Reset form fields on error
          setMessage({error: data.error, success: ''});
        } 
        if(data.success){
          form.reset(); // Reset form fields on success
          setMessage({error: '', success: data.success});
        }
        if(data?.twoFactor){
          setShowTwoFactor(true);
          setMessage({error: '', success: data.success});
        }
      })
      .catch((error) => {
        // console.log('Authentication error:', error);

        // Check if it's a redirect error (expected after successful auth)
        if(error?.message?.includes('NEXT_REDIRECT') || error?.digest?.includes('NEXT_REDIRECT')){
                // This is expected - successful authentication causes a redirect
                return;
        }
        setMessage({error: "Something went wrong. Please try again.", success: ''})
      }
    );
    })
  }
  
  return (
    <CardWrapper
    headerTitle="My Auth App!"
    headerLabel='Welcome back to Secure Next Auth'
    backButtonLabel="Don't have an account?"
    backButtonHref='/auth/signup'
    showSocialLogin
    >
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className="space-y-3">
            {showTwoFactor && (
              <FormField control={form.control} name='code' render={({field}) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='123456' type='text' disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}
            {!showTwoFactor &&
              <>
                <FormField control={form.control} name='email' render={({field}) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='anuj@example.com' type='email' disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name='password' render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type='password' disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button
                variant={'link'}
                className='px-0 font-normal'
                size={"sm"}
                >
                  <Link href='/auth/forgot-password'>
                  Forgot Password?
                  </Link>
                </Button>
              </>
            }
            <FormError message={message.error || urlError}/>
            <FormSuccess message={message.success}/>
            <Button type='submit' className='w-full' disabled={isPending}>{showTwoFactor ? "Verify" : "Sign In"}</Button>
          </div>
        </form>
        </Form>

    </CardWrapper>
  )
}
