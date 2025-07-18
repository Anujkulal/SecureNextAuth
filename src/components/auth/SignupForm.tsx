"use client";

import React, { useState, useTransition } from 'react'
import { CardWrapper } from './CardWrapper'
import { useForm } from 'react-hook-form'
import { signupSchema } from '@/schemas';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import FormError from '../form/FormError';
import FormSuccess from '../form/FormSuccess';
import { signupAction } from '@/actions/authAction';

type MessageState = {
  error?: string | undefined;
  success?: string;
}

export const SignupForm = () => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<MessageState>({error: '', success: ''});

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    // console.log('Form submitted with values:', values);
    setMessage({error: '', success: ''}); // Reset message state

    startTransition(() => {
      signupAction(values)
      .then((data) => {
        if(data.error) setMessage({error: data.error, success: ''});
        else setMessage({error: '', success: data.success});
      })
    })
  }
  return (
    <CardWrapper
    headerTitle="My Auth App!"
    headerLabel='Create an account'
    backButtonLabel="Already have an account?"
    backButtonHref='/auth/signin'
    showSocialLogin
    >
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className="space-y-3">
            <FormField control={form.control} name='name' render={({field}) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='username' type='text' disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
            <FormError message={message.error}/>
            <FormSuccess message={message.success}/>
            <Button type='submit' className='w-full' disabled={isPending}>Create an account</Button>
          </div>
        </form>
        </Form>

    </CardWrapper>
  )
}
