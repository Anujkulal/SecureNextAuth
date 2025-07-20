"use client";

// import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Mail, User, Shield, Calendar, CheckCircle, XCircle, Clock, Key } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react'

interface UserInfoProps {
    user: {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string;
        emailVerified?: Date | null;
        isTwoFactorEnabled?: boolean;
    } | null;
}

const UserInfo = ({ user }: UserInfoProps) => {
    const { data: session } = useSession();

    if (!user) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                        <User className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">
                            No user session found
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const userInitials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : user?.email?.[0].toUpperCase() || 'U';

    const formatDate = (date: Date | string | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // console.log("2FA::: ", user?.isTwoFactorEnabled)

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Main Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        User Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Profile Section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage 
                                src={user?.image || undefined} 
                                className="object-cover"
                            />
                            <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <h3 className="text-2xl font-bold">
                                    {user?.name || "Anonymous User"}
                                </h3>
                                <Badge 
                                    variant={user?.role === 'ADMIN' ? 'default' : 'secondary'}
                                    className={user?.role === 'ADMIN' ? 'bg-red-600 hover:bg-red-700' : ''}
                                >
                                    {user?.role || 'USER'}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {user?.email || 'No email provided'}
                            </p>
                            {/* <div className="flex items-center gap-2">
                                {user?.emailVerified ? (
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Email Verified
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-red-600 border-red-600">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Email Not Verified
                                    </Badge>
                                )}
                            </div> */}
                        </div>
                    </div>

                    <Separator />

                    {/* Account Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Account Details */}
                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2 text-lg">
                                <Shield className="h-5 w-5" />
                                Account Details
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">User ID:</span>
                                    <code className="text-xs bg-background px-2 py-1 rounded border">
                                        {user?.id ? `${user.id.slice(0, 8)}...${user.id.slice(-4)}` : 'N/A'}
                                    </code>
                                </div>
                                
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Two-Factor Auth:</span>
                                    {user?.isTwoFactorEnabled ? (
                                        <Badge variant="outline" className="text-green-600 border-green-600">
                                            <Key className="h-3 w-3 mr-1" />
                                            Enabled
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-amber-600 border-amber-600">
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Disabled
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Session Information */}
                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5" />
                                Session Information
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Strategy:</span>
                                    <Badge variant="outline" className="font-mono">
                                        JWT
                                    </Badge>
                                </div>
                                
                                {session?.expires && (
                                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                        <span className="text-sm font-medium">Expires:</span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(session.expires)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Status:</span>
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Active
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Debug Information (Development only) */}
            {process.env.NODE_ENV === 'development' && (
                <Card className="border-dashed">
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                            Development Debug Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <details className="space-y-4">
                            <summary className="cursor-pointer text-sm font-medium hover:text-primary transition-colors">
                                Click to view raw data
                            </summary>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <h5 className="font-medium text-sm mb-2">User Object:</h5>
                                    <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-64 border">
                                        {JSON.stringify(user, null, 2)}
                                    </pre>
                                </div>
                                {session && (
                                    <div>
                                        <h5 className="font-medium text-sm mb-2">Session Object:</h5>
                                        <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-64 border">
                                            {JSON.stringify(session, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </details>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default UserInfo;