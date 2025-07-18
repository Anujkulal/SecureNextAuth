"use server";
import { signinSchema, signupSchema } from '@/schemas';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getUserByEmail } from '@/app/data/user';
import { signIn } from '@/auth';
import { DEFAULT_SIGNIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { generateVerificationToken } from '@/lib/tokens';

export const signinAction = async (values: z.infer<typeof signinSchema>) => {
    // console.log("values from server action", values);
    const validatedFields = signinSchema.safeParse(values);

    if(!validatedFields.success){
        return { error: "Invalid fields!" };
    }
    const {email, password} = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    // console.log("existingUser", existingUser);
    if(!existingUser || !existingUser.password || !existingUser.email){
        return { error: "User does not exist!" };
    }

    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email);
        return { success: "Confirmation email sent! Please verify your email.", verificationToken };
    }

    try {
        await signIn("credentials", {
            email, 
            password, 
            redirectTo: DEFAULT_SIGNIN_REDIRECT // optional
        })
        return { success: "Signed in successfully!" };
    } catch (error) {
        if(isRedirectError(error)){
            throw error; // rethrow if it's a redirect error. Handle NextJS redirect
        }

        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin":
                    return {error: "Invalid credentials!"};
                default:
                    return {error: "An error occurred while signing in!"};
            }
        }
        // console.error("--- Error during sign in:", error);
        throw error; // rethrow if not an AuthError
    }
}

export const signupAction = async (values: z.infer<typeof signupSchema>) => {
    // console.log("values from server action", values);
    const validatedFields = signupSchema.safeParse(values);

    if(!validatedFields.success){
        return { error: "Invalid fields!" };
    }

    const {name, email, password} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return { error: "User already exists!" };
    }

    await db.user.create({
        data: {
            name, email, password: hashedPassword
        }
    });

    // Verification part
    const verificationToken = await generateVerificationToken(email);

    return { success: "Email confirmation sent! Please check your email.", verificationToken };
}
