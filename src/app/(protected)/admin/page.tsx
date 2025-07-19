"use client"

import { adminAction } from '@/actions/admin';
import RoleGate from '@/components/auth/RoleGate';
import FormSuccess from '@/components/form/FormSuccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { currentRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import React from 'react'
import { toast } from 'sonner';

const AdminPage = async () => {
    // const role = await currentRole();

    const onApiRouteClick = () => {
        fetch("/api/admin")
        .then(res => {
            if(res.ok){
                console.log("API Route Accessed Successfully");
                toast.success("API Route Accessed Successfully");
            }
            else {
                console.error("Forbidden: Access is denied.");
                toast.error("Forbidden: Access is denied.");
            }
        })
    }

    const onServerActionClick = () => {
        adminAction()
        .then(data =>{
            toast.success(data.message);
        })
    }
  return (
    <Card className='w-[600px]'>
        <CardHeader>
            <p>ADMIN</p>
        </CardHeader>
        <CardContent className='space-y-4'>
            <RoleGate allowedRoles={UserRole.ADMIN}>
                <FormSuccess message='You are allowed to see this content' />
            </RoleGate>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                <p>ADMIN Only Api Routes</p>
                <Button onClick={onApiRouteClick}>
                    Click to test
                </Button>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                <p>ADMIN Only Server Action</p>
                <Button onClick={onServerActionClick}>
                    Click to test
                </Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default AdminPage