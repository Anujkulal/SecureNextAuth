/**
 * @file routes.ts
 * @description This file contains the public routes for the application.
 *              Public routes are accessible without authentication.
 *              They are used for pages that do not require user authentication.
 *              These routes are not protected by the authentication middleware.
 * @type {string[]}
 */

export const publicRoutes = ["/"];


/**
 * @description This file contains the authentication routes for the application.
 *              Authentication routes are used for user sign-in and sign-up.
 * @type {string[]}
 */

export const authRoutes = [
    "/auth/signin",
    "/auth/signup",
    "/auth/error",
]

export const apiAuthPrefix = "/api/auth";

// This is the default redirect path after signing in.
export const DEFAULT_SIGNIN_REDIRECT = "/settings"; // can be a dashboard page


