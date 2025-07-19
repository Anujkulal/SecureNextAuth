import crypto from "crypto";
import { getVerificationTokenByEmail } from "@/app/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/app/data/password-reset";
import { getTwoFactorTokenByEmail } from "@/app/data/two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5*60 * 1000); // 5 minutes from now (add 5 min), calculates in milliseconds

  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    })
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    }
  })
  return twoFactorToken;
}

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now (add 1 hr), calculates in milliseconds

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return verificationToken;
};


export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now (add 1 hr), calculates in milliseconds
const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken  = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    }
  })

  return passwordResetToken;
}

