import type { NextAuthConfig } from "next-auth"
import { signinSchema } from "./schemas"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail } from "./app/data/user";
import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default { providers: [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
        async authorize(credentials){
            const validatedFields = signinSchema.safeParse(credentials);
            // console.log("--- values from auth.config.ts", validatedFields);

            if(validatedFields.success){
                const {email, password} = validatedFields.data;

                const user = await getUserByEmail(email);
                if(!user || !user.password) return null; // case for social login

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if(isPasswordValid) return user;
            }
            return null; // Invalid credentials
        }
    })
] } satisfies NextAuthConfig 