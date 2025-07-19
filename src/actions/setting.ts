"use server"

import { getUserById } from "@/app/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { settingsSchema } from "@/schemas";
import * as z from "zod";

export const settingsAction = async (values: z.infer<typeof settingsSchema>) => {
    const user = await currentUser();
    if(!user){
        return  {error: "Unauthorized: User not found."};
    }

    const dbUser = await getUserById(user.id);
    if(!dbUser){
        return {error: "Unauthorized: User not found in the database."};
    }

    await db.user.update({
        where: {id: user.id},
        data: {
            ...values,
        }
    })

    return { success: "Settings updated successfully." };
}