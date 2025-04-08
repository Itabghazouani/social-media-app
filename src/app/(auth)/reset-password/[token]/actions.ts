"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import bcrypt from "bcrypt";
import {
  deletePasswordResetToken,
  validatePasswordResetToken,
} from "@/lib/passwordReset";
import { resetPasswordSchema, TResetPasswordValues } from "@/lib/validation";
import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { createSessionCookie } from "@/lib/createSessionCookie";

export const resetPassword = async (
  token: string,
  data: TResetPasswordValues,
): Promise<{ error?: string }> => {
  try {
    const { password } = resetPasswordSchema.parse(data);

    const userId = await validatePasswordResetToken(token);

    if (!userId) {
      return {
        error:
          "Invalid or expired password reset link. PLease request a new one.",
      };
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await lucia.invalidateUserSessions(userId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
      },
    });

    await deletePasswordResetToken(token);

    await createSessionCookie(userId);

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error in resetPassword:", error);
    return { error: "Something went wrong. Please try again later." };
  }
};
