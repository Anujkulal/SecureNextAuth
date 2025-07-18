"use client"

import { useRouter } from 'next/navigation';
import React from 'react'
import { Button, buttonVariants } from '../ui/button';
import { VariantProps } from 'class-variance-authority';

interface SigninButtonProps {
    children?: React.ReactNode;
    mode?: "modal" | "redirect";
    className?: string;
    asChild?: boolean;
    variant?: VariantProps <typeof buttonVariants>["variant"];
    size?: VariantProps <typeof buttonVariants>["size"];
}

const SigninButton = ({children, mode="redirect", asChild, className, variant="default", size}: SigninButtonProps) => {

  const router = useRouter();

  const onClick = () => {
    router.push("/auth/signin");
  }

  if(mode === "modal") {
    return (
      <div>Modal Implementation</div>
    )
  }

  return (
    <Button onClick={onClick} className={className} variant={variant} size={size}>
      {children ? children : "Sign In"}
    </Button>
  )
}

export default SigninButton;