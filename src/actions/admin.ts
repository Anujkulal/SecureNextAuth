"use server"

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const adminAction = async () => {
    const role = await currentRole();

    if (role === UserRole.ADMIN) {
        return { success: true, message: "Action performed successfully." };
    }
    return { success: false, message: "Forbidden: You do not have permission to perform this action." };
}