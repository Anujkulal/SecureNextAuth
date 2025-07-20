import NextAuth, {type DefaultSession} from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient, UserRole } from "@prisma/client"
import authConfig from "./auth.config"
import { db } from "./lib/db"
import { getUserById } from "./app/data/user"
import { getTwoFactorConfirmationByUserId } from "./app/data/two-factor-confirmation"
import { getAccountByUserId } from "./app/data/accounts"

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole | "ADMIN" | "USER";
  isTwoFactorEnabled?: boolean; // optional field for 2FA
  isOAuth: boolean;
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Error code passed in query string as ?error=
  },
  events: {
    async linkAccount({user}){ // This event is triggered when a user links an account (e.g., specially for OAuth)
      await db.user.update({
        where: {id: user.id},
        data: { emailVerified: new Date()}
      })
    }
  },
  callbacks: {
    async signIn({user, account}){
      // console.log("Signin callback from auth.ts::: ",user, account);
      
      if(account?.provider !== "credentials"){ // allow sign in for OAuth
        return true; 
      }

      // only for production, not for development
      // if(process.env.NODE_ENV !== "development" && !user.emailVerified){
      const existingUser = await getUserById(user.id);
      if(!existingUser?.emailVerified) return false; // block users from signing in if their email is not verified

      //2FA (TWO FACTOR AUTHENTICATION)
      // if(process.env.NODE_ENV !== "development" && !existingUser?.isTwoFactorEnabled){
      if(existingUser?.isTwoFactorEnabled){
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        // console.log("Two Factor Confirmation: ", {twoFactorConfirmation});
        
        if(!twoFactorConfirmation) return false;

        // delete 2FA for next signin
        await db.twoFactorConfirmation.delete({
          where: {id: twoFactorConfirmation.id}
        })
      }

      return true;
    },
    
    async jwt({token}){ // token is reliable than the user or other objects
      // console.log("JWT Callback", token);
      // token.customField = "test";

      // console.log("Called jwt callback from auth.ts");

      if(!token.sub) return token;
 
      const existingUser = await getUserById(token.sub); // use getUserById instead of email bcz id is a primary key and more reliable and faster.
      if(!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth  = !!existingAccount; // check if the user has an OAuth account linked

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role; // add role to the token
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled; // add isTwoFactorEnabled to the token
      return token;
    },

    async session({token, session}){
      // console.log("Session Callback", token, session);

      if(token.sub && session.user){
        session.user.id = token.sub;
      }
      if(token.role && session.user) {
        /**
         * Here we are extending the session user object to include the role.
         * for some reason, the types are not working.
         * so we are using a type assertion to set the role.
        */
       // session.user.role = token.role as "ADMIN" | "USER"; // add role to the session
       
       // Here we are using a type assertion as UserRole to set the role.
       session.user.role = token.role as UserRole; // add role to the session
      }
      if(session.user){
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean; // add isTwoFactorEnabled to the session
      }
      
      if(session.user){
        session.user.name = token.name as string; // add name to the session
        session.user.email = token.email as string; // add email to the session
        session.user.isOAuth = token.isOAuth as boolean; // add isOAuth to the session
      }

      // console.log("Session Callback from auth.ts: ", session);
      return session;
    },
    
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})