"use server";

import {
  createPasswordResetToken,
  sendPasswordResetEmail,
} from "@/lib/passwordReset";
import prisma from "@/lib/prisma";
import {
  requestPasswordResetSchema,
  RequestPasswordResetValues,
} from "@/lib/validation";

export const requestPasswordReset = async (
  data: RequestPasswordResetValues,
): Promise<{ success?: boolean; error?: string }> => {
  try {
    const { email } = requestPasswordResetSchema.parse(data);

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      return { success: true };
    }

    const token = await createPasswordResetToken(user.id);

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

    console.log("Password reset link:", resetLink);

    const emailResult = await sendPasswordResetEmail(email, resetLink);

    if (!emailResult.success) {
      console.error(
        `Failed to send password reset email to ${email}:`,
        emailResult.error || "Unknown error",
      );
      return {
        error: "Failed to send password reset email. Please try again later. ",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    return { error: "Something went wrong. Please try again later." };
  }
};
