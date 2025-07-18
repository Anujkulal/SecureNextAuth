// import { auth } from "@/auth"
import authConfig from "./auth.config"
import NextAuth from "next-auth"
import { apiAuthPrefix, authRoutes, DEFAULT_SIGNIN_REDIRECT, publicRoutes } from "./routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig)
 
export default auth((req) => {
  const {nextUrl} = req;
  const isSignedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  // console.log("isApiAuthRoute", isApiAuthRoute);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  // console.log("isPublicRoute", isPublicRoute);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname); //if user is signedin, they are redirected to the settings page if they try to access the auth route
  // console.log("isAuthRoute", isAuthRoute);
  // console.log("isSignedIn", isSignedIn);

  if(isApiAuthRoute) return null;

  if(isAuthRoute){
    if(isSignedIn){
      return NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
    }
    return null; // Allow access to auth routes if not signed in
  }

  if(!isSignedIn && !isPublicRoute){
    return NextResponse.redirect(new URL("/auth/signin", nextUrl));
  }

  return null; // Allow access to public routes or if signed in
})
 
export const config = {
//   matcher: ["/auth/signin"], // Invokes the middleware for the different routes
    matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ], // from clerk matcher example
}