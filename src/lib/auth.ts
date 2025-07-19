import { auth } from "@/auth";

export const currentUser = async () => {
    const session = await auth();
    // if (!session) {
    //     return null;
    // }
    return session?.user;
}
export const currentRole = async () => {
    const session = await auth();
    // if (!session) {
    //     return null;
    // }
    return session?.user?.role;
}