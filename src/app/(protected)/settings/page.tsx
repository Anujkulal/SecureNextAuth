"use client";

import * as z from 'zod';
import { settingsAction } from '@/actions/setting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSession } from 'next-auth/react';
import React, { useState, useTransition, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { settingsSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import FormSuccess from '@/components/form/FormSuccess';
import FormError from '@/components/form/FormError';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@prisma/client';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Mail, Lock, Shield, Save, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SettingsPage = () => {  
    const { data: session, status, update } = useSession();  
    const user = useCurrentUser();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    // const { update } = useSession();
    const [isPending, startTransition] = useTransition();

    console.log("Current User:", user);
    console.log("Session Data:", session);
    // console.log("Session Status:", status);

    const form = useForm<z.infer<typeof settingsSchema>>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            newPassword: "",
            role: user?.role || "USER",
            isTwoFactorEnabled: user?.isTwoFactorEnabled || false,
        }
    });

    // Update form when user data changes
    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || "",
                email: user.email || "",
                password: "",
                newPassword: "",
                role: user.role || "USER",
                isTwoFactorEnabled: user.isTwoFactorEnabled || false,
            });
        }
    }, [user]);

    // Clear messages after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        // Force session refresh when component mounts
        update();
    }, []);

    const onSubmit = (values: z.infer<typeof settingsSchema>) => {
        setMessage(null);
        
        startTransition(() => {
            settingsAction(values)
                .then(async (data) => {
                    if (data?.error) { 
                        setMessage({ type: 'error', text: data.error });
                    }
                    if (data?.success) {
                        await update(); // Update the session
                        setMessage({ type: 'success', text: data.success });
                        // Reset password fields after successful update
                        form.setValue('password', '');
                        form.setValue('newPassword', '');
                    }
                })
                .catch((error) => {
                    console.error('Settings update error:', error);
                    setMessage({ 
                        type: 'error', 
                        text: "Something went wrong. Please try again later." 
                    });
                });
        });
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-96">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-3">
                            <User className="h-12 w-12 mx-auto text-muted-foreground" />
                            <p className="text-muted-foreground">Loading user settings...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Settings className="h-8 w-8" />
                    Account Settings
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="grid gap-6">
                {/* Account Type Alert */}
                {user.isOAuth && (
                    <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                            You're signed in with a social provider. Some settings like email and password 
                            are managed by your OAuth provider.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Settings Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Settings
                        </CardTitle>
                        <CardDescription>
                            Update your account information and security preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
                                {/* Profile Information */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <User className="h-4 w-4" />
                                        <h3 className="text-lg font-semibold">Profile Information</h3>
                                        <Badge variant="outline">{user.role}</Badge>
                                    </div>
                                    
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Display Name</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        {...field} 
                                                        placeholder='Enter your full name' 
                                                        disabled={isPending}
                                                        className="max-w-md"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Role</FormLabel>
                                                <Select
                                                    // disabled={isPending || user.role !== 'ADMIN'}
                                                    disabled={isPending}
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="max-w-md">
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                                                        <SelectItem value={UserRole.USER}>Standard User</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    {user.role !== 'ADMIN' && "Only administrators can change user roles"}
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Account Security - Only for non-OAuth users */}
                                {!user.isOAuth && (
                                    <>
                                        <Separator />
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Lock className="h-4 w-4" />
                                                <h3 className="text-lg font-semibold">Security Settings</h3>
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4" />
                                                            Email Address
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                {...field} 
                                                                placeholder='your.email@example.com' 
                                                                type="email"
                                                                disabled={isPending}
                                                                className="max-w-md"
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Changing your email will require verification
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="password"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Current Password</FormLabel>
                                                            <FormControl>
                                                                <Input 
                                                                    {...field} 
                                                                    placeholder='••••••••' 
                                                                    type='password' 
                                                                    disabled={isPending}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="newPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>New Password</FormLabel>
                                                            <FormControl>
                                                                <Input 
                                                                    {...field} 
                                                                    placeholder='••••••••' 
                                                                    type='password' 
                                                                    disabled={isPending}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="isTwoFactorEnabled"
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="flex items-center gap-2">
                                                                <Shield className="h-4 w-4" />
                                                                Two-Factor Authentication
                                                            </FormLabel>
                                                            <FormDescription>
                                                                Add an extra layer of security to your account
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch 
                                                                disabled={isPending} 
                                                                checked={field.value || false} 
                                                                onCheckedChange={field.onChange} 
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Messages */}
                                {message && (
                                    <div className="space-y-2">
                                        {message.type === 'success' && <FormSuccess message={message.text} />}
                                        {message.type === 'error' && <FormError message={message.text} />}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex items-center gap-2 pt-4">
                                    <Button type='submit' disabled={isPending} className="min-w-[120px]">
                                        {isPending ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => form.reset()}
                                        disabled={isPending}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default SettingsPage;