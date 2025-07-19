"use client";

import React, { useCallback, useEffect, useState } from 'react'
import { CardWrapper } from '../auth/CardWrapper'
import { DotLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'
import { newVerificationAction } from '@/actions/authAction';
import FormSuccess from './FormSuccess';
import FormError from './FormError';

type MessageState = {
  error?: string | undefined;
  success?: string;
}

const VerificationForm = () => {
    const [message, setMessage] = useState<MessageState>({
        success: "",
        error: ""
    });

    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    
    const onSubmit = useCallback(() => {
        // console.log("Verification token: ", token);
        if(message.success || message.error) {
            return; // Prevent multiple submissions
        }

        if(!token) {
            setMessage({error: "Missing token!"});
            return;
        }

        newVerificationAction(token)
        .then((data) => {
            setMessage({
                success: data.success || "",
                error: data.error || ""
            })
        })
        .catch(() => setMessage({error: "An error occurred while verifying your email."}));
    }, [token, message.success, message.error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

  return (
    <CardWrapper
    headerLabel='Confirming your email'
    backButtonLabel='Back to Sign In'
    backButtonHref='/auth/signin'
    >
        <div className="flex items-center w-full justify-center">
        {
            !message.success && !message.error && <DotLoader size={35} />
        }
            <FormSuccess message={message.success} />
            {!message.success && (<FormError message={message.error} />)}
            
        </div>
    </CardWrapper>
  )
}

export default VerificationForm