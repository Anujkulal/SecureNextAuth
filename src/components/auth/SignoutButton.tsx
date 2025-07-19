import React from 'react'
import { Button } from '../ui/button'
import { signOutAction } from '@/actions/authAction';
import { VariantProps } from 'class-variance-authority';

interface SignoutButtonProps {
  variant?: VariantProps<typeof Button>['variant'];
}

const SignoutButton = ({variant}: SignoutButtonProps) => {
    const onClick = () => {
      signOutAction();
    }
  return (
    <Button variant={variant || "destructive"} onClick={onClick}>Sign out</Button>
  )
}

export default SignoutButton