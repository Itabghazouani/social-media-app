"use server";

import {
  lucia,
  validateRequest,
  prisma,
  createSessionCookie,
} from "@/lib/actionsHelper";

import {
  generateEmailVerificationCode,
  sendVerificationEmail,
  verifyVerificationCode,
} from "@/lib/emailVerification";

export const verifyEmail = async (
  code: string,
): Promise<{ error?: string; success?: boolean; redirectUrl?: string }> => {
  const { user, session } = await validateRequest();

  if (!user || !session) {
    return { error: "unauthorized" };
  }

  if (!code) {
    return { error: "Verification code is required" };
  }

  try {
    const isValid = await verifyVerificationCode(user, code);

    if (!isValid) {
      return { error: "Invalid or expired verification code" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    await lucia.invalidateUserSessions(user.id);
    await createSessionCookie(user.id);

    return { success: true, redirectUrl: "/" };
  } catch (error) {
    console.error("Error verifying email:", error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const resendVerificationCode = async (): Promise<{
  error?: string;
}> => {
  const { user } = await validateRequest();

  if (!user) {
    return { error: "unauthorized" };
  }

  if (!user.email) {
    return { error: "No email address found" };
  }

  try {
    const lastCode = await prisma.emailVerificationCode.findUnique({
      where: { userId: user.id },
    });
    // Calculate when the last code was generated (expires_at minus code lifetime)
    const codeLifetimeMs = 10 * 60 * 1000; // 10 minutes in milliseconds
    const cooldownPeriodMs = 60 * 1000; // 1 minute in milliseconds

    if (lastCode) {
      const lastCodeGeneratedAt = new Date(
        lastCode.expiresAt.getTime() - codeLifetimeMs,
      );
      const timeSinceLastCodeMs =
        new Date().getTime() - lastCodeGeneratedAt.getTime();

      if (timeSinceLastCodeMs < cooldownPeriodMs) {
        const remainingSeconds = Math.ceil(
          (cooldownPeriodMs - timeSinceLastCodeMs) / 1000,
        );
        return {
          error: `Please wait ${remainingSeconds} seconds before requesting a new code`,
        };
      }
    }

    const code = await generateEmailVerificationCode(user.id, user.email);
    const emailResult = await sendVerificationEmail(user.email, code);

    if (!emailResult.success) {
      return { error: emailResult.error || "Failed to send verification code" };
    }

    return {};
  } catch (error) {
    console.error("Error resending verification code:", error);
    return { error: "Something went wrong. Please try again." };
  }
};
