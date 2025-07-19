import NextAuth, {type DefaultSession} from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient, UserRole } from "@prisma/client"
import authConfig from "./auth.config"
import { db } from "./lib/db"
import { getUserById } from "./app/data/user"

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole | "ADMIN" | "USER";
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

      //2FA


      return true;
    },
    
    async jwt({token}){ // token is reliable than the user or other objects
      // console.log("JWT Callback", token);
      // token.customField = "test";

      if(!token.sub) return token;

      const existingUser = await getUserById(token.sub); // use getUserById instead of email bcz id is a primary key and more reliable and faster.
      if(!existingUser) return token;

      token.role = existingUser.role; // add role to the token
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

      return session;
    },
    
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})