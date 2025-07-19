import * as z from 'zod';

export const signinSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(3, 'Password must be at least 3 characters'),
    code: z.optional(z.string()),
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