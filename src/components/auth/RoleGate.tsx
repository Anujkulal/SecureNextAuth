"use client"

import { useCurrentRole } from '@/hooks/useCurrentRole';
import { UserRole } from '@prisma/client';
import React from 'react'
import FormError from '../form/FormError';

interface RoleGateProps {
    children: React.ReactNode;
    allowedRoles: UserRole;
}

const RoleGate = ({children, allowedRoles}: RoleGateProps) => {
    const role = useCurrentRole();
    if(role !== allowedRoles){
        return (
            <FormError message='You do not have permission to view this content.' />
        )
    }
  return (
    <div>
        {children}
    </div>
  )
}

export default RoleGate