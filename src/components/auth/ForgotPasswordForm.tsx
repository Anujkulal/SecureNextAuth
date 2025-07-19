"use client";

import React, { useState, useTransition } from 'react'
import { CardWrapper } from './CardWrapper'
import { useForm } from 'react-hook-form'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import FormError from '../form/FormError';
import FormSuccess from '../form/FormSuccess';
import { forgotPasswordAction, signinAction } from '@/actions/authAction';
import Link from 'next/link';
import { forgotPasswordSchema } from '@/schemas';

type MessageState = {
  error?: string | undefined;
  success?: string;
}

export const ForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
});

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<MessageState>({error: '', success: ''});

  const onSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    // console.log('Form submitted with values:', values);
    setMessage({error: '', success: ''}); // Reset message state

    // console.log("Values from Forgot Password Form: ", values);

    startTransition(() => {
      forgotPasswordAction(values)
      .then((data) => {
        if(data.error) setMessage({error: data.error, success: ''});
        else setMessage({error: '', success: data.success});
      })
    })
  }
  
  return (
    <CardWrapper
    headerTitle="My Auth App!"
    headerLabel='Forgot your password?'
    backButtonLabel="Back to Sign In"
    backButtonHref='/auth/signin'
    >
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className="space-y-3">
            <FormField control={form.control} name='email' render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='anuj@example.com' type='email' disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            
            <FormError message={message.error}/>
            <FormSuccess message={message.success}/>
            <Button type='submit' className='w-full' disabled={isPending}>Send Email</Button>
          </div>
        </form>
        </Form>

    </CardWrapper>
  )
}
