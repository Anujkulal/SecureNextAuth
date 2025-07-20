import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const signinSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(3, 'Password must be at least 3 characters'),
    code: z.optional(z.string()),
})

export const settingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.email()),
    password: z.optional(z.string().min(6, 'Password must be at least 6 characters')),
    newPassword: z.optional(z.string().min(6, 'New password must be at least 6 characters')),
})
    .refine((data) => {
       
        if(data.password && !data.newPassword) {
            return false; // If password is provided, newPassword must also be provided
        }
        return true; // Otherwise, the data is valid
    }, {
        message: "New password is required!",
        path: ["newPassword"],

    })
    .refine((data) => {
       
         if(data.newPassword && !data.password) {
            return false; // If newPassword is provided, password must also be provided
        }
        return true; // Otherwise, the data is valid
    }, {
        message: "Password is required!",
        path: ["password"],

    })

export const forgotPasswordSchema = z.object({
    email: z.email("Invalid email address"),
})

export const newPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    email: z.email("Invalid email address"),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})