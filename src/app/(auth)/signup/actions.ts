"use server";

import { createSessionCookie } from "@/lib/createSessionCookie";
import {
  generateEmailVerificationCode,
  sendVerificationEmail,
} from "@/lib/emailVerification";
import prisma from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import bcrypt from "bcrypt";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export const signUp = async (
  credentials: SignUpValues,
): Promise<{ error?: string; loading?: boolean }> => {
  try {
    const { username, email, password } = signUpSchema.parse(credentials);

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const userId = generateIdFromEntropySize(10);

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        loading: true,
        error: "Username is already taken.",
      };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email is already taken.",
      };
    }

    await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        email,
        passwordHash,
        emailVerified: false,
      },
    });

    const verificationCode = await generateEmailVerificationCode(userId, email);
    const emailResult = await sendVerificationEmail(email, verificationCode);

    if (!emailResult.success) {
      console.error(
        `Failed to send verification email to ${email}: ${emailResult.error}`,
      );
      return {
        error: "Failed to send verification email.",
      };
    }

    await createSessionCookie(userId);

    return redirect("/verify-email");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error :", error);
    return {
      error: "Something went wrong. Please try again later.",
    };
  }
};
