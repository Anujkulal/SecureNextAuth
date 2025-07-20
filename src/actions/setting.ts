"use server"

import { getUserByEmail, getUserById } from "@/app/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { settingsSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { auth } from "@/auth"

export const settingsAction = async (values: z.infer<typeof settingsSchema>) => {
    const user = await currentUser();
    // console.log("Settings Action User: ", user);
    // console.log("Auth User: ", auth());
    if(!user){
        return  {error: "Unauthorized: User not found."};
    }

    const dbUser = await getUserById(user.id);
    if(!dbUser){
        return {error: "Unauthorized: User not found in the database."};
    }

    if(user.isOAuth){ // bcz these are all handled by OAuth providers
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined; // OAuth users cannot change email or password
    }

   /**
    * handle email change and unique email validation
    * */ 

    // if(values.email && values.email !== user.email){
    //     const existingUser = await getUserByEmail(values.email);
    //     if(existingUser && existingUser.id !== user.id) {
    //         return { error: "Email already exists. Please use a different email." };
    //     }

    //     const verificationToken = await generateVerificationToken(values.email);
    //     await sendVerificationEmail(verificationToken.email, verificationToken.token);
    //     return { success: "Email updated successfully. Please check your email for verification." };
    // }


    if(values.password && values.newPassword && dbUser.password){
        const passwordMatch = await bcrypt.compare(values.password, dbUser.password);
        if(!passwordMatch){
            return { error: "Current password is incorrect." };
        }
        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        values.password = hashedPassword; // update password with new hashed password
        values.newPassword = undefined; // clear newPassword field after hashing
    }

    const updatedUser = await db.user.update({
        where: {id: user.id},
        data: {
            ...values,
        }
    })

    

    return { success: "Settings updated successfully." };
}