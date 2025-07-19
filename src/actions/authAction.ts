"use server";

import {
  forgotPasswordSchema,
  newPasswordSchema,
  signinSchema,
  signupSchema,
} from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/app/data/user";
import { signIn } from "@/auth";
import { DEFAULT_SIGNIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import {
  sendPasswordResetEmail,
  sendTwoFactorEmail,
  sendVerificationEmail,
} from "@/lib/mail";
import { getVerificationTokenByToken } from "@/app/data/verification-token";
import { getPasswordResetTokenByToken } from "@/app/data/password-reset";
import { getTwoFactorTokenByEmail } from "@/app/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/app/data/two-factor-confirmation";
import { signOut } from "@/auth";

export const signOutAction = async () => {
  await signOut();
}

export const signinAction = async (values: z.infer<typeof signinSchema>) => {
  // console.log("values from server action", values);
  const validatedFields = signinSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  // console.log("existingUser", existingUser);
  if (!existingUser || !existingUser.password || !existingUser.email) {
    return { error: "User does not exist!" };
  }

  // use only for production, not for development
  // if(process.env.NODE_ENV !== "development" && !existingUser.emailVerified){
  if (!existingUser.emailVerified) {
    // Verification part
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return {
      success: "Confirmation email sent! Please verify your email.",
      verificationToken,
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "Invalid Code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid Code!" };
      }
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "Code has expired!" };
      }
      // delete the token after successful verification
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingTwoFactorConfirmation =
        await getTwoFactorConfirmationByUserId(existingUser.id);
      if (existingTwoFactorConfirmation) {
        // delete the existing two factor confirmation
        await db.twoFactorConfirmation.delete({
          where: { id: existingTwoFactorConfirmation.id },
        });
      }

      // create a two factor confirmation
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_SIGNIN_REDIRECT, // optional
    });
    return { success: "Signed in successfully!" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error; // rethrow if it's a redirect error. Handle NextJS redirect
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "An error occurred while signing in!" };
      }
    }
    // console.error("--- Error during sign in:", error);
    // return { error: "An unexpected error occurred during sign-in!" };
    throw error; // rethrow if not an AuthError
  }
};

export const signupAction = async (values: z.infer<typeof signupSchema>) => {
  // console.log("values from server action", values);
  const validatedFields = signupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "User already exists!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Verification part
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: "Email confirmation sent! Please check your email.",
    verificationToken,
  };
};

/**
 * Used only for production, not for development
 * used to verify the token from the email
 * @param token
 * @returns
 */
export const newVerificationAction = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  // console.log("existingToken", existingToken);
  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "User does not exist!" };

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(), // set emailVerified to current date
      email: existingToken.email, // update email to the verified email
    },
  });
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified successfully!" };
};

export const forgotPasswordAction = async (
  values: z.infer<typeof forgotPasswordSchema>
) => {
  const validatedFields = forgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "User does not exist!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Please check your email." };
};

export const newPasswordAction = async (
  values: z.infer<typeof newPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    return { error: "Token is required!" };
  }

  const validatedFields = newPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { password } = validatedFields.data;
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "User does not exist!" };

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated successfully!" };
};
